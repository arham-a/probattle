"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Switch } from "@heroui/switch";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/auth/auth-wrapper";

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

      router.push("/dashboard");
    } catch (error: any) {
      setErrors({ general: error.message || "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <AuthWrapper
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
            <p className="text-danger text-sm font-medium">{errors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          <Input
            label="Email Address"
            placeholder="name@example.com"
            labelPlacement="outside"
            type="email"
            variant="flat"
            size="lg"
            radius="lg"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            isRequired
            classNames={{
              label: "text-default-700 font-semibold mb-2",
              inputWrapper: "bg-default-100 hover:bg-default-200 transition-colors h-12",
            }}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            labelPlacement="outside"
            type={isVisible ? "text" : "password"}
            variant="flat"
            size="lg"
            radius="lg"
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
            classNames={{
              label: "text-default-700 font-semibold mb-2",
              inputWrapper: "bg-default-100 hover:bg-default-200 transition-colors h-12",
            }}
          />
        </div>

        <div className="flex justify-between items-center px-1">
          <Switch
            isSelected={formData.rememberMe}
            onValueChange={(checked) => handleInputChange("rememberMe", checked)}
            size="sm"
            color="primary"
          >
            <span className="text-default-500 font-medium">Remember me</span>
          </Switch>
          <Link
            as={NextLink}
            href="/forgot-password"
            size="sm"
            className="text-primary font-semibold hover:opacity-80 transition-opacity"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          color="primary"
          className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
          radius="lg"
          isLoading={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-default-200"></div>
          <span className="flex-shrink mx-4 text-default-400 text-xs font-semibold uppercase tracking-wider">
            Or
          </span>
          <div className="flex-grow border-t border-default-200"></div>
        </div>

        <div className="text-center mt-6">
          <p className="text-default-500 font-medium">
            Don't have an account?{" "}
            <Link
              as={NextLink}
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </AuthWrapper>
  );
}
