"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";

interface DashboardStatsProps {
    stats: {
        label: string;
        value: string | number;
        color: "primary" | "success" | "warning" | "danger" | "default";
    }[];
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
    const getColors = (color: string) => {
        switch (color) {
            case "primary": return "text-primary bg-primary/10";
            case "success": return "text-success bg-success/10";
            case "warning": return "text-warning bg-warning/10";
            case "danger": return "text-danger bg-danger/10";
            default: return "text-default-700 bg-default-100";
        }
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
                <Card key={index} className="border-none bg-background/40 dark:bg-default-50/20 backdrop-blur-sm shadow-sm" radius="lg">
                    <CardBody className="p-6 flex flex-col items-center justify-center text-center">
                        <div className={`w-12 h-12 ${getColors(stat.color)} rounded-full flex items-center justify-center mb-3 transition-transform hover:scale-110 duration-300`}>
                            <span className="text-xl font-extrabold">{stat.value}</span>
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-default-500">{stat.label}</p>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};
