"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import NextLink from "next/link";
import { mockUsers, serviceCategories } from "@/data/mockData";

export default function CreateServicePage() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get('userId') || "1";
  const currentUser = mockUsers.find(user => user.id === userIdFromUrl);

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

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger">Access Denied</h1>
          <p className="text-default-600 mt-2">Please log in to create a service.</p>
        </div>
      </div>
    );
  }

  // Only show this page for providers and dual role users
  if (currentUser.role === 'seeker') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-warning">Page Not Available</h1>
          <p className="text-default-600 mt-2">This page is only available for service providers.</p>
          <Button as={NextLink} href={`/dashboard?userId=${currentUser.id}`} color="primary" className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
      // Redirect to my services page
      window.location.href = `/my-services?userId=${currentUser.id}`;
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Service</h1>
        <p className="text-default-600">
          Share your skills with the community and start earning
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </CardHeader>
              <CardBody className="space-y-4">
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
                  minRows={4}
                  isRequired
                />

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
                  placeholder="e.g., Downtown District, Tech Quarter"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  isInvalid={!!errors.location}
                  errorMessage={errors.location}
                  isRequired
                />
              </CardBody>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Pricing</h3>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Availability</h3>
              </CardHeader>
              <CardBody>
                <CheckboxGroup
                  value={formData.availability}
                  onValueChange={(value) => handleInputChange("availability", value)}
                  isInvalid={!!errors.availability}
                  errorMessage={errors.availability}
                  isRequired
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availabilityOptions.map((option) => (
                      <Checkbox key={option.key} value={option.key}>
                        {option.label}
                      </Checkbox>
                    ))}
                  </div>
                </CheckboxGroup>
              </CardBody>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Tags</h3>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>
          </div>

          {/* Preview/Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Preview</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {formData.title || "Your Service Title"}
                    </h4>
                    <p className="text-sm text-default-600">
                      by {currentUser.name}
                    </p>
                  </div>

                  {formData.category && (
                    <Chip size="sm" variant="flat" color="primary">
                      {serviceCategories.find(cat => cat.key === formData.category)?.icon} {formData.category}
                    </Chip>
                  )}

                  <p className="text-sm text-default-600">
                    {formData.description || "Your service description will appear here..."}
                  </p>

                  {formData.location && (
                    <p className="text-sm text-default-500">
                      📍 {formData.location}
                    </p>
                  )}

                  {formData.price && (
                    <div className="text-lg font-bold text-primary">
                      ${formData.price}/{formData.priceType}
                    </div>
                  )}

                  {formData.availability.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Available:</p>
                      <div className="space-y-1">
                        {formData.availability.slice(0, 3).map((avail) => (
                          <p key={avail} className="text-xs text-default-600">
                            • {availabilityOptions.find(opt => opt.key === avail)?.label}
                          </p>
                        ))}
                        {formData.availability.length > 3 && (
                          <p className="text-xs text-default-500">
                            +{formData.availability.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Actions */}
            <Card>
              <CardBody>
                <div className="space-y-3">
                  <Button
                    type="submit"
                    color="primary"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                  >
                    {isLoading ? "Creating Service..." : "Create Service"}
                  </Button>
                  
                  <Button
                    as={NextLink}
                    href={`/dashboard?userId=${currentUser.id}`}
                    variant="flat"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}