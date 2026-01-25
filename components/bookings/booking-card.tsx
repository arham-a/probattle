"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Booking, BookingStatus } from "@/lib/api/bookings";
import { CalendarIcon, LocationIcon, StarIcon } from "@/components/icons";

interface BookingCardProps {
    booking: Booking;
    getStatusColor: (status: BookingStatus) => any;
    getStatusText: (status: BookingStatus) => string;
    formatDate: (date: string) => string;
    formatTime: (time: string) => string;
    onReview: (booking: Booking) => void;
    actionLoading?: string | null;
}

export const BookingCard = ({
    booking,
    getStatusColor,
    getStatusText,
    formatDate,
    formatTime,
    onReview,
    actionLoading,
}: BookingCardProps) => {
    return (
        <Card className="mb-6 border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-lg hover:shadow-xl transition-all h-full" radius="lg">
            <CardBody className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Service Image / Category Icon */}
                    <div className="flex-shrink-0">
                        {booking.service.images && booking.service.images.length > 0 ? (
                            <img
                                src={booking.service.images[0]}
                                alt={booking.service.title}
                                className="w-full md:w-36 h-36 object-cover rounded-lg shadow-inner"
                            />
                        ) : (
                            <div className="w-full md:w-36 h-36 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg flex items-center justify-center border border-primary-100 dark:border-primary-900/30">
                                <span className="text-4xl text-primary font-bold">
                                    {booking.service.category === 'tutoring' ? '📚' :
                                        booking.service.category === 'repair' ? '🔧' :
                                            booking.service.category === 'cleaning' ? '🧹' : '⚡'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                            <div className="flex flex-row items-center justify-between gap-2 mb-3">
                                <h3 className="text-xl font-bold truncate text-default-800 tracking-tight">{booking.service.title}</h3>
                                <Chip
                                    size="sm"
                                    color={getStatusColor(booking.status)}
                                    variant="flat"
                                    radius="lg"
                                    className="font-bold text-[11px] h-6 px-3"
                                >
                                    {getStatusText(booking.status)}
                                </Chip>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <Badge
                                    content={booking.provider.verified ? "✓" : ""}
                                    color="success"
                                    placement="bottom-right"
                                    size="sm"
                                    className="p-0 min-w-3 h-3 text-[8px]"
                                >
                                    <Avatar
                                        src={booking.provider.avatar || undefined}
                                        name={booking.provider.name}
                                        radius="lg"
                                        className="w-8 h-8 font-bold"
                                    />
                                </Badge>
                                <div className="overflow-hidden">
                                    <p className="font-bold text-sm text-default-700 truncate">{booking.provider.name}</p>
                                    <p className="text-[10px] text-default-400 font-bold tracking-wider uppercase">Provider</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-default-50 dark:bg-default-100/30 p-4 rounded-lg border border-default-100 dark:border-default-100/10">
                                <div className="flex items-center gap-2.5 text-default-600">
                                    <CalendarIcon className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-sm truncate whitespace-nowrap">
                                        {formatDate(booking.requestedDate)} at {formatTime(booking.requestedTime)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 text-default-600">
                                    <div className="w-4 h-4 bg-primary/10 rounded flex items-center justify-center text-xs text-primary font-bold">$</div>
                                    <span className="font-bold text-sm text-primary-600">${booking.totalPrice}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-default-600">
                                    <div className="w-4 h-4 bg-primary/10 rounded flex items-center justify-center text-xs text-primary font-bold italic">T</div>
                                    <span className="font-bold text-sm">{booking.duration}h</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-default-600">
                                    <LocationIcon className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-sm truncate">{booking.service.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rating & Actions */}
                        <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-default-100 dark:border-default-100/10">
                            {booking.rating ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                className={`w-3.5 h-3.5 ${i < booking.rating!.score ? 'text-warning fill-current' : 'text-default-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-default-700">{booking.rating.score}.0</span>
                                </div>
                            ) : (
                                <div />
                            )}

                            <div className="flex flex-wrap gap-2.5">
                                {booking.status === BookingStatus.PENDING && (
                                    <>
                                        <Button size="sm" color="danger" variant="light" radius="lg" className="text-sm h-10 font-bold px-5">
                                            Cancel
                                        </Button>
                                        <Button size="sm" variant="flat" color="primary" radius="lg" className="text-sm h-10 font-bold px-5">
                                            Contact
                                        </Button>
                                    </>
                                )}
                                {booking.status === BookingStatus.ACCEPTED && (
                                    <>
                                        <Button size="sm" color="primary" variant="flat" radius="lg" className="text-sm h-10 font-bold px-6">
                                            Message Provider
                                        </Button>
                                        <Button size="sm" variant="bordered" radius="lg" className="text-sm h-10 font-bold px-6 border-default-200">
                                            View Details
                                        </Button>
                                    </>
                                )}
                                {booking.status === BookingStatus.COMPLETED && (
                                    <>
                                        {!booking.rating ? (
                                            <Button
                                                size="sm"
                                                color="warning"
                                                variant="flat"
                                                radius="lg"
                                                className="text-sm h-10 font-bold px-6"
                                                onPress={() => onReview(booking)}
                                                isLoading={actionLoading === booking.id}
                                            >
                                                Rate Service
                                            </Button>
                                        ) : (
                                            <Chip size="sm" variant="flat" color="success" radius="lg" className="text-sm h-8 font-bold px-4">Rating Submitted</Chip>
                                        )}
                                        <Button size="sm" variant="bordered" radius="lg" className="text-sm h-10 font-bold px-6 border-default-200">
                                            Book Again
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
