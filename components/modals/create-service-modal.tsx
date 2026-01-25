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
import { LocationIcon } from "@/components/icons";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onCreateService: (serviceData: CreateServiceRequest) => Promise<void>;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CATEGORY_OPTIONS = [
  { key: ServiceCategory.TUTORING, label: "Tutoring" },
  { key: ServiceCategory.REPAIR, label: "Repair" },
  { key: ServiceCategory.CLEANING, label: "Cleaning" },
  { key: ServiceCategory.GARDENING, label: "Gardening" },
  { key: ServiceCategory.TECH_SUPPORT, label: "Tech Support" },
  { key: ServiceCategory.PET_CARE, label: "Pet Care" },
  { key: ServiceCategory.DELIVERY, label: "Delivery" },
  { key: ServiceCategory.HANDYMAN, label: "Handyman" },
  { key: ServiceCategory.COOKING, label: "Cooking" },
  { key: ServiceCategory.FITNESS, label: "Fitness" },
  { key: ServiceCategory.OTHER, label: "Other" },
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
    if (!formData.title.trim()) newErrors.title = "Required";
    if (!formData.description.trim()) newErrors.description = "Required";
    else if (formData.description.length < 20) newErrors.description = "Min 20 chars";
    if (!formData.category) newErrors.category = "Required";
    if (!formData.price.trim()) newErrors.price = "Required";
    if (!formData.latitude || !formData.longitude) newErrors.location = "Required";
    if (formData.availability.length === 0) newErrors.availability = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setIsGettingLocation(false);
      },
      () => setIsGettingLocation(false),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await onCreateService({
        ...formData,
        category: formData.category as ServiceCategory,
        title: formData.title.trim(),
        description: formData.description.trim(),
      });
      onSuccess?.();
      onClose();
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      radius="lg"
      scrollBehavior="inside"
      placement="center"
      classNames={{
        wrapper: "p-2 sm:p-4",
        base: "max-h-[95vh] w-full max-w-3xl mx-auto bg-background shadow-2xl border-none",
        header: "border-b border-divider/50 px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0",
        body: "px-4 py-4 sm:px-6 sm:py-6 overflow-y-auto max-h-[60vh]",
        footer: "border-t border-divider/50 px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0",
        closeButton: "top-2 right-2 sm:top-4 sm:right-4"
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-primary">New Listing</h2>
            <p className="text-xs font-bold text-default-500 uppercase tracking-widest opacity-70">Expand your reach</p>
          </ModalHeader>

          <ModalBody>
            <div className="flex flex-col gap-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <Input
                  label="Listing Title"
                  placeholder="Professional Service Name"
                  labelPlacement="outside"
                  variant="flat"
                  radius="lg"
                  size="sm"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  isInvalid={!!errors.title}
                  errorMessage={errors.title}
                  classNames={{ 
                    label: "font-black text-xs uppercase mb-1",
                    input: "text-sm"
                  }}
                />

                <Textarea
                  label="Detailed Description"
                  placeholder="What makes your service unique? (Min 20 characters)"
                  labelPlacement="outside"
                  variant="flat"
                  radius="lg"
                  minRows={3}
                  maxRows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                  classNames={{ 
                    label: "font-black text-xs uppercase mb-1",
                    input: "text-sm"
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    labelPlacement="outside"
                    placeholder="Choose..."
                    variant="flat"
                    radius="lg"
                    size="sm"
                    selectedKeys={formData.category ? [formData.category] : []}
                    onSelectionChange={(keys) => handleInputChange("category", Array.from(keys)[0] as ServiceCategory)}
                    isInvalid={!!errors.category}
                    errorMessage={errors.category}
                    classNames={{ 
                      label: "font-black text-xs uppercase mb-1",
                      trigger: "min-h-10"
                    }}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c.key}>{c.label}</SelectItem>
                    ))}
                  </Select>

                  <div className="flex gap-2">
                    <Input
                      label="Price"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="flat"
                      radius="lg"
                      size="sm"
                      className="flex-1"
                      type="number"
                      startContent={<span className="text-default-400 font-bold text-sm">$</span>}
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      isInvalid={!!errors.price}
                      errorMessage={errors.price}
                      classNames={{ 
                        label: "font-black text-xs uppercase mb-1",
                        input: "text-sm"
                      }}
                    />
                    <Select
                      label="Unit"
                      labelPlacement="outside"
                      variant="flat"
                      radius="lg"
                      size="sm"
                      className="w-20"
                      selectedKeys={[formData.priceType]}
                      onSelectionChange={(keys) => handleInputChange("priceType", Array.from(keys)[0] as PriceType)}
                      classNames={{ 
                        label: "font-black text-xs uppercase mb-1",
                        trigger: "min-h-10"
                      }}
                    >
                      <SelectItem key={PriceType.HOURLY}>/hr</SelectItem>
                      <SelectItem key={PriceType.DAILY}>/day</SelectItem>
                      <SelectItem key={PriceType.FIXED}>fix</SelectItem>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Logistics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Location Section */}
                <div className="p-4 rounded-xl bg-default-50 border border-divider/50">
                  <p className="font-black text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Location
                  </p>
                  <div className="space-y-3">
                    <Button
                      color="primary"
                      variant="shadow"
                      radius="lg"
                      size="sm"
                      className="font-bold w-full"
                      onPress={getCurrentLocation}
                      isLoading={isGettingLocation}
                      startContent={<LocationIcon className="w-4 h-4" />}
                    >
                      Get Location
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-default-400 uppercase">Lat</span>
                        <p className="text-xs font-mono text-default-700 bg-background p-2 rounded border border-divider/40 truncate">
                          {formData.latitude || '0.000000'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-default-400 uppercase">Lng</span>
                        <p className="text-xs font-mono text-default-700 bg-background p-2 rounded border border-divider/40 truncate">
                          {formData.longitude || '0.000000'}
                        </p>
                      </div>
                    </div>
                    {errors.location && <p className="text-xs text-danger font-bold text-center">{errors.location}</p>}
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="p-4 rounded-xl bg-default-50 border border-divider/50">
                  <p className="font-black text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" /> Schedule
                  </p>
                  <CheckboxGroup
                    value={formData.availability}
                    onValueChange={(v) => handleInputChange("availability", v)}
                    classNames={{
                      wrapper: "grid grid-cols-2 gap-2"
                    }}
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <Checkbox 
                        key={day} 
                        value={day} 
                        size="sm"
                        classNames={{ 
                          label: "text-xs font-bold text-default-600"
                        }}
                      >
                        {day.slice(0, 3)}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                  {errors.availability && <p className="text-xs text-danger font-bold mt-2 text-center">{errors.availability}</p>}
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="light" 
              color="danger" 
              radius="lg" 
              size="sm"
              className="font-bold order-2 sm:order-1 w-full sm:w-auto" 
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              size="sm"
              radius="lg"
              type="submit"
              className="font-black px-8 shadow-lg shadow-primary/20 w-full sm:w-auto order-1 sm:order-2"
              isLoading={isLoading}
            >
              {isLoading ? "Creating..." : "Launch Service"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}