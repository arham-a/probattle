"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import NextLink from "next/link";

interface ActivityItem {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    image?: string;
    badge?: string;
    badgeColor?: "primary" | "success" | "warning" | "danger" | "default";
}

interface ActivityListProps {
    title: string;
    activities: ActivityItem[];
    emptyMessage: string;
    viewAllLink?: string;
}

export const ActivityList = ({ title, activities, emptyMessage, viewAllLink }: ActivityListProps) => {
    return (
        <Card className="border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-lg" radius="lg">
            <CardHeader className="flex justify-between items-center px-6 pt-6">
                <h3 className="text-lg font-bold tracking-tight text-default-800">{title}</h3>
                {viewAllLink && (
                    <Button as={NextLink} href={viewAllLink} size="sm" variant="flat" radius="lg" className="font-bold text-xs">
                        View All
                    </Button>
                )}
            </CardHeader>
            <CardBody className="px-6 pb-6 pt-2">
                {activities.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-sm font-medium text-default-400 italic">{emptyMessage}</p>
                    </div>
                ) : (
                    <div className="space-y-4 mt-2">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-default-100/50 transition-colors group cursor-pointer border border-transparent hover:border-default-100"
                            >
                                <Avatar
                                    src={activity.image}
                                    name={activity.title}
                                    radius="lg"
                                    className="w-12 h-12 font-bold shadow-sm"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-default-800 truncate group-hover:text-primary transition-colors">
                                        {activity.title}
                                    </h4>
                                    <p className="text-xs font-semibold text-default-500 truncate">
                                        {activity.subtitle}
                                    </p>
                                    <p className="text-[10px] font-bold text-default-400 mt-0.5 tracking-tight uppercase">
                                        {activity.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};
