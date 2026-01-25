"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { SearchIcon, LocationIcon } from "@/components/icons";
import { serviceCategories } from "@/data/mockData";
import { Slider } from "@/components/ui/slider";

interface ServiceFiltersProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
    sortBy: string;
    setSortBy: (val: any) => void;
    distance: number;
    setDistance: (val: number) => void;
    minPrice: number;
    setMinPrice: (val: number) => void;
    maxPrice: number;
    setMaxPrice: (val: number) => void;
    onSearch: () => void;
    onClear: () => void;
    onRefreshLocation: () => void;
    locationLoading: boolean;
    userLocation: { lat: number; lng: number } | null;
    isLoading: boolean;
    userRole: string;
    onCreateService: () => void;
    totalFound: number;
}

export const ServiceFilters = ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    distance,
    setDistance,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    onSearch,
    onClear,
    onRefreshLocation,
    locationLoading,
    userLocation,
    isLoading,
    userRole,
    onCreateService,
    totalFound
}: ServiceFiltersProps) => {
    const sortOptions = [
        { key: 'newest', label: 'Newest First' },
        { key: 'nearest', label: 'Nearest First' },
        { key: 'rating', label: 'Highest Rated' },
        { key: 'price_low', label: 'Price: Low-High' },
        { key: 'price_high', label: 'Price: High-Low' },
    ];

    return (
        <Card className="mb-10 border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-lg" radius="lg">
            <CardBody className="p-8">
                <div className="flex flex-col gap-8">
                    {/* Main Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="What service are you looking for?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                                startContent={<SearchIcon className="text-primary w-5 h-5" />}
                                radius="lg"
                                variant="bordered"
                                classNames={{
                                    inputWrapper: "h-12 bg-default-100/30 dark:bg-default-50/5 border-default-200 dark:border-default-100 px-6",
                                    input: "text-sm font-medium ml-2"
                                }}
                            />
                        </div>
                        <Button
                            color="primary"
                            variant="solid"
                            radius="lg"
                            className="h-12 px-10 font-bold shadow-lg shadow-primary/20"
                            onPress={onSearch}
                            isLoading={isLoading}
                        >
                            Discover
                        </Button>
                    </div>

                    {/* Quick Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Select
                            placeholder="Category"
                            variant="bordered"
                            selectedKeys={selectedCategory ? [selectedCategory] : []}
                            onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string || "")}
                            radius="lg"
                            classNames={{ trigger: "h-12 bg-default-100/30 dark:bg-default-50/5 border-default-200 dark:border-default-100" }}
                        >
                            {serviceCategories.map((cat) => (
                                <SelectItem key={cat.key} className="font-medium text-sm">
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </Select>

                        <Select
                            placeholder="Sort By"
                            variant="bordered"
                            selectedKeys={[sortBy]}
                            onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as any)}
                            radius="lg"
                            classNames={{ trigger: "h-12 bg-default-100/30 dark:bg-default-50/5 border-default-200 dark:border-default-100" }}
                        >
                            {sortOptions.map((opt) => (
                                <SelectItem key={opt.key} className="font-medium text-sm">{opt.label}</SelectItem>
                            ))}
                        </Select>

                        <Button
                            variant="bordered"
                            startContent={<LocationIcon className="w-4 h-4 text-success" />}
                            onPress={onRefreshLocation}
                            isLoading={locationLoading}
                            radius="lg"
                            className="h-12 font-bold text-sm bg-default-100/30 dark:bg-default-50/5 border-default-200 dark:border-default-100"
                        >
                            {userLocation ? `Location: ${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}` : 'Set Location'}
                        </Button>

                        <div className="flex items-center gap-4 px-2">
                            <span className="text-[11px] font-bold text-default-500 uppercase tracking-wider">Radius</span>
                            <Slider
                                min={1}
                                max={25}
                                value={distance}
                                onChange={setDistance}
                                formatValue={(val) => `${val}km`}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    {/* Price & Actions Row */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-4 border-t border-default-100 dark:border-default-100/10">
                        <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto">
                            <div className="flex flex-col gap-1 w-full md:w-48">
                                <span className="text-[10px] font-bold text-default-400 uppercase ml-1">Min Price</span>
                                <Slider min={0} max={200} value={minPrice} onChange={setMinPrice} formatValue={(v) => `$${v}`} />
                            </div>
                            <div className="flex flex-col gap-1 w-full md:w-48">
                                <span className="text-[10px] font-bold text-default-400 uppercase ml-1">Max Price</span>
                                <Slider min={200} max={1000} value={maxPrice} onChange={setMaxPrice} formatValue={(v) => `$${v}`} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1">
                            <span className="text-xs font-bold text-default-400 whitespace-nowrap">{totalFound} services found</span>
                            <Button size="sm" variant="light" className="font-bold text-xs" onPress={onClear}>Reset</Button>
                            <div className="h-6 w-[1px] bg-default-200 dark:bg-default-100 mx-2" />
                            {(userRole === 'provider' || userRole === 'both') && (
                                <Button color="success" size="sm" radius="lg" className="font-bold px-6 shadow-lg shadow-success/20" onPress={onCreateService}>
                                    Post Service
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
