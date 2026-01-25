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
      size="4xl"
      radius="lg"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh] bg-background shadow-2xl border-none m-4",
        header: "border-b border-divider/50 px-6 py-4 md:px-8 md:py-6 flex-shrink-0",
        body: "gap-6 p-6 md:p-8 overflow-y-auto custom-scrollbar",
        footer: "border-t border-divider/50 px-6 py-4 md:px-8 md:py-6 flex-shrink-0",
        closeButton: "top-4 right-4"
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-primary">New Listing</h2>
            <p className="text-xs md:text-sm font-bold text-default-500 uppercase tracking-widest opacity-70">Expand your reach</p>
          </ModalHeader>

          <ModalBody>
            <div className="flex flex-col gap-8">
              {/* Basic Info Section */}
              <div className="space-y-6">
                <Input
                  label="Listing Title"
                  placeholder="Professional Service Name"
                  labelPlacement="outside"
                  variant="flat"
                  radius="lg"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  isInvalid={!!errors.title}
                  errorMessage={errors.title}
                  classNames={{ label: "font-black text-[10px] md:text-xs uppercase" }}
                />

                <Textarea
                  label="Detailed Description"
                  placeholder="What makes your service unique? (Min 20 characters)"
                  labelPlacement="outside"
                  variant="flat"
                  radius="lg"
                  minRows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                  classNames={{ label: "font-black text-[10px] md:text-xs uppercase" }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Category"
                    labelPlacement="outside"
                    placeholder="Choose..."
                    variant="flat"
                    radius="lg"
                    selectedKeys={formData.category ? [formData.category] : []}
                    onSelectionChange={(keys) => handleInputChange("category", Array.from(keys)[0] as ServiceCategory)}
                    isInvalid={!!errors.category}
                    errorMessage={errors.category}
                    classNames={{ label: "font-black text-[10px] md:text-xs uppercase" }}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c.key}>{c.label}</SelectItem>
                    ))}
                  </Select>

                  <div className="flex gap-2 items-end">
                    <Input
                      label="Price"
                      labelPlacement="outside"
                      placeholder="0.00"
                      variant="flat"
                      radius="lg"
                      className="flex-1"
                      type="number"
                      startContent={<span className="text-default-400 font-bold">$</span>}
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      isInvalid={!!errors.price}
                      errorMessage={errors.price}
                      classNames={{ label: "font-black text-[10px] md:text-xs uppercase" }}
                    />
                    <Select
                      label="Unit"
                      labelPlacement="outside"
                      variant="flat"
                      radius="lg"
                      className="w-24 md:w-32"
                      selectedKeys={[formData.priceType]}
                      onSelectionChange={(keys) => handleInputChange("priceType", Array.from(keys)[0] as PriceType)}
                      classNames={{ label: "font-black text-[10px] md:text-xs uppercase" }}
                    >
                      <SelectItem key={PriceType.HOURLY}>/hr</SelectItem>
                      <SelectItem key={PriceType.DAILY}>/day</SelectItem>
                      <SelectItem key={PriceType.FIXED}>fix</SelectItem>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Logistics Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="p-5 md:p-6 rounded-2xl bg-default-50 border border-divider/50 shadow-sm">
                  <p className="font-black text-[10px] md:text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Location
                  </p>
                  <div className="flex flex-col gap-4">
                    <Button
                      color="primary"
                      variant="shadow"
                      radius="lg"
                      className="font-black h-12"
                      onPress={getCurrentLocation}
                      isLoading={isGettingLocation}
                      startContent={<LocationIcon className="w-4 h-4" />}
                    >
                      Capture Location
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-default-400 uppercase">Lat</span>
                        <p className="text-xs font-bold text-default-700 bg-background p-2 rounded-lg border border-divider/40">{formData.latitude || '0.000000'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-default-400 uppercase">Lng</span>
                        <p className="text-xs font-bold text-default-700 bg-background p-2 rounded-lg border border-divider/40">{formData.longitude || '0.000000'}</p>
                      </div>
                    </div>
                    {errors.location && <p className="text-tiny text-danger font-bold text-center mt-1">{errors.location}</p>}
                  </div>
                </div>

                <div className="p-5 md:p-6 rounded-2xl bg-default-50 border border-divider/50 shadow-sm">
                  <p className="font-black text-[10px] md:text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" /> Weekly Schedule
                  </p>
                  <CheckboxGroup
                    value={formData.availability}
                    onValueChange={(v) => handleInputChange("availability", v)}
                    classNames={{
                      wrapper: "grid grid-cols-2 gap-y-2 gap-x-4 px-1"
                    }}
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <Checkbox key={day} value={day} classNames={{ label: "text-xs font-bold text-default-600" }}>
                        {day.slice(0, 3)}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                  {errors.availability && <p className="text-tiny text-danger font-bold mt-3 text-center">{errors.availability}</p>}
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="flex-col md:flex-row gap-3">
            <Button variant="light" color="danger" radius="lg" className="font-bold order-2 md:order-1" onPress={onClose}>
              Abandon
            </Button>
            <Button
              color="primary"
              size="lg"
              radius="lg"
              type="submit"
              className="font-black px-12 shadow-xl shadow-primary/20 w-full md:w-auto order-1 md:order-2"
              isLoading={isLoading}
            >
              Launch Service
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}