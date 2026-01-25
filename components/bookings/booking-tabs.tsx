"use client";

import React from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Booking, BookingStatus } from "@/lib/api/bookings";
import { BookingCard } from "./booking-card";

interface BookingTabsProps {
    bookings: Booking[];
    pendingBookings: Booking[];
    acceptedBookings: Booking[];
    completedBookings: Booking[];
    getStatusColor: (status: BookingStatus) => any;
    getStatusText: (status: BookingStatus) => string;
    formatDate: (date: string) => string;
    formatTime: (time: string) => string;
    onReview: (booking: Booking) => void;
    actionLoading?: string | null;
}

export const BookingTabs = ({
    bookings,
    pendingBookings,
    acceptedBookings,
    completedBookings,
    getStatusColor,
    getStatusText,
    formatDate,
    formatTime,
    onReview,
    actionLoading,
}: BookingTabsProps) => {
    const EmptyState = ({ title, description }: { title: string; description: string }) => (
        <Card className="bg-transparent border-2 border-dashed border-default-200 dark:border-default-100 shadow-none mt-4" radius="lg">
            <CardBody className="text-center py-20">
                <div className="text-5xl mb-6 opacity-10 italic font-serif text-primary">No Activity</div>
                <h3 className="text-lg font-bold text-default-700 mb-2">{title}</h3>
                <p className="text-sm text-default-500 mb-8 max-w-sm mx-auto font-medium">{description}</p>
                <Button
                    as={NextLink}
                    href="/services"
                    color="primary"
                    radius="lg"
                    className="font-bold px-10 h-12 shadow-lg shadow-primary/20"
                >
                    Explore Marketplace
                </Button>
            </CardBody>
        </Card>
    );

    return (
        <Tabs
            aria-label="Booking status"
            variant="underlined"
            color="primary"
            className="w-full"
            classNames={{
                tabList: "gap-4 w-full relative rounded-none p-0 border-b border-divider overflow-x-auto",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-4 h-12 whitespace-nowrap flex-shrink-0",
                tabContent: "font-bold text-sm tracking-tight group-data-[selected=true]:text-primary"
            }}
        >
            <Tab key="all" title={`All (${bookings.length})`}>
                <div className="mt-8 grid grid-cols-1 gap-1">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                getStatusColor={getStatusColor}
                                getStatusText={getStatusText}
                                formatDate={formatDate}
                                formatTime={formatTime}
                                onReview={onReview}
                                actionLoading={actionLoading}
                            />
                        ))
                    ) : (
                        <EmptyState title="No Bookings Yet" description="Your entire booking history will be waiting here once you make your first move." />
                    )}
                </div>
            </Tab>

            <Tab key="pending" title={`Pending (${pendingBookings.length})`}>
                <div className="mt-8 grid grid-cols-1 gap-1">
                    {pendingBookings.length > 0 ? (
                        pendingBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                getStatusColor={getStatusColor}
                                getStatusText={getStatusText}
                                formatDate={formatDate}
                                formatTime={formatTime}
                                onReview={onReview}
                                actionLoading={actionLoading}
                            />
                        ))
                    ) : (
                        <EmptyState title="Nothing Pending" description="Looks like you're all caught up! No active requests at the moment." />
                    )}
                </div>
            </Tab>

            <Tab key="confirmed" title={`Confirmed (${acceptedBookings.length})`}>
                <div className="mt-8 grid grid-cols-1 gap-1">
                    {acceptedBookings.length > 0 ? (
                        acceptedBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                getStatusColor={getStatusColor}
                                getStatusText={getStatusText}
                                formatDate={formatDate}
                                formatTime={formatTime}
                                onReview={onReview}
                                actionLoading={actionLoading}
                            />
                        ))
                    ) : (
                        <EmptyState title="No Upcoming Sessions" description="Ready for something new? Book a confirmed session with a neighbor today." />
                    )}
                </div>
            </Tab>

            <Tab key="completed" title={`Completed (${completedBookings.length})`}>
                <div className="mt-8 grid grid-cols-1 gap-1">
                    {completedBookings.length > 0 ? (
                        completedBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                getStatusColor={getStatusColor}
                                getStatusText={getStatusText}
                                formatDate={formatDate}
                                formatTime={formatTime}
                                onReview={onReview}
                                actionLoading={actionLoading}
                            />
                        ))
                    ) : (
                        <EmptyState title="No Past Bookings" description="You haven't completed any sessions yet. Once you do, they'll show up right here." />
                    )}
                </div>
            </Tab>
        </Tabs>
    );
};
