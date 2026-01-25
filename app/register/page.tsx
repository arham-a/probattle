"use client";

import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Switch } from "@heroui/switch";
import { RadioGroup, Radio } from "@heroui/radio";
import { Chip } from "@heroui/chip";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/auth/auth-wrapper";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonePrefix: "+1",
    phoneNumber: "",
    role: "seeker" as "provider" | "seeker" | "both",
    location: "",
    bio: "",
    latitude: null as number | null,
    longitude: null as number | null,
    agreeToTerms: false,
    subscribeNewsletter: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Phone number prefixes
  const phonePrefixes = [
    { value: "+1", label: "+1 (US/Canada)" },
    { value: "+44", label: "+44 (UK)" },
    { value: "+91", label: "+91 (India)" },
    { value: "+86", label: "+86 (China)" },
    { value: "+49", label: "+49 (Germany)" },
    { value: "+33", label: "+33 (France)" },
    { value: "+81", label: "+81 (Japan)" },
    { value: "+61", label: "+61 (Australia)" },
    { value: "+55", label: "+55 (Brazil)" },
    { value: "+7", label: "+7 (Russia)" },
  ];

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, location: "Geolocation is not supported by this browser" }));
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setIsGettingLocation(false);
        if (errors.location) setErrors(prev => ({ ...prev, location: "" }));
      },
      (error) => {
        let errorMessage = "Unable to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED: errorMessage = "Location access denied"; break;
          case error.POSITION_UNAVAILABLE: errorMessage = "Location unavailable"; break;
          case error.TIMEOUT: errorMessage = "Location request timed out"; break;
        }
        setErrors(prev => ({ ...prev, location: errorMessage }));
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const roleOptions = [
    {
      value: "seeker",
      title: "I'm looking for services",
      description: "Find trusted skilled neighbors",
      icon: (
        <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="32">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
        </svg>
      ),
    },
    {
      value: "provider",
      title: "I want to offer services",
      description: "Share your skills with community",
      icon: (
        <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="32">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4-1.4l-1.6-1.6a1 1 0 0 0-1.4 0zM7.7 13.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4-1.4l-1.6-1.6a1 1 0 0 0-1.4 0z"></path>
          <path d="M3 21l6-6M21 3l-6 6"></path>
        </svg>
      ),
    },
    {
      value: "both",
      title: "I want both",
      description: "Full marketplace access",
      icon: (
        <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="32">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) {
      newErrors.email = "Required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Required";
    } else {
      const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        newErrors.phoneNumber = "7-15 digits required";
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = "Required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Min 6 chars";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mismatch";
    }

    if (!formData.location.trim()) newErrors.location = "Required";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const fullPhoneNumber = `${formData.phonePrefix}${formData.phoneNumber.replace(/\D/g, '')}`;
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: fullPhoneNumber,
        role: formData.role,
        bio: formData.bio || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
      });
      router.push("/dashboard");
    } catch (error: any) {
      setErrors({ general: error.message || "Registration failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    if (errors.general) setErrors(prev => ({ ...prev, general: "" }));
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <AuthWrapper
      title="Create Account"
      subtitle="Join the most helpful neighborhood community"
      maxWidth="800px"
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        {errors.general && (
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
            <p className="text-danger text-sm font-medium">{errors.general}</p>
          </div>
        )}

        {/* Section 1: Personal Info */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              labelPlacement="outside"
              placeholder="John"
              variant="flat"
              radius="lg"
              size="lg"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              isInvalid={!!errors.firstName}
              errorMessage={errors.firstName}
              isRequired
              classNames={{ label: "font-semibold mb-2", inputWrapper: "h-12" }}
            />
            <Input
              label="Last Name"
              labelPlacement="outside"
              placeholder="Doe"
              variant="flat"
              radius="lg"
              size="lg"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              isInvalid={!!errors.lastName}
              errorMessage={errors.lastName}
              isRequired
              classNames={{ label: "font-semibold mb-2", inputWrapper: "h-12" }}
            />
          </div>
          <Input
            label="Email"
            labelPlacement="outside"
            placeholder="john@example.com"
            type="email"
            variant="flat"
            radius="lg"
            size="lg"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            isRequired
            classNames={{ label: "font-semibold mb-2", inputWrapper: "h-12" }}
          />
        </div>

        {/* Section 2: Contact & Location */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Contact & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Prefix"
              labelPlacement="outside"
              selectedKeys={[formData.phonePrefix]}
              onSelectionChange={(keys) => handleInputChange("phonePrefix", Array.from(keys)[0])}
              variant="flat"
              radius="lg"
              size="lg"
              classNames={{ label: "font-semibold mb-2", trigger: "h-12" }}
            >
              {phonePrefixes.map((p) => <SelectItem key={p.value} textValue={p.value}>{p.label}</SelectItem>)}
            </Select>
            <div className="md:col-span-2">
              <Input
                label="Phone"
                labelPlacement="outside"
                placeholder="000 000 0000"
                variant="flat"
                radius="lg"
                size="lg"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/[^\d\s\-\(\)]/g, ''))}
                isInvalid={!!errors.phoneNumber}
                errorMessage={errors.phoneNumber}
                classNames={{ label: "font-semibold mb-2", inputWrapper: "h-12" }}
              />
            </div>
          </div>

          <Input
            label="Location"
            labelPlacement="outside"
            placeholder="Your neighborhood"
            variant="flat"
            radius="lg"
            size="lg"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            isInvalid={!!errors.location}
            errorMessage={errors.location}
            isRequired
            classNames={{ label: "font-semibold mb-2", inputWrapper: "h-12" }}
            endContent={
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={getCurrentLocation}
                isLoading={isGettingLocation}
                className="text-primary hover:bg-primary/10"
              >
                <svg fill="none" height="1.2em" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1.2em"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </Button>
            }
          />
        </div>

        {/* Section 3: Role Selection */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Choose Your Role</h3>
          <RadioGroup
            value={formData.role}
            onValueChange={(v) => handleInputChange("role", v)}
            orientation="horizontal"
            className="w-full gap-6"
          >
            {roleOptions.map((opt) => (
              <Radio
                key={opt.value}
                value={opt.value}
                classNames={{
                  base: `flex-1 max-w-full m-0 bg-default-100 hover:bg-default-200 cursor-pointer rounded-xl border-2 border-transparent data-[selected=true]:border-primary transition-all p-6`,
                  labelWrapper: "w-full m-0",
                  wrapper: "hidden"
                }}
              >
                <div className="flex flex-col items-center justify-center text-center w-full gap-3">
                  <div className="text-primary">
                    {opt.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm text-default-700">{opt.title}</span>
                    <span className="text-xs text-default-500 leading-tight">{opt.description}</span>
                  </div>
                </div>
              </Radio>
            ))}
          </RadioGroup>
        </div>

        {/* Section 4: Security */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Password"
              labelPlacement="outside"
              placeholder="••••••••"
              type={isVisible ? "text" : "password"}
              variant="flat"
              radius="lg"
              size="lg"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              isRequired
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                  {isVisible ? (
                    <svg className="text-2xl text-default-400 pointer-events-none" fill="none" height="1em" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1em"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" x2="23" y1="1" y2="23"></line></svg>
                  ) : (
                    <svg className="text-2xl text-default-400 pointer-events-none" fill="none" height="1em" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1em"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              }
              classNames={{ label: "font-semibold mb-2", inputWrapper: "h-12" }}
            />
            <Input
              label="Confirm Password"
              labelPlacement="outside"
              placeholder="••••••••"
              type={isVisible ? "text" : "password"}
              variant="flat"
              radius="lg"
              size="lg"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              isRequired
              classNames={{ label: "font-semibold mb-2", inputWrapper: "h-12" }}
            />
          </div>
        </div>

        <Divider className="my-6 opacity-50" />

        <div className="space-y-6">
          <Switch
            isSelected={formData.agreeToTerms}
            onValueChange={(v) => handleInputChange("agreeToTerms", v)}
            size="sm"
            color="primary"
          >
            <span className="text-xs text-default-500 font-medium">I agree to the <Link size="sm" className="text-xs font-bold text-primary underline">Terms of Service</Link> & <Link size="sm" className="text-xs font-bold text-primary underline">Privacy Policy</Link></span>
          </Switch>

          <Button
            type="submit"
            color="primary"
            className="w-full h-14 text-xl font-bold shadow-xl shadow-primary/20"
            radius="lg"
            isLoading={isLoading}
          >
            {isLoading ? "Creating Account..." : "Join the Community"}
          </Button>
        </div>

        <div className="text-center pb-4">
          <p className="text-default-500 font-semibold">
            Already have an account?{" "}
            <Link as={NextLink} href="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthWrapper>
  );
}
