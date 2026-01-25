"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Booking, BookingStatus } from "@/lib/api/bookings";
import { CalendarIcon, LocationIcon, MessageIcon, StarIcon, ClockIcon } from "@/components/icons";

interface ManageBookingCardProps {
    booking: Booking;
    actionLoading: boolean;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onComplete: (id: string) => void;
}

export const ManageBookingCard = ({
    booking,
    actionLoading,
    onAccept,
    onReject,
    onComplete
}: ManageBookingCardProps) => {
    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.ACCEPTED: return 'success';
            case BookingStatus.PENDING: return 'warning';
            case BookingStatus.COMPLETED: return 'primary';
            case BookingStatus.CANCELLED: return 'danger';
            default: return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <Card className="border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-lg hover:shadow-xl transition-all" radius="lg">
            <CardHeader className="flex items-center justify-between p-6 pb-2">
                <div className="flex items-center gap-4">
                    <Badge
                        content={booking.seeker.verified ? "✓" : ""}
                        color="success"
                        placement="bottom-right"
                        size="sm"
                        className="p-0 min-w-3 h-3 text-[8px]"
                    >
                        <Avatar
                            src={booking.seeker.avatar || undefined}
                            name={booking.seeker.name}
                            radius="lg"
                            className="w-12 h-12 font-bold shadow-sm"
                        />
                    </Badge>
                    <div className="flex flex-col min-w-0">
                        <h3 className="text-base font-black text-default-900 truncate tracking-tight">{booking.service.title}</h3>
                        <p className="text-xs font-bold text-default-500">Client: {booking.seeker.name}</p>
                    </div>
                </div>
                <Chip
                    color={getStatusColor(booking.status)}
                    variant="flat"
                    size="sm"
                    className="font-black text-[10px] uppercase tracking-wider"
                >
                    {booking.status}
                </Chip>
            </CardHeader>

            <CardBody className="p-6 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 rounded-2xl bg-default-50/50 dark:bg-default-50/5 border border-default-100 dark:border-default-100/10 mb-4 px-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-default-600">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{formatDate(booking.requestedDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-default-600">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{formatTime(booking.requestedTime)} ({booking.duration}h)</span>
                        </div>
                    </div>
                    <div className="space-y-2 sm:text-right">
                        <div className="text-xs font-bold text-default-400 uppercase tracking-widest">Earnings</div>
                        <div className="text-xl font-black text-success">${booking.totalPrice}</div>
                    </div>
                </div>

                {booking.status === BookingStatus.COMPLETED && booking.rating && (
                    <div className="mb-4 p-4 rounded-xl bg-warning/5 border border-warning/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase text-warning tracking-widest">Client Review</span>
                            <div className="flex items-center gap-1">
                                <StarIcon className="w-3 h-3 text-warning fill-current" />
                                <span className="text-xs font-black text-warning">{booking.rating.score}/5</span>
                            </div>
                        </div>
                        {booking.rating.review && (
                            <p className="text-xs font-bold text-default-600 italic leading-relaxed">"{booking.rating.review}"</p>
                        )}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-default-100 dark:border-default-100/10">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            variant="flat"
                            size="sm"
                            radius="lg"
                            className="font-bold text-xs flex-1 sm:flex-none px-6"
                        >
                            Message
                        </Button>
                        <Button
                            variant="flat"
                            size="sm"
                            radius="lg"
                            className="font-bold text-xs flex-1 sm:flex-none px-6"
                        >
                            Profile
                        </Button>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {booking.status === BookingStatus.PENDING && (
                            <>
                                <Button
                                    color="success"
                                    size="sm"
                                    radius="lg"
                                    className="font-black text-xs shadow-lg shadow-success/20 flex-1 sm:flex-none px-6"
                                    isLoading={actionLoading}
                                    onPress={() => onAccept(booking.id)}
                                >
                                    Accept
                                </Button>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    size="sm"
                                    radius="lg"
                                    className="font-black text-xs flex-1 sm:flex-none"
                                    isLoading={actionLoading}
                                    onPress={() => onReject(booking.id)}
                                >
                                    Decline
                                </Button>
                            </>
                        )}
                        {booking.status === BookingStatus.ACCEPTED && (
                            <Button
                                color="primary"
                                size="sm"
                                radius="lg"
                                className="font-black text-xs shadow-lg shadow-primary/20 flex-1 sm:flex-none px-8"
                                isLoading={actionLoading}
                                onPress={() => onComplete(booking.id)}
                            >
                                Mark Complete
                            </Button>
                        )}
                        {booking.status === BookingStatus.COMPLETED && (
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-default-400 tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-default-400" />
                                Session Finished
                            </div>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
