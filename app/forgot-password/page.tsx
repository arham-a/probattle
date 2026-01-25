"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { useState } from "react";
import NextLink from "next/link";
import { AuthWrapper } from "@/components/auth/auth-wrapper";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <AuthWrapper
        title="Check Your Email"
        subtitle={`We've sent a recovery link to ${email}`}
      >
        <div className="text-center space-y-8 py-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl animate-bounce">
              📧
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-default-500 font-medium">
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>

            <div className="space-y-3 pt-4">
              <Button
                color="primary"
                variant="flat"
                className="w-full h-12 font-bold"
                radius="lg"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
              >
                Try Different Email
              </Button>
              <Button
                as={NextLink}
                href="/login"
                variant="light"
                className="w-full h-12 font-bold"
                radius="lg"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper
      title="Forgot Password?"
      subtitle="Enter your email to get a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        <Input
          label="Email Address"
          labelPlacement="outside"
          placeholder="name@example.com"
          type="email"
          variant="flat"
          size="lg"
          radius="lg"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          isInvalid={!!error}
          errorMessage={error}
          isRequired
          classNames={{
            label: "text-default-700 font-semibold mb-2",
            inputWrapper: "bg-default-100 font-medium h-12",
          }}
        />

        <Button
          type="submit"
          color="primary"
          className="w-full h-14 text-xl font-bold shadow-xl shadow-primary/20"
          radius="lg"
          isLoading={isLoading}
        >
          {isLoading ? "Sending link..." : "Send Reset Link"}
        </Button>

        <div className="text-center mt-6">
          <p className="text-default-500 font-medium">
            Remembered it?{" "}
            <Link
              as={NextLink}
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthWrapper>
  );
}
