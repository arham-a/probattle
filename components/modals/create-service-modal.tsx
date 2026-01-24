"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { serviceCategories } from "@/data/mockData";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateServiceModal({ isOpen, onClose, onSuccess }: CreateServiceModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    priceType: "hourly",
    location: "",
    availability: [] as string[],
    tags: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const availabilityOptions = [
    { key: "weekdays-morning", label: "Weekdays Morning (9AM-12PM)" },
    { key: "weekdays-afternoon", label: "Weekdays Afternoon (12PM-5PM)" },
    { key: "weekdays-evening", label: "Weekdays Evening (5PM-9PM)" },
    { key: "weekends-morning", label: "Weekends Morning (9AM-12PM)" },
    { key: "weekends-afternoon", label: "Weekends Afternoon (12PM-5PM)" },
    { key: "weekends-evening", label: "Weekends Evening (5PM-9PM)" },
    { key: "weekdays", label: "All Weekdays" },
    { key: "weekends", label: "All Weekends" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Service title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Service description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.availability.length === 0) {
      newErrors.availability = "Please select at least one availability option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Service creation:", formData);
      alert("Service created successfully!");
      setIsLoading(false);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        priceType: "hourly",
        location: "",
        availability: [],
        tags: "",
      });
      setErrors({});
      
      if (onSuccess) onSuccess();
      onClose();
    }, 2000);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const tagArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

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
              placeholder="Describe your service in detail. What do you offer? What makes you qualified? What can clients expect?"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("description", e.target.value)}
              isInvalid={!!errors.description}
              errorMessage={errors.description}
              minRows={3}
              isRequired
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                placeholder="Select a category"
                selectedKeys={formData.category ? [formData.category] : []}
                onSelectionChange={(keys) => handleInputChange("category", Array.from(keys)[0] as string || "")}
                isInvalid={!!errors.category}
                errorMessage={errors.category}
                isRequired
              >
                {serviceCategories.map((category) => (
                  <SelectItem key={category.key}>
                    {category.icon} {category.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Location/Neighborhood"
                placeholder="e.g., Downtown District"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                isInvalid={!!errors.location}
                errorMessage={errors.location}
                isRequired
              />
            </div>

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
                isRequired
              />

              <Select
                label="Price Type"
                selectedKeys={[formData.priceType]}
                onSelectionChange={(keys) => handleInputChange("priceType", Array.from(keys)[0] as string)}
              >
                <SelectItem key="hourly">Per Hour</SelectItem>
                <SelectItem key="daily">Per Day</SelectItem>
                <SelectItem key="fixed">Fixed Price</SelectItem>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-default-700 mb-2 block">
                Availability *
              </label>
              <CheckboxGroup
                value={formData.availability}
                onValueChange={(value) => handleInputChange("availability", value)}
                isInvalid={!!errors.availability}
                errorMessage={errors.availability}
                isRequired
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availabilityOptions.map((option) => (
                    <Checkbox key={option.key} value={option.key} size="sm">
                      {option.label}
                    </Checkbox>
                  ))}
                </div>
              </CheckboxGroup>
            </div>

            <div>
              <Input
                label="Tags (comma separated)"
                placeholder="e.g., math, calculus, physics, tutoring"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                description="Add relevant keywords to help people find your service"
              />
              {tagArray.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagArray.map((tag, index) => (
                    <Chip key={index} size="sm" variant="flat">
                      {tag}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
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