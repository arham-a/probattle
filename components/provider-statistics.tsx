"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { useProviderStatistics } from "@/lib/hooks/useProviderStatistics";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, subtitle, color = "default", icon, trend }: StatCardProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardBody className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && <div className="text-xl">{icon}</div>}
            <p className="text-sm font-medium text-default-600">{title}</p>
          </div>
          <div className="space-y-1">
            <p className={`text-3xl font-bold ${
              color === "success" ? "text-success" :
              color === "warning" ? "text-warning" :
              color === "danger" ? "text-danger" :
              color === "primary" ? "text-primary" :
              "text-default-900"
            }`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-default-500">{subtitle}</p>
            )}
          </div>
        </div>
        {trend && (
          <Chip
            size="sm"
            color={trend.isPositive ? "success" : "danger"}
            variant="flat"
          >
            {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
          </Chip>
        )}
      </div>
    </CardBody>
  </Card>
);

export default function ProviderStatistics() {
  const { statistics, isLoading, error, refetch } = useProviderStatistics();

  if (isLoading) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Loading statistics...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <div className="text-danger mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2 text-danger">Failed to Load Statistics</h3>
          <p className="text-default-600 mb-4">{error}</p>
          <Button color="primary" variant="flat" onPress={refetch}>
            Try Again
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={statistics.totalBookings}
          subtitle="All time"
          color="primary"
          icon="📊"
        />
        <StatCard
          title="Pending Requests"
          value={statistics.pendingRequests}
          subtitle="Awaiting response"
          color="warning"
          icon="⏳"
        />
        <StatCard
          title="Upcoming Bookings"
          value={statistics.upcomingBookings}
          subtitle="Confirmed appointments"
          color="success"
          icon="📅"
        />
        <StatCard
          title="Completed Bookings"
          value={statistics.completedBookings}
          subtitle="Successfully finished"
          color="success"
          icon="✅"
        />
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Earnings"
          value={`$${statistics.totalEarnings.toLocaleString()}`}
          subtitle="All time revenue"
          color="success"
          icon="💰"
        />
        <StatCard
          title="This Month"
          value={`$${statistics.thisMonthEarnings.toLocaleString()}`}
          subtitle="Current month earnings"
          color="primary"
          icon="📈"
        />
        <StatCard
          title="Average Booking Value"
          value={`$${statistics.avgBookingValue.toFixed(0)}`}
          subtitle="Per booking"
          color="default"
          icon="💵"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">⏱️</span>
              <h3 className="text-sm font-medium text-default-600">Total Hours Worked</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="text-2xl font-bold text-primary mb-2">
              {statistics.totalHoursWorked}h
            </div>
            <p className="text-xs text-default-500">Across all bookings</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h3 className="text-sm font-medium text-default-600">Completion Rate</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="text-2xl font-bold text-success mb-2">
              {statistics.completionRate}%
            </div>
            <div className="w-full bg-default-200 rounded-full h-2 mb-1">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-300" 
                style={{ width: `${statistics.completionRate}%` }}
              />
            </div>
            <p className="text-xs text-default-500">
              {statistics.completedBookings} of {statistics.totalBookings} bookings
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔧</span>
              <h3 className="text-sm font-medium text-default-600">Active Services</h3>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="text-2xl font-bold text-primary mb-2">
              {statistics.activeServices}
            </div>
            <p className="text-xs text-default-500">Currently available</p>
          </CardBody>
        </Card>
      </div>

      {/* Top Services */}
      {statistics.topServices && statistics.topServices.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h3 className="text-lg font-semibold">Top Performing Services</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {statistics.topServices.map((service, index) => (
                <div key={service.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? "bg-warning text-warning-foreground" :
                        index === 1 ? "bg-default-200 text-default-700" :
                        index === 2 ? "bg-orange-200 text-orange-700" :
                        "bg-default-100 text-default-600"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-default-900">{service.title}</h4>
                        <p className="text-sm text-default-600">
                          {service.bookingCount} booking{service.bookingCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-success">${service.earnings}</div>
                      <div className="text-xs text-default-500">earned</div>
                    </div>
                  </div>
                  {index < statistics.topServices.length - 1 && (
                    <Divider className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Quick Insights</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-default-600">Cancelled Bookings</span>
                <Chip size="sm" color="danger" variant="flat">
                  {statistics.cancelledBookings}
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-default-600">Success Rate</span>
                <Chip size="sm" color="success" variant="flat">
                  {((statistics.completedBookings / Math.max(statistics.totalBookings, 1)) * 100).toFixed(1)}%
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-default-600">Avg. Hours per Booking</span>
                <Chip size="sm" color="primary" variant="flat">
                  {(statistics.totalHoursWorked / Math.max(statistics.completedBookings, 1)).toFixed(1)}h
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Monthly Performance</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-default-600">Monthly Revenue Progress</span>
                  <span className="text-sm font-semibold">
                    ${statistics.thisMonthEarnings} / ${statistics.totalEarnings}
                  </span>
                </div>
                <div className="w-full bg-default-200 rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(statistics.thisMonthEarnings / Math.max(statistics.totalEarnings, 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-default-500">
                  This month represents {((statistics.thisMonthEarnings / Math.max(statistics.totalEarnings, 1)) * 100).toFixed(1)}% of your total earnings
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}