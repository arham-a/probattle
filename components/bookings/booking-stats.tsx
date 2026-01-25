"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";

interface BookingStatsProps {
    pendingCount: number;
    acceptedCount: number;
    completedCount: number;
    totalCount: number;
}

export const BookingStats = ({
    pendingCount,
    acceptedCount,
    completedCount,
    totalCount,
}: BookingStatsProps) => {
    const stats = [
        { label: "Pending", value: pendingCount, color: "text-warning", bg: "bg-warning/10" },
        { label: "Confirmed", value: acceptedCount, color: "text-success", bg: "bg-success/10" },
        { label: "Completed", value: completedCount, color: "text-primary", bg: "bg-primary/10" },
        { label: "Total", value: totalCount, color: "text-default-700", bg: "bg-default-100" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
                <Card key={index} className="border-none bg-background/40 dark:bg-default-50/20 backdrop-blur-sm shadow-sm" radius="lg">
                    <CardBody className="p-6 flex flex-col items-center justify-center text-center">
                        <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center mb-3 transition-transform hover:scale-110 duration-300`}>
                            <span className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</span>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-default-500">{stat.label}</p>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};
