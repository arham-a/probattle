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

    if (rating < 1 || rating > 5) {
      newErrors.rating = "Please select a rating between 1 and 5 stars";
    }

    if (!review.trim()) {
      newErrors.review = "Please write a review";
    } else if (review.trim().length < 10) {
      newErrors.review = "Review must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const reviewData: CreateRatingRequest = {
        bookingId: booking.id,
        score: rating,
        review: review.trim(),
      };

      await onSubmitReview(reviewData);
      
      // Reset form
      setRating(5);
      setReview("");
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(5);
      setReview("");
      setErrors({});
      onClose();
    }
  };

  const StarRating = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`text-2xl transition-colors ${
            star <= rating ? 'text-warning' : 'text-default-300'
          } hover:text-warning`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-default-600">
        {rating} star{rating !== 1 ? 's' : ''}
      </span>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="2xl"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Write a Review</h2>
          <p className="text-sm text-default-600">Share your experience with this service</p>
        </ModalHeader>
        
        <ModalBody className="gap-4">
          {/* Service and Provider Info */}
          <div className="bg-default-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Avatar
                src={booking.provider.avatar || undefined}
                name={booking.provider.name}
                size="sm"
              />
              <div>
                <h3 className="font-semibold">{booking.service.title}</h3>
                <p className="text-sm text-default-600">by {booking.provider.name}</p>
              </div>
            </div>
            <div className="text-sm text-default-600">
              <p>Date: {new Date(booking.requestedDate).toLocaleDateString()}</p>
              <p>Duration: {booking.duration} hour{parseFloat(booking.duration) !== 1 ? 's' : ''}</p>
              <p>Total: ${booking.totalPrice}</p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-medium text-default-700 mb-2 block">
              Rating *
            </label>
            <StarRating />
            {errors.rating && (
              <p className="text-danger text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <Textarea
              label="Your Review *"
              placeholder="Tell others about your experience with this service..."
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                if (errors.review) {
                  setErrors(prev => ({ ...prev, review: "" }));
                }
              }}
              isInvalid={!!errors.review}
              errorMessage={errors.review}
              minRows={4}
              maxRows={8}
              description="Minimum 10 characters"
            />
          </div>

          {/* Rating Guidelines */}
          <div className="bg-primary-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-primary-700 mb-2">Rating Guidelines:</h4>
            <div className="text-xs text-primary-600 space-y-1">
              <p>★★★★★ Excellent - Exceeded expectations</p>
              <p>★★★★☆ Good - Met expectations</p>
              <p>★★★☆☆ Average - Acceptable service</p>
              <p>★★☆☆☆ Poor - Below expectations</p>
              <p>★☆☆☆☆ Very Poor - Unsatisfactory</p>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            variant="flat" 
            onPress={handleClose}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}