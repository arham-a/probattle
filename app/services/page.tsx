"use client";

import { Suspense, useState, useEffect } from "react";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { useDisclosure } from "@heroui/modal";
import { useServices } from "@/lib/hooks/useServices";
import { useAuth } from "@/contexts/AuthContext";
import { SearchServicesParams, Service } from "@/lib/api/services";
import { myServicesService, CreateServiceRequest } from "@/lib/api/my-services";
import { AdminRouteGuard } from "@/components/admin-route-guard";

// Shared Components
import CreateServiceModal from "@/components/modals/create-service-modal";
import BookingModal from "@/components/modals/booking-modal";

// New Page-Specific Components
import { ServiceFilters } from "@/components/services/service-filters";
import { ServiceCard } from "@/components/services/service-card";

function ServicesContent() {
  const { user } = useAuth();
  const { services, pagination, isLoading, error, searchServices } = useServices();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isBookingOpen, onOpen: onBookingOpen, onClose: onBookingClose } = useDisclosure();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [distance, setDistance] = useState(10);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState<'newest' | 'nearest' | 'rating' | 'price_low' | 'price_high'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationLoading(false);
        },
        () => {
          setUserLocation({ lat: 24.8607, lng: 67.0011 }); // Karachi Default
          setLocationLoading(false);
        }
      );
    } else {
      setUserLocation({ lat: 24.8607, lng: 67.0011 });
      setLocationLoading(false);
    }
  };

  const performSearch = async () => {
    if (!userLocation) return;

    const params: SearchServicesParams = {
      page: currentPage,
      limit: 6,
      sortBy,
      radius: distance,
      lat: userLocation.lat,
      lng: userLocation.lng,
      search: searchQuery.trim() || undefined,
      category: selectedCategory || undefined,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < 1000 ? maxPrice : undefined,
    };

    try { await searchServices(params); } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!userLocation) getCurrentLocation();
    else performSearch();
  }, [currentPage, selectedCategory, sortBy, distance, minPrice, maxPrice]);

  useEffect(() => { if (userLocation) performSearch(); }, [userLocation]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setDistance(10);
    setMinPrice(0);
    setMaxPrice(1000);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const formatPrice = (price: string, type: string) => {
    return `$${parseFloat(price)}${type === 'hourly' ? '/hr' : type === 'daily' ? '/day' : ''}`;
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-6 md:px-10 py-12 max-w-[1400px]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-default-900 mb-2">Marketplace</h1>
        <p className="text-default-500 font-bold text-sm tracking-wide uppercase opacity-70">Nearby Services & Neighbor Experts</p>
      </div>

      {/* Filters */}
      <ServiceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        distance={distance}
        setDistance={setDistance}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onSearch={() => { setCurrentPage(1); performSearch(); }}
        onClear={clearFilters}
        onRefreshLocation={getCurrentLocation}
        locationLoading={locationLoading}
        userLocation={userLocation}
        isLoading={isLoading}
        userRole={user.role}
        onCreateService={onOpen}
        totalFound={pagination?.total || 0}
      />

      {/* Grid States */}
      {!userLocation && locationLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" color="primary" /></div>
      ) : !userLocation ? (
        <div className="text-center py-20 bg-default-50/50 dark:bg-default-50/5 rounded-3xl border border-dashed border-default-200">
          <p className="text-lg font-bold text-default-700 mb-4">Location Permission Required</p>
          <button onClick={getCurrentLocation} className="px-10 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20">Enable Location</button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" color="primary" /></div>
      ) : error ? (
        <div className="text-center py-20 bg-danger/5 rounded-3xl border border-danger/10">
          <p className="text-danger font-bold text-lg mb-2">Error Connecting</p>
          <p className="text-default-500 mb-6">{error}</p>
          <button onClick={performSearch} className="px-10 py-3 bg-danger text-white rounded-full font-bold shadow-lg shadow-danger/20">Try Again</button>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-24 bg-default-50/50 dark:bg-default-50/5 rounded-3xl border border-dashed border-default-100">
          <div className="text-5xl italic font-serif text-primary opacity-20 mb-6">No results</div>
          <p className="text-lg font-bold text-default-700 mb-2">Nothing matched your criteria</p>
          <p className="text-sm text-default-500 mb-8 max-w-sm mx-auto font-medium">Try broadening your search or exploring different categories nearby.</p>
          <button onClick={clearFilters} className="px-10 py-3 bg-default-200 dark:bg-default-100 text-default-900 rounded-full font-bold">Clear All Filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                userRole={user.role}
                currentUserId={user.id}
                formatPrice={formatPrice}
                onBook={(svc) => { setSelectedService(svc); onBookingOpen(); }}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center pt-8 border-t border-default-100 dark:border-default-100/10">
              <Pagination
                total={pagination.totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                color="primary"
                size="lg"
                radius="lg"
                showControls
                classNames={{
                  wrapper: "gap-2",
                  item: "font-bold shadow-none hover:bg-default-100",
                  cursor: "shadow-lg shadow-primary/20 font-bold"
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateServiceModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => performSearch()}
        onCreateService={(d) => myServicesService.createService(d).then(() => performSearch())}
      />

      {selectedService && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={onBookingClose}
          service={selectedService}
          onSuccess={() => alert('Booking request sent successfully!')}
        />
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <AdminRouteGuard>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[80vh]">
          <Spinner size="lg" color="primary" />
        </div>
      }>
        <ServicesContent />
      </Suspense>
    </AdminRouteGuard>
  );
}
