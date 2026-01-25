"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Booking } from "@/lib/api/bookings";
import { CreateRatingRequest } from "@/lib/api/ratings";
import { StarIcon } from "@/components/icons";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onSubmitReview: (reviewData: CreateRatingRequest) => Promise<void>;
}

export default function ReviewModal({ isOpen, onClose, booking, onSubmitReview }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (rating < 1 || rating > 5) newErrors.rating = "Select rating (1-5)";
    if (!review.trim()) {
      newErrors.review = "Review is required";
    } else if (review.trim().length < 10) {
      newErrors.review = "Min 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSubmitReview({
        bookingId: booking.id,
        score: rating,
        review: review.trim(),
      });
      setRating(5);
      setReview("");
      setErrors({});
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      radius="lg"
      backdrop="blur"
      classNames={{
        base: "bg-background/80 dark:bg-default-100/90 backdrop-blur-md border-none shadow-2xl",
        header: "border-b border-default-100 dark:border-default-100/10 py-4",
        footer: "border-t border-default-100 dark:border-default-100/10 py-4",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-0.5">
          <h2 className="text-xl font-extrabold tracking-tight">Share Your Experience</h2>
          <p className="text-xs font-medium text-default-400">Your feedback helps the community grow.</p>
        </ModalHeader>

        <ModalBody className="py-8 gap-8">
          {/* Service Summary */}
          <div className="flex items-center gap-4 bg-default-50/50 dark:bg-default-50/5 p-4 rounded-xl border border-default-100 dark:border-default-100/10">
            <Avatar
              src={booking.provider.avatar || undefined}
              name={booking.provider.name}
              radius="lg"
              className="w-12 h-12 flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-default-800 truncate">{booking.service.title}</h3>
              <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Provided by {booking.provider.name}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center gap-3">
            <label className="text-xs font-bold text-default-500 uppercase tracking-widest">Your Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-all hover:scale-110 active:scale-95"
                >
                  <StarIcon
                    className={`w-10 h-10 ${star <= rating ? 'text-warning fill-current' : 'text-default-200'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <Textarea
            label="Write a Review"
            labelPlacement="outside"
            placeholder="Tell us what you liked about the service..."
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
              if (errors.review) setErrors({});
            }}
            isInvalid={!!errors.review}
            errorMessage={errors.review}
            minRows={3}
            radius="lg"
            classNames={{
              label: "text-xs font-bold text-default-500 uppercase tracking-widest mb-2 px-1",
              input: "text-sm font-medium p-4",
              inputWrapper: "bg-default-100/50 hover:bg-default-200/50 focus-within:bg-default-100 transition-colors border-none py-2",
            }}
          />
        </ModalBody>

        <ModalFooter className="flex gap-3">
          <Button
            variant="light"
            onPress={onClose}
            className="font-bold text-default-500"
            radius="lg"
          >
            Not Now
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            className="px-10 font-bold shadow-lg shadow-primary/20"
            radius="lg"
          >
            Post Review
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
