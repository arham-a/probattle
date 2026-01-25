"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";

interface AuthWrapperProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    maxWidth?: string;
}

export const AuthWrapper = ({
    children,
    title,
    subtitle,
    maxWidth = "450px",
}: AuthWrapperProps) => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full px-4 py-12 overflow-hidden bg-background">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20 dark:opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
            </div>

            <div className="w-full" style={{ maxWidth }}>
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary-600">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-default-500 font-medium text-lg">
                            {subtitle}
                        </p>
                    )}
                </div>

                <Card
                    className="border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-xl shadow-2xl"
                    radius="lg"
                >
                    <CardBody className="p-8">
                        {children}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
