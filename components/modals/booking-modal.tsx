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
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Divider } from "@heroui/divider";
import { CalendarIcon, ClockIcon } from "@/components/icons";
import { Service } from "@/lib/api/services";
import { CreateBookingRequest, bookingService } from "@/lib/api/booking";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  onSuccess?: () => void;
}

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const DURATION_OPTIONS = [
  { value: 1, label: "1 hour" },
  { value: 2, label: "2 hours" },
  { value: 3, label: "3 hours" },
  { value: 4, label: "4 hours" },
  { value: 6, label: "6 hours" },
  { value: 8, label: "8 hours" },
];

export default function BookingModal({ isOpen, onClose, service, onSuccess }: BookingModalProps) {
  const [requestedDate, setRequestedDate] = useState("");
  const [requestedTime, setRequestedTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!requestedDate || !requestedTime) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate that the selected date falls on an available day
    const selectedDate = new Date(requestedDate);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!service.availability.includes(dayName)) {
      setError(`Service is not available on ${dayName}. Available days: ${service.availability.join(', ')}`);
      return;
    }

    // Validate that the date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Please select a future date");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const bookingData: CreateBookingRequest = {
        serviceId: service.id,
        requestedDate,
        requestedTime,
        duration,
      };

      await bookingService.createBooking(bookingData);
      
      // Show success message
      alert('Booking request sent successfully!');
      
      // Reset form
      setRequestedDate("");
      setRequestedTime("");
      setDuration(1);
      
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRequestedDate("");
    setRequestedTime("");
    setDuration(1);
    setError("");
    onClose();
  };

  const calculateTotal = () => {
    const price = parseFloat(service.price);
    if (service.priceType === 'hourly') {
      return price * duration;
    } else if (service.priceType === 'daily') {
      return price;
    } else {
      return price; // fixed price
    }
  };

  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Book Service</h2>
          <p className="text-sm text-default-600">{service.title}</p>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-4">
            {/* Service Details */}
            <div className="bg-default-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Service Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-default-600">Provider:</span>
                  <span>{service.provider.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Price:</span>
                  <span>{formatPrice(parseFloat(service.price))}{service.priceType === 'hourly' ? '/hr' : service.priceType === 'daily' ? '/day' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Available Days:</span>
                  <span>{service.availability.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-4">
              <Input
                type="date"
                label="Requested Date"
                placeholder="Select date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                min={getMinDate()}
                startContent={<CalendarIcon className="text-default-400" />}
                isRequired
              />

              <Select
                label="Requested Time"
                placeholder="Select time"
                selectedKeys={requestedTime ? [requestedTime] : []}
                onSelectionChange={(keys) => setRequestedTime(Array.from(keys)[0] as string || "")}
                startContent={<ClockIcon className="text-default-400" />}
                isRequired
              >
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={time}>
                    {time}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Duration"
                placeholder="Select duration"
                selectedKeys={[duration.toString()]}
                onSelectionChange={(keys) => setDuration(Number(Array.from(keys)[0]))}
                isRequired
              >
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Price Calculation */}
            {requestedDate && requestedTime && (
              <>
                <Divider />
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-default-600">Date & Time:</span>
                      <span>{requestedDate} at {requestedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-default-600">Duration:</span>
                      <span>{duration} hour{duration > 1 ? 's' : ''}</span>
                    </div>
                    <Divider />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount:</span>
                      <span className="text-primary">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="text-danger text-sm bg-danger-50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            variant="flat" 
            onPress={handleClose}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={!requestedDate || !requestedTime}
          >
            Book Service
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}