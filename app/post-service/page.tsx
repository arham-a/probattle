"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { RadioGroup, Radio } from "@heroui/radio";
import { Divider } from "@heroui/divider";
import { serviceCategories } from "@/data/mockData";
import { ServiceCategory } from "@/types";
import { useState } from "react";

export default function PostServicePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as ServiceCategory | "",
    price: "",
    priceType: "hourly" as "hourly" | "fixed" | "daily",
    location: "",
    availability: [] as string[],
    tags: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availabilityOptions = [
    { key: "weekdays-morning", label: "Weekdays Morning (6AM - 12PM)" },
    { key: "weekdays-afternoon", label: "Weekdays Afternoon (12PM - 6PM)" },
    { key: "weekdays-evening", label: "Weekdays Evening (6PM - 10PM)" },
    { key: "weekends-morning", label: "Weekends Morning (6AM - 12PM)" },
    { key: "weekends-afternoon", label: "Weekends Afternoon (12PM - 6PM)" },
    { key: "weekends-evening", label: "Weekends Evening (6PM - 10PM)" },
    { key: "flexible", label: "Flexible Schedule" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Service title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Service description is required";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would submit to an API
      console.log("Service posted:", formData);
      alert("Service posted successfully! (This is a demo)");
      
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
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const toggleAvailability = (option: string) => {
    const newAvailability = formData.availability.includes(option)
      ? formData.availability.filter(item => item !== option)
      : [...formData.availability, option];
    handleInputChange("availability", newAvailability);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Header */}
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Post Your Service</h1>
        <p className="text-xl text-default-600 mb-8 max-w-2xl mx-auto">
          Share your skills with the community. Create a service listing and start 
          connecting with neighbors who need your expertise.
        </p>
      </section>

      {/* Form */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Service Details</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
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
                label="Description"
                placeholder="Describe your service in detail. What do you offer? What makes you qualified?"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                isInvalid={!!errors.description}
                errorMessage={errors.description}
                minRows={4}
                isRequired
              />
              
              <Select
                label="Category"
                placeholder="Select a category"
                selectedKeys={formData.category ? [formData.category] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as ServiceCategory;
                  handleInputChange("category", selectedKey);
                }}
                isInvalid={!!errors.category}
                errorMessage={errors.category}
                isRequired
              >
                {serviceCategories.map((category) => (
                  <SelectItem key={category.key} textValue={category.label}>
                    {category.icon} {category.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Divider />

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              
              <div className="flex gap-4">
                <Input
                  label="Price"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  startContent="$"
                  type="number"
                  min="0"
                  step="0.01"
                  isInvalid={!!errors.price}
                  errorMessage={errors.price}
                  className="flex-1"
                  isRequired
                />
                
                <RadioGroup
                  label="Price Type"
                  value={formData.priceType}
                  onValueChange={(value) => handleInputChange("priceType", value)}
                  orientation="horizontal"
                  className="flex-1"
                >
                  <Radio value="hourly">Per Hour</Radio>
                  <Radio value="fixed">Fixed Price</Radio>
                  <Radio value="daily">Per Day</Radio>
                </RadioGroup>
              </div>
            </div>

            <Divider />

            {/* Location & Availability */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location & Availability</h3>
              
              <Input
                label="Service Location"
                placeholder="e.g., Downtown District, Your Home, Client's Location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                isInvalid={!!errors.location}
                errorMessage={errors.location}
                isRequired
              />
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  When are you available? *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availabilityOptions.map((option) => (
                    <Button
                      key={option.key}
                      variant={formData.availability.includes(option.key) ? "solid" : "bordered"}
                      color={formData.availability.includes(option.key) ? "primary" : "default"}
                      size="sm"
                      onClick={() => toggleAvailability(option.key)}
                      className="justify-start"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {errors.availability && (
                  <p className="text-danger text-sm mt-1">{errors.availability}</p>
                )}
              </div>
            </div>

            <Divider />

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Details</h3>
              
              <Input
                label="Tags (Optional)"
                placeholder="e.g., math, calculus, experienced, patient (separate with commas)"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                description="Add relevant keywords to help people find your service"
              />
              
              {formData.tags && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.split(",").map((tag, index) => (
                    <Chip key={index} size="sm" variant="flat" color="primary">
                      {tag.trim()}
                    </Chip>
                  ))}
                </div>
              )}
            </div>

            <Divider />

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                variant="flat"
                onClick={() => {
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
                }}
              >
                Clear Form
              </Button>
              <Button color="primary" type="submit" size="lg">
                Post Service
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardBody>
          <h3 className="text-lg font-semibold mb-3">💡 Tips for a Great Service Listing</h3>
          <ul className="space-y-2 text-sm text-default-600">
            <li>• <strong>Be specific:</strong> Clear titles and detailed descriptions get more bookings</li>
            <li>• <strong>Set fair prices:</strong> Research similar services in your area</li>
            <li>• <strong>Be responsive:</strong> Quick replies to booking requests build trust</li>
            <li>• <strong>Add photos:</strong> Visual examples of your work increase credibility (coming soon!)</li>
            <li>• <strong>Update availability:</strong> Keep your schedule current to avoid conflicts</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}