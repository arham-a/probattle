"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Switch } from "@heroui/switch";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      
      // Redirect to dashboard on successful login
      router.push("/dashboard");
    } catch (error: any) {
      setErrors({ general: error.message || "Login failed. Please try again." });
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-default-600">
            Sign in to your Neighbourly account to connect with your community
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold">Sign In</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                  <p className="text-danger text-sm">{errors.general}</p>
                </div>
              )}

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

              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                isRequired
              />

              <div className="flex justify-between items-center">
                <Switch
                  isSelected={formData.rememberMe}
                  onValueChange={(checked) => handleInputChange("rememberMe", checked)}
                  size="sm"
                >
                  Remember me
                </Switch>
                <Link as={NextLink} href="/forgot-password" size="sm">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <Divider className="my-6" />

            <div className="text-center">
              <p className="text-sm text-default-600">
                Don't have an account?{" "}
                <Link as={NextLink} href="/register" color="primary">
                  Join the community
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-xs text-default-500 mb-2">
            Trusted by thousands of community members
          </p>
          <div className="flex justify-center items-center gap-4 text-xs text-default-400">
            <span>🔒 Secure Login</span>
            <span>✓ Verified Community</span>
            <span>🛡️ Privacy Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}