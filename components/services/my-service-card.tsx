"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Service } from "@/lib/api/my-services";
import { serviceCategories } from "@/data/mockData";
import { LocationIcon, CalendarIcon } from "@/components/icons";

interface MyServiceCardProps {
    service: Service;
    actionLoading: boolean;
    onToggleStatus: (serviceId: string, currentStatus: boolean) => void;
    onDelete: (serviceId: string) => void;
    onEdit?: (service: Service) => void;
    onView?: (service: Service) => void;
}

export const MyServiceCard = ({
    service,
    actionLoading,
    onToggleStatus,
    onDelete,
    onEdit,
    onView
}: MyServiceCardProps) => {
    const categoryLabel = serviceCategories.find(cat => cat.key === service.category)?.label || service.category;

    return (
        <Card className="border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-lg hover:shadow-xl transition-all overflow-hidden" radius="lg">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4 p-6 pb-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-extrabold text-default-900 truncate tracking-tight">{service.title}</h3>
                        <Chip
                            size="sm"
                            variant="flat"
                            color={service.isActive ? "success" : "default"}
                            className="font-bold text-[10px] uppercase tracking-wider"
                        >
                            {service.isActive ? "Active" : "Inactive"}
                        </Chip>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Chip size="sm" variant="flat" color="primary" className="font-bold text-[10px] uppercase">
                            {categoryLabel}
                        </Chip>
                        <div className="flex items-center gap-1.5 text-default-500">
                            <LocationIcon className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{service.location}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-[10px] font-bold text-default-400 uppercase tracking-tighter">Status</span>
                        <Switch
                            size="sm"
                            isSelected={service.isActive}
                            color="success"
                            isDisabled={actionLoading}
                            onValueChange={() => onToggleStatus(service.id, service.isActive)}
                            classNames={{
                                wrapper: "group-data-[selected=true]:bg-success",
                            }}
                        />
                    </div>

                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button isIconOnly variant="flat" size="sm" radius="full" className="bg-default-100/50">
                                <span className="text-xl font-black mb-1">⋮</span>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Service actions" variant="flat">
                            <DropdownItem key="view" onPress={() => onView?.(service)}>
                                View Details
                            </DropdownItem>
                            <DropdownItem key="edit" onPress={() => onEdit?.(service)}>
                                Edit Service
                            </DropdownItem>
                            <DropdownItem key="analytics">
                                View Analytics
                            </DropdownItem>
                            <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                onPress={() => onDelete(service.id)}
                            >
                                Delete Service
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </CardHeader>

            <CardBody className="p-6 pt-2">
                <p className="text-sm font-medium text-default-600 mb-6 leading-relaxed line-clamp-2">
                    {service.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 rounded-2xl bg-default-50/50 dark:bg-default-50/5 border border-default-100 dark:border-default-100/10">
                    <div>
                        <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest mb-1">Pricing</p>
                        <p className="font-black text-primary text-lg">${service.price}<span className="text-xs font-bold text-default-500">/{service.priceType}</span></p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest mb-1">Created</p>
                        <div className="flex items-center gap-1.5 font-bold text-default-700 text-sm">
                            <CalendarIcon className="w-3.5 h-3.5 text-default-400" />
                            {new Date(service.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-default-400 uppercase tracking-widest mb-1">Approval</p>
                        <Chip size="sm" variant="dot" color={service.approvalStatus === 'approved' ? 'success' : 'warning'} className="border-none p-0 h-auto font-bold text-xs uppercase">
                            {service.approvalStatus}
                        </Chip>
                    </div>
                    <div className="flex items-center justify-end">
                        <Button
                            variant="flat"
                            color="primary"
                            size="sm"
                            radius="lg"
                            className="font-bold text-xs"
                            as="a"
                            href={`/service/${service.id}`}
                        >
                            Preview
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
