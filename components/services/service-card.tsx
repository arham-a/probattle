"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { LocationIcon, StarIcon } from "@/components/icons";
import { Service } from "@/lib/api/services";
import { serviceCategories } from "@/data/mockData";
import { apiClient } from "@/lib/api/config";

interface ServiceCardProps {
    service: Service;
    userRole: string;
    currentUserId?: string;
    onBook: (service: Service) => void;
    formatPrice: (price: string, type: string) => string;
}

export const ServiceCard = ({ service, userRole, currentUserId, onBook, formatPrice }: ServiceCardProps) => {
    const router = useRouter();
    const categoryIcon = serviceCategories.find(cat => cat.key === service.category)?.icon;
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    const handleMessageProvider = async () => {
        try {
            setIsSendingMessage(true);
            
            // Send an initial message to create the conversation
            const initialMessage = `Hi! I'm interested in your service: "${service.title}". Can you provide more details?`;
            
            // Create the message via API
            await apiClient.post('/messages/send', {
                receiverId: service.provider.id,
                message: initialMessage,
                serviceId: service.id,
            });

            // Navigate to messages page with the provider selected
            router.push(`/messages?userId=${service.provider.id}`);
        } catch (error) {
            console.error('Error sending initial message:', error);
            // Still navigate to messages page even if message fails
            router.push(`/messages?userId=${service.provider.id}`);
        } finally {
            setIsSendingMessage(false);
        }
    };

    // Don't show message button if viewing own service
    const canMessage = currentUserId && currentUserId !== service.provider.id;

    return (
        <Card className="border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all h-full group overflow-hidden" radius="lg">
            {/* Dynamic Image / Category Header */}
            <div className="relative h-48 overflow-hidden">
                {service.images && service.images.length > 0 ? (
                    <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 flex items-center justify-center border-b border-primary-100 dark:border-primary-900/30">
                        <span className="text-6xl text-primary/40 font-bold">{categoryIcon}</span>
                    </div>
                )}
                <div className="absolute top-4 right-4 z-10">
                    <Chip size="sm" variant="flat" color="primary" className="backdrop-blur-md bg-background/50 font-bold">
                        {service.category}
                    </Chip>
                </div>
            </div>

            <CardHeader className="flex gap-3 px-5 pt-5 pb-2">
                <Badge
                    content={service.provider.verified ? "✓" : ""}
                    color="success"
                    placement="bottom-right"
                    size="sm"
                    className="p-0 min-w-3 h-3 text-[8px]"
                >
                    <Avatar
                        src={service.provider.avatar || undefined}
                        name={service.provider.name}
                        radius="lg"
                        className="w-10 h-10 font-bold shadow-sm"
                    />
                </Badge>
                <div className="flex flex-col min-w-0">
                    <p className="text-sm font-bold text-default-800 truncate">{service.provider.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <StarIcon className="w-3 h-3 text-warning fill-current" />
                        <span className="text-[11px] font-bold text-default-500">4.9 (124 reviews)</span>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="px-5 pb-5 pt-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-extrabold text-default-900 mb-2 truncate group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-xs font-medium text-default-500 line-clamp-2 mb-4 leading-relaxed">
                        {service.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                        <LocationIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-default-600 truncate">{service.location}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-default-100 dark:border-default-100/10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-black text-primary">
                            {formatPrice(service.price, service.priceType)}
                        </span>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                            as={NextLink}
                            href={`/service/${service.id}`}
                            variant="flat"
                            size="sm"
                            radius="lg"
                            className="font-bold text-xs flex-1"
                        >
                            Details
                        </Button>
                        
                        {canMessage && (
                            <Button
                                variant="bordered"
                                size="sm"
                                radius="lg"
                                className="font-bold text-xs"
                                onPress={handleMessageProvider}
                                isLoading={isSendingMessage}
                                isDisabled={isSendingMessage}
                            >
                                {isSendingMessage ? <Spinner size="sm" /> : '💬'}
                            </Button>
                        )}
                        
                        {(userRole === 'seeker' || userRole === 'both') && (
                            <Button
                                color="primary"
                                size="sm"
                                radius="lg"
                                className="font-bold text-xs shadow-lg shadow-primary/20 flex-1"
                                onPress={() => onBook(service)}
                            >
                                Book
                            </Button>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
