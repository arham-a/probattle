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
import { useMyServices } from "@/lib/hooks/useMyServices";
import { CreateServiceRequest } from "@/lib/api/my-services";

// New Component
import { MyServiceCard } from "@/components/services/my-service-card";

function MyServicesContent() {
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        services,
        pagination,
        isLoading,
        error,
        refetch,
        createService,
        activateService,
        deactivateService,
        deleteService
    } = useMyServices();
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    if (!user) return null;

    if (user.role === 'seeker') {
        return (
            <div className="container mx-auto px-6 py-20 text-center max-w-2xl">
                <div className="bg-warning/5 p-10 rounded-3xl border border-warning/20">
                    <h1 className="text-2xl font-black text-warning mb-4">Provider Dashboard Required</h1>
                    <p className="text-default-600 font-medium mb-8">This management area is exclusive to our service providers. Ready to share your skills?</p>
                    <Button as={NextLink} href="/dashboard" color="primary" radius="full" className="font-bold px-10 shadow-lg shadow-primary/20">
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const activeServices = services.filter(service => service.isActive);
    const inactiveServices = services.filter(service => !service.isActive);

    const handleToggleStatus = async (serviceId: string, currentStatus: boolean) => {
        try {
            setActionLoading(serviceId);
            if (currentStatus) await deactivateService(serviceId);
            else await activateService(serviceId);
        } catch (err) { console.error(err); }
        finally { setActionLoading(null); }
    };

    const handleDeleteService = async (serviceId: string) => {
        if (window.confirm('Are you sure you want to permanentaly delete this service?')) {
            try {
                setActionLoading(serviceId);
                await deleteService(serviceId);
            } catch (err) { console.error(err); }
            finally { setActionLoading(null); }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] py-40">
                <div className="text-center">
                    <Spinner size="lg" color="primary" />
                    <p className="mt-6 text-default-500 font-bold animate-pulse uppercase tracking-widest">Loading Catalog</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-20 max-w-[1400px]">
                <Card className="border-none shadow-2xl bg-danger/5" radius="lg">
                    <CardBody className="text-center py-16">
                        <h3 className="text-2xl font-black mb-2 text-danger">Connection Failed</h3>
                        <p className="text-default-600 mb-8 max-w-sm mx-auto font-medium">{error}</p>
                        <Button
                            color="danger"
                            variant="solid"
                            radius="full"
                            className="font-bold px-10 shadow-lg shadow-danger/20"
                            onPress={() => refetch()}
                        >
                            Reconnect
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 md:px-10 py-12 max-w-[1400px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-default-900 mb-2">My Catalog</h1>
                    <p className="text-default-500 font-bold text-sm tracking-wide uppercase opacity-70">
                        Manage your service listings & track performance
                    </p>
                </div>
                <Button
                    onPress={onOpen}
                    color="primary"
                    size="lg"
                    radius="lg"
                    className="font-black px-8 shadow-xl shadow-primary/25"
                >
                    Create New Service
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Services', value: pagination?.total || 0, color: 'primary' },
                    { label: 'Active Now', value: activeServices.length, color: 'success' },
                    { label: 'Paused', value: inactiveServices.length, color: 'warning' },
                    { label: 'Est. Value', value: `$${services.reduce((sum, s) => sum + parseFloat(s.price), 0).toFixed(0)}`, color: 'default' }
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-background/40 dark:bg-default-50/20 backdrop-blur-sm shadow-sm" radius="lg">
                        <CardBody className="p-6 text-center">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-default-500 mb-2">{stat.label}</p>
                            <p className={`text-3xl font-black text-${stat.color === 'default' ? 'default-900' : stat.color}`}>{stat.value}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {services.length === 0 ? (
                <Card className="border-none shadow-lg bg-default-50/50 dark:bg-default-50/5" radius="lg">
                    <CardBody className="text-center py-24">
                        <div className="text-6xl mb-8 opacity-20 italic font-serif">Empty</div>
                        <h3 className="text-2xl font-black mb-3">No active listings</h3>
                        <p className="text-default-500 mb-10 max-w-sm mx-auto font-medium">
                            You haven't added any services to your catalog yet. Start sharing your skills with the community today.
                        </p>
                        <Button
                            onPress={onOpen}
                            color="primary"
                            size="lg"
                            radius="full"
                            className="font-black px-12 shadow-xl shadow-primary/20"
                        >
                            Post Your First Service
                        </Button>
                    </CardBody>
                </Card>
            ) : (
                <Tabs
                    aria-label="Filter catalog"
                    variant="underlined"
                    classNames={{
                        tabList: "gap-8 w-full relative rounded-none p-0 border-b border-divider",
                        cursor: "w-full bg-primary h-[3px]",
                        tab: "max-w-fit px-0 h-14 font-black text-sm uppercase tracking-wider",
                        tabContent: "group-data-[selected=true]:text-primary"
                    }}
                >
                    <Tab key="all" title={`All Listings (${services.length})`}>
                        <div className="grid grid-cols-1 gap-6 mt-8">
                            {services.map((service) => (
                                <MyServiceCard
                                    key={service.id}
                                    service={service}
                                    actionLoading={actionLoading === service.id}
                                    onToggleStatus={handleToggleStatus}
                                    onDelete={handleDeleteService}
                                />
                            ))}
                        </div>
                    </Tab>

                    <Tab key="active" title={`Active (${activeServices.length})`}>
                        <div className="grid grid-cols-1 gap-6 mt-8">
                            {activeServices.length > 0 ? (
                                activeServices.map((service) => (
                                    <MyServiceCard
                                        key={service.id}
                                        service={service}
                                        actionLoading={actionLoading === service.id}
                                        onToggleStatus={handleToggleStatus}
                                        onDelete={handleDeleteService}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-default-50/30 rounded-3xl border border-dashed border-default-200">
                                    <p className="font-bold text-default-500">No active services currently visible.</p>
                                </div>
                            )}
                        </div>
                    </Tab>

                    <Tab key="inactive" title={`Inactive (${inactiveServices.length})`}>
                        <div className="grid grid-cols-1 gap-6 mt-8">
                            {inactiveServices.length > 0 ? (
                                inactiveServices.map((service) => (
                                    <MyServiceCard
                                        key={service.id}
                                        service={service}
                                        actionLoading={actionLoading === service.id}
                                        onToggleStatus={handleToggleStatus}
                                        onDelete={handleDeleteService}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-default-50/30 rounded-3xl border border-dashed border-default-200">
                                    <p className="font-bold text-default-500">All your services are live!</p>
                                </div>
                            )}
                        </div>
                    </Tab>
                </Tabs>
            )}

            <CreateServiceModal
                isOpen={isOpen}
                onClose={onClose}
                onSuccess={() => refetch()}
                onCreateService={async (d) => {
                    try { await createService(d); }
                    catch (err) { console.error(err); throw err; }
                }}
            />
        </div>
    );
}

export default function MyServicesPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <Spinner size="lg" color="primary" />
                </div>
            }>
                <MyServicesContent />
            </Suspense>
        </ProtectedRoute>
    );
}
