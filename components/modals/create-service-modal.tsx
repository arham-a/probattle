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
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { ServiceCategory, PriceType, CreateServiceRequest } from "@/lib/api/my-services";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onCreateService: (serviceData: CreateServiceRequest) => Promise<void>;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const CATEGORY_OPTIONS = [
  { key: ServiceCategory.TUTORING, label: "📚 Tutoring", icon: "📚" },
  { key: ServiceCategory.REPAIR, label: "🔧 Repair", icon: "🔧" },
  { key: ServiceCategory.CLEANING, label: "🧹 Cleaning", icon: "🧹" },
  { key: ServiceCategory.GARDENING, label: "🌱 Gardening", icon: "🌱" },
  { key: ServiceCategory.TECH_SUPPORT, label: "💻 Tech Support", icon: "💻" },
  { key: ServiceCategory.PET_CARE, label: "🐕 Pet Care", icon: "🐕" },
  { key: ServiceCategory.DELIVERY, label: "📦 Delivery", icon: "📦" },
  { key: ServiceCategory.HANDYMAN, label: "🔨 Handyman", icon: "🔨" },
  { key: ServiceCategory.COOKING, label: "👨‍🍳 Cooking", icon: "👨‍🍳" },
  { key: ServiceCategory.FITNESS, label: "💪 Fitness", icon: "💪" },
  { key: ServiceCategory.OTHER, label: "📋 Other", icon: "📋" },
];

export default function CreateServiceModal({ isOpen, onClose, onSuccess, onCreateService }: CreateServiceModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as ServiceCategory | "",
    price: "",
    priceType: PriceType.HOURLY,
    latitude: "",
    longitude: "",
    availability: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Service title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Service description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = "Please get your current location or enter coordinates";
    }

    if (formData.availability.length === 0) {
      newErrors.availability = "Please select at least one day";
    }

    // Validate availability order
    if (formData.availability.length > 0) {
      const selectedDaysIndices = formData.availability.map(day => DAYS_OF_WEEK.indexOf(day));
      const sortedIndices = [...selectedDaysIndices].sort((a, b) => a - b);
      
      if (!selectedDaysIndices.every((index, i) => index === sortedIndices[i])) {
        newErrors.availability = "Please select days in order (Monday to Sunday)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setIsGettingLocation(false);
        
        // Clear location error if it exists
        if (errors.location) {
          setErrors(prev => ({ ...prev, location: "" }));
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please enter coordinates manually.");
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const serviceData: CreateServiceRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category as ServiceCategory,
        price: formData.price,
        priceType: formData.priceType,
        availability: formData.availability,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      await onCreateService(serviceData);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        priceType: PriceType.HOURLY,
        latitude: "",
        longitude: "",
        availability: [],
      });
      setErrors({});
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to create service:", error);
      // Error is handled by the parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAvailabilityChange = (selectedDays: string[]) => {
    // Sort the selected days according to the week order
    const sortedDays = selectedDays.sort((a, b) => {
      return DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b);
    });
    
    handleInputChange("availability", sortedDays);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Create New Service</h2>
            <p className="text-sm text-default-600">Share your skills with the community</p>
          </ModalHeader>
          
          <ModalBody className="gap-4">
            <Input
              label="Service Title"
              placeholder="e.g., Math Tutoring for High School Students"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              isInvalid={!!errors.title}
              errorMessage={errors.title}
              isRequired
            />

            <Textarea
              label="Service Description"
              placeholder="Describe your service in detail. What do you offer? What makes you qualified?"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("description", e.target.value)}
              isInvalid={!!errors.description}
              errorMessage={errors.description}
              minRows={3}
              isRequired
            />

            <Select
              label="Category"
              placeholder="Select a category"
              selectedKeys={formData.category ? [formData.category] : []}
              onSelectionChange={(keys) => handleInputChange("category", Array.from(keys)[0] as ServiceCategory || "")}
              isInvalid={!!errors.category}
              errorMessage={errors.category}
              isRequired
            >
              {CATEGORY_OPTIONS.map((category) => (
                <SelectItem key={category.key}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price"
                placeholder="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                isInvalid={!!errors.price}
                errorMessage={errors.price}
                startContent="$"
                type="number"
                step="0.01"
                min="0"
                isRequired
              />

              <Select
                label="Price Type"
                selectedKeys={[formData.priceType]}
                onSelectionChange={(keys) => handleInputChange("priceType", Array.from(keys)[0] as PriceType)}
              >
                <SelectItem key={PriceType.HOURLY}>Per Hour</SelectItem>
                <SelectItem key={PriceType.DAILY}>Per Day</SelectItem>
                <SelectItem key={PriceType.FIXED}>Fixed Price</SelectItem>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="flat"
                  color="primary"
                  onPress={getCurrentLocation}
                  isLoading={isGettingLocation}
                  startContent={!isGettingLocation ? "📍" : undefined}
                >
                  {isGettingLocation ? "Getting Location..." : "Get Current Location"}
                </Button>
                {formData.latitude && formData.longitude && (
                  <span className="text-sm text-success">
                    ✓ Location captured
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  placeholder="24.9019990"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange("latitude", e.target.value)}
                  type="number"
                  step="any"
                />

                <Input
                  label="Longitude"
                  placeholder="67.1149670"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange("longitude", e.target.value)}
                  type="number"
                  step="any"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-default-700 mb-2 block">
                Availability (Select days in order) *
              </label>
              <CheckboxGroup
                value={formData.availability}
                onValueChange={handleAvailabilityChange}
                isInvalid={!!errors.availability}
                errorMessage={errors.availability}
                isRequired
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <Checkbox key={day} value={day} size="sm">
                      {day}
                    </Checkbox>
                  ))}
                </div>
              </CheckboxGroup>
              {formData.availability.length > 0 && (
                <div className="mt-2 text-sm text-default-600">
                  Selected: {formData.availability.join(", ")}
                </div>
              )}
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              type="submit"
              isLoading={isLoading}
            >
              {isLoading ? "Creating..." : "Create Service"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}