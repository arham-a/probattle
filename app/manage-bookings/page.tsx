"use client";

import { Suspense, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import NextLink from "next/link";
import CreateServiceModal from "@/components/modals/create-service-modal";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ProviderStatistics from "@/components/provider-statistics";
import { useBookings } from "@/lib/hooks/useBookings";
import { useMyServices } from "@/lib/hooks/useMyServices";

// New Component
import { ManageBookingCard } from "@/components/bookings/manage-booking-card";

function ManageBookingsContent() {
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        bookings,
        pendingBookings,
        acceptedBookings,
        completedBookings,
        isLoading,
        error,
        refetch,
        acceptBooking,
        rejectBooking,
        completeBooking
    } = useBookings();

    const { createService } = useMyServices();
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    if (!user) return null;

    if (user.role === 'seeker') {
        return (
            <div className="container mx-auto px-6 py-20 text-center max-w-2xl">
                <div className="bg-warning/5 p-10 rounded-3xl border border-warning/20">
                    <h1 className="text-2xl font-black text-warning mb-4">Provider Access Only</h1>
                    <p className="text-default-600 font-medium mb-8">This station handles incoming client requests. Switch to a provider role to start earning.</p>
                    <Button as={NextLink} href="/dashboard" color="primary" radius="full" className="font-bold px-10 shadow-lg shadow-primary/20">
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const providerBookings = bookings.filter(b => b.providerId === user.id);
    const providerPending = pendingBookings.filter(b => b.providerId === user.id);
    const providerAccepted = acceptedBookings.filter(b => b.providerId === user.id);
    const providerCompleted = completedBookings.filter(b => b.providerId === user.id);

    const upcomingBookings = providerAccepted.filter(b => {
        const bDate = new Date(b.requestedDate);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return bDate >= today;
    });

    const handleAcceptBooking = async (id: string) => {
        try {
            setActionLoading(id); await acceptBooking(id);
            setNotification({ message: 'Request accepted!', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (e) {
            setNotification({ message: 'Grant failed.', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        } finally { setActionLoading(null); }
    };

    const handleRejectBooking = async (id: string) => {
        if (window.confirm('Decline this request?')) {
            try {
                setActionLoading(id); await rejectBooking(id);
                setNotification({ message: 'Request declined.', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            } catch (e) { setNotification(null); }
            finally { setActionLoading(null); }
        }
    };

    const handleCompleteBooking = async (id: string) => {
        if (window.confirm('Mark session as complete?')) {
            try {
                setActionLoading(id); await completeBooking(id);
                setNotification({ message: 'Session completed!', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            } catch (e) { setNotification(null); }
            finally { setActionLoading(null); }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] py-40">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 md:px-10 py-12 max-w-[1400px]">
            {notification && (
                <div className={`fixed top-10 right-10 z-[100] p-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest border ${notification.type === 'success' ? 'bg-success text-white border-success-200' : 'bg-danger text-white border-danger-200'
                    }`}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-default-900 mb-2">Bookings</h1>
                <p className="text-default-500 font-bold text-sm tracking-wide uppercase opacity-70">
                    Manage client requests & your schedule
                </p>
            </div>

            <Tabs
                aria-label="Booking Manager"
                variant="underlined"
                className="w-full"
                classNames={{
                    tabList: "gap-8 w-full relative rounded-none p-0 border-b border-divider overflow-x-auto",
                    cursor: "w-full bg-primary h-[3px]",
                    tab: "max-w-fit px-4 h-14 font-black text-sm uppercase tracking-wider whitespace-nowrap flex-shrink-0",
                    tabContent: "group-data-[selected=true]:text-primary"
                }}
            >
                <Tab key="statistics" title="Overview">
                    <div className="mt-10">
                        <ProviderStatistics />
                    </div>
                </Tab>

                <Tab key="requests" title={`Requests (${providerPending.length})`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        {providerPending.length > 0 ? (
                            providerPending.map(b => (
                                <ManageBookingCard
                                    key={b.id}
                                    booking={b}
                                    actionLoading={actionLoading === b.id}
                                    onAccept={handleAcceptBooking}
                                    onReject={handleRejectBooking}
                                    onComplete={handleCompleteBooking}
                                />
                            ))
                        ) : (
                            <div className="md:col-span-2 text-center py-20 bg-default-50/50 rounded-3xl border border-dashed border-default-100">
                                <p className="font-bold text-default-400">No new requests in queue.</p>
                            </div>
                        )}
                    </div>
                </Tab>

                <Tab key="upcoming" title={`Upcoming (${upcomingBookings.length})`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        {upcomingBookings.length > 0 ? (
                            upcomingBookings.map(b => (
                                <ManageBookingCard
                                    key={b.id}
                                    booking={b}
                                    actionLoading={actionLoading === b.id}
                                    onAccept={handleAcceptBooking}
                                    onReject={handleRejectBooking}
                                    onComplete={handleCompleteBooking}
                                />
                            ))
                        ) : (
                            <div className="md:col-span-2 text-center py-20 bg-default-50/50 rounded-3xl border border-dashed border-default-100">
                                <p className="font-bold text-default-400">Clear schedule ahead.</p>
                            </div>
                        )}
                    </div>
                </Tab>

                <Tab key="completed" title={`History (${providerCompleted.length})`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        {providerCompleted.length > 0 ? (
                            providerCompleted.map(b => (
                                <ManageBookingCard
                                    key={b.id}
                                    booking={b}
                                    actionLoading={actionLoading === b.id}
                                    onAccept={handleAcceptBooking}
                                    onReject={handleRejectBooking}
                                    onComplete={handleCompleteBooking}
                                />
                            ))
                        ) : (
                            <div className="md:col-span-2 text-center py-20 bg-default-50/50 rounded-3xl border border-dashed border-default-100">
                                <p className="font-bold text-default-400">No completed sessions yet.</p>
                            </div>
                        )}
                    </div>
                </Tab>
            </Tabs>

            <CreateServiceModal
                isOpen={isOpen}
                onClose={onClose}
                onSuccess={() => refetch()}
                onCreateService={async (d) => { await createService(d); }}
            />
        </div>
    );
}

export default function ManageBookingsPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="flex items-center justify-center min-vh-screen">
                    <Spinner size="lg" color="primary" />
                </div>
            }>
                <ManageBookingsContent />
            </Suspense>
        </ProtectedRoute>
    );
}
