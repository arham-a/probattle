"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
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

  // Get user's current location
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
        // Clear location error if it exists
        if (errors.location) {
          setErrors(prev => ({ ...prev, location: "" }));
        }
      },
      (error) => {
        let errorMessage = "Unable to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setErrors(prev => ({ ...prev, location: errorMessage }));
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const roleOptions = [
    {
      value: "seeker",
      title: "I'm looking for services",
      description: "Find trusted providers in your neighborhood",
      icon: "🔍",
      benefits: ["Browse local services", "Book trusted providers", "Rate and review"]
    },
    {
      value: "provider",
      title: "I want to offer services",
      description: "Share your skills with the community",
      icon: "🛠️",
      benefits: ["List your services", "Connect with neighbors", "Earn from your skills"]
    },
    {
      value: "both",
      title: "Both - I want to offer and find services",
      description: "Get the full Neighbourly experience",
      icon: "🤝",
      benefits: ["Complete marketplace access", "Flexible role switching", "Maximum community engagement"]
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      // Remove any non-digit characters for validation
      const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        newErrors.phoneNumber = "Phone number must be between 7-15 digits";
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Combine phone prefix and number
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
      
      // Redirect to dashboard on successful registration
      router.push("/dashboard");
    } catch (error: any) {
      setErrors({ general: error.message || "Registration failed. Please try again." });
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
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
  };

  const selectedRoleOption = roleOptions.find(option => option.value === formData.role);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Join Neighbourly</h1>
          <p className="text-xl text-default-600">
            Connect with your community and start sharing skills, tools, and services
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-2xl font-semibold">Create Your Account</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                  <p className="text-danger text-sm">{errors.general}</p>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    isInvalid={!!errors.firstName}
                    errorMessage={errors.firstName}
                    isRequired
                  />
                  <Input
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    isInvalid={!!errors.lastName}
                    errorMessage={errors.lastName}
                    isRequired
                  />
                </div>

                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                  isRequired
                />

                {/* Phone Number Fields */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Select
                      placeholder="Prefix"
                      selectedKeys={[formData.phonePrefix]}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        handleInputChange("phonePrefix", selectedKey);
                      }}
                      size="md"
                    >
                      {phonePrefixes.map((prefix) => (
                        <SelectItem key={prefix.value}>
                          {prefix.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="md:col-span-2">
                      <Input
                        placeholder="Enter phone number"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          // Allow only digits, spaces, dashes, and parentheses
                          const value = e.target.value.replace(/[^\d\s\-\(\)]/g, '');
                          handleInputChange("phoneNumber", value);
                        }}
                        isInvalid={!!errors.phoneNumber}
                        errorMessage={errors.phoneNumber}
                        description="Enter your phone number without country code"
                      />
                    </div>
                  </div>
                  {formData.phonePrefix && formData.phoneNumber && (
                    <p className="text-xs text-default-500">
                      Full number: {formData.phonePrefix}{formData.phoneNumber.replace(/\D/g, '')}
                    </p>
                  )}
                </div>

                {/* Location Field with Get Location Button */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Location *</label>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={getCurrentLocation}
                      isLoading={isGettingLocation}
                      startContent={!isGettingLocation ? "📍" : undefined}
                    >
                      {isGettingLocation ? "Getting Location..." : "Use Current Location"}
                    </Button>
                  </div>
                  <Input
                    placeholder="e.g., Downtown District, Suburban Area"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    isInvalid={!!errors.location}
                    errorMessage={errors.location}
                    description="This helps neighbors find services near them"
                    isRequired
                  />
                  {formData.latitude && formData.longitude && (
                    <p className="text-xs text-success">
                      ✓ Location detected: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                    </p>
                  )}
                </div>

                <Textarea
                  label="Bio (Optional)"
                  placeholder="Tell your neighbors about yourself, your skills, or what you're looking for..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  minRows={3}
                  description="A brief introduction to help build trust in the community"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    placeholder="Create a password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password}
                    description="At least 6 characters"
                    isRequired
                  />
                  <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword}
                    isRequired
                  />
                </div>
              </div>

              <Divider />

              {/* Role Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">How do you want to use Neighbourly?</h3>
                
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  className="space-y-3"
                >
                  {roleOptions.map((option) => (
                    <div key={option.value} className="relative">
                      <Radio
                        value={option.value}
                        classNames={{
                          base: "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent data-[selected=true]:border-primary",
                          wrapper: "hidden"
                        }}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <span className="text-2xl">{option.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-base">{option.title}</h4>
                            <p className="text-sm text-default-600 mb-2">{option.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {option.benefits.map((benefit, index) => (
                                <Chip key={index} size="sm" variant="flat" color="primary">
                                  {benefit}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Radio>
                    </div>
                  ))}
                </RadioGroup>

                {selectedRoleOption && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                      Great choice! As a {selectedRoleOption.value === 'both' ? 'community member' : selectedRoleOption.value}, 
                      you'll be able to {selectedRoleOption.description.toLowerCase()}.
                    </p>
                  </div>
                )}
              </div>

              <Divider />

              {/* Terms and Newsletter */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Switch
                    isSelected={formData.agreeToTerms}
                    onValueChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    color={errors.agreeToTerms ? "danger" : "primary"}
                  >
                    <span className="text-sm">
                      I agree to the{" "}
                      <Link as={NextLink} href="/terms" color="primary" size="sm">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link as={NextLink} href="/privacy" color="primary" size="sm">
                        Privacy Policy
                      </Link>
                    </span>
                  </Switch>
                  {errors.agreeToTerms && (
                    <p className="text-danger text-sm">{errors.agreeToTerms}</p>
                  )}
                </div>

                <Switch
                  isSelected={formData.subscribeNewsletter}
                  onValueChange={(checked) => handleInputChange("subscribeNewsletter", checked)}
                  color="primary"
                >
                  <span className="text-sm">
                    Send me community updates and service recommendations
                  </span>
                </Switch>
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                {isLoading ? "Creating Account..." : "Join Neighbourly"}
              </Button>
            </form>

            <Divider className="my-6" />

            <div className="text-center">
              <p className="text-sm text-default-600">
                Already have an account?{" "}
                <Link as={NextLink} href="/login" color="primary">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-default-600 mb-3">
            Join thousands of community members who trust Neighbourly
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="text-success">🔒</span>
              <span className="text-default-600">Secure & Private</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-primary">✓</span>
              <span className="text-default-600">Verified Community</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-warning">⭐</span>
              <span className="text-default-600">Trusted Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}