"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import NextLink from "next/link";
import { 
  StarIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  MapPinIcon, 
  UsersIcon,
  AcademicCapIcon,
  HomeIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  HeartIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  CheckBadgeIcon as CheckBadgeIconSolid
} from "@heroicons/react/24/solid";
import { title, subtitle } from "@/components/primitives";

export default function Home() {
  const featuredServices = [
    {
      id: 1,
      title: "Advanced Math & Physics Tutoring",
      provider: "Dr. Sarah Chen",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      rating: 4.9,
      reviews: 127,
      price: "$35/hour",
      category: "Education",
      verified: true,
      distance: "0.3 miles",
      badge: "Top Rated",
      specialty: "PhD in Mathematics",
    },
    {
      id: 2,
      title: "Premium Garden Design & Care",
      provider: "Mike Rodriguez",
      avatar: "https://i.pravatar.cc/150?u=mike",
      rating: 4.8,
      reviews: 89,
      price: "$50/hour",
      category: "Home & Garden",
      verified: true,
      distance: "0.7 miles",
      badge: "Eco Expert",
      specialty: "Sustainable Landscaping",
    },
    {
      id: 3,
      title: "MacBook & Gaming PC Repair",
      provider: "Alex Kim",
      avatar: "https://i.pravatar.cc/150?u=alex",
      rating: 4.9,
      reviews: 156,
      price: "$75/service",
      category: "Tech Support",
      verified: true,
      distance: "1.2 miles",
      badge: "Tech Wizard",
      specialty: "Apple Certified Technician",
    },
    {
      id: 4,
      title: "Professional Pet Training",
      provider: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?u=emma",
      rating: 5.0,
      reviews: 203,
      price: "$40/session",
      category: "Pet Care",
      verified: true,
      distance: "0.5 miles",
      badge: "Perfect Score",
      specialty: "Behavioral Specialist",
    },
  ];

  const categories = [
    { 
      name: "Education", 
      count: 45, 
      icon: AcademicCapIcon,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10",
      description: "Tutoring & Learning"
    },
    { 
      name: "Home & Garden", 
      count: 32, 
      icon: HomeIcon,
      color: "from-green-500 to-emerald-600", 
      bgColor: "bg-green-500/10",
      description: "Maintenance & Design"
    },
    { 
      name: "Tech Support", 
      count: 28, 
      icon: ComputerDesktopIcon,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-500/10", 
      description: "Repair & Setup"
    },
    { 
      name: "Cleaning", 
      count: 38, 
      icon: SparklesIcon,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-500/10",
      description: "Deep & Regular Clean"
    },
    { 
      name: "Pet Care", 
      count: 22, 
      icon: HeartIcon,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
      description: "Training & Sitting"
    },
    { 
      name: "Handyman", 
      count: 41, 
      icon: WrenchScrewdriverIcon,
      color: "from-gray-600 to-slate-700",
      bgColor: "bg-gray-500/10",
      description: "Repairs & Assembly"
    },
  ];

  const stats = [
    { label: "Active Members", value: "2,500+", icon: UsersIcon, color: "text-blue-500" },
    { label: "Services Listed", value: "850+", icon: RocketLaunchIcon, color: "text-green-500" },
    { label: "Neighborhoods", value: "15", icon: MapPinIcon, color: "text-purple-500" },
    { label: "Avg Rating", value: "4.8★", icon: StarIcon, color: "text-yellow-500" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(127,86,217,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(127,86,217,0.1),transparent_50%)]" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-secondary/5 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-primary/10 rounded-full blur-lg animate-bounce" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          {/* Enhanced Main Heading */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-primary/10 backdrop-blur-xl rounded-full p-4 border border-primary/20">
                  <LightBulbIcon className="w-12 h-12 text-primary animate-pulse" />
                </div>
              </div>
            </div>
            
            <h1 className={title({ size: "lg", className: "mb-6" })}>
              Your Neighborhood,
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
                Supercharged
              </span>
            </h1>
            <p className={subtitle({ className: "text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed" })}>
              Connect with skilled neighbors who can help with anything. 
              From expert tutoring to professional repairs - your community has the talent you need.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button
              as={NextLink}
              href="/register"
              color="primary"
              size="lg"
              radius="lg"
              className="h-16 px-16 font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 hover:scale-105"
              startContent={<RocketLaunchIcon className="w-5 h-5" />}
            >
              Join Community
            </Button>
            <Button
              as={NextLink}
              href="/services"
              variant="bordered"
              size="lg"
              radius="lg"
              className="h-16 px-16 font-black text-sm uppercase tracking-widest border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
              startContent={<SparklesIcon className="w-5 h-5" />}
            >
              Explore Services
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                    <div className="relative bg-background/80 backdrop-blur-xl rounded-2xl p-4 border border-divider/50 group-hover:border-primary/30 transition-all duration-300">
                      <stat.icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-black text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{stat.value}</div>
                <div className="text-sm font-bold text-default-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services - Clean Design */}
      <section className="py-24 bg-gradient-to-b from-background/50 to-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-primary/10 backdrop-blur-xl rounded-full p-3 border border-primary/20">
                  <StarIconSolid className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
            <h2 className={title({ size: "md", className: "mb-6" })}>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Trending
              </span>{" "}
              in Your Area
            </h2>
            <p className={subtitle({ className: "max-w-2xl mx-auto text-lg" })}>
              Discover highly-rated services from verified community experts who are making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <Card
                key={service.id}
                className="bg-background/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                isPressable
              >
                <CardBody className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-2">
                      <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="font-bold text-xs uppercase tracking-wider"
                      >
                        {service.category}
                      </Chip>
                      <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                        className="font-bold text-xs"
                      >
                        {service.badge}
                      </Chip>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-xl text-primary">{service.price}</div>
                      <div className="text-xs text-default-500 flex items-center gap-1 justify-end mt-1">
                        <MapPinIcon className="w-3 h-3" />
                        {service.distance}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black tracking-tight mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-default-600 font-medium mb-4">{service.specialty}</p>

                  {/* Provider */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-divider">
                    <Badge
                      content={service.verified ? <CheckBadgeIconSolid className="w-3 h-3 text-white" /> : null}
                      color="success"
                      placement="bottom-right"
                    >
                      <Avatar
                        src={service.avatar}
                        name={service.provider}
                        size="md"
                        className="border-2 border-primary/20"
                      />
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{service.provider}</div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(service.rating) ? 'text-warning' : 'text-default-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="font-bold ml-1">{service.rating}</span>
                        <span className="text-default-500">({service.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <Button
                    color="primary"
                    size="md"
                    radius="lg"
                    className="w-full font-bold text-sm uppercase tracking-wider"
                    startContent={<HeartIconSolid className="w-4 h-4" />}
                  >
                    Book Now
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              as={NextLink}
              href="/services"
              variant="bordered"
              size="lg"
              radius="lg"
              className="font-black text-sm uppercase tracking-widest border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 px-12 h-14 transition-all duration-300"
              startContent={<SparklesIcon className="w-5 h-5" />}
            >
              Discover All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Categories - Clean Design */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-primary/10 backdrop-blur-xl rounded-full p-3 border border-primary/20">
                  <SparklesIcon className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
            <h2 className={title({ size: "md", className: "mb-6" })}>
              Explore by{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Category
              </span>
            </h2>
            <p className={subtitle({ className: "max-w-2xl mx-auto text-lg" })}>
              From learning to fixing, find exactly what you need across our most popular service categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={index}
                  className="bg-background/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                  isPressable
                >
                  <CardBody className="p-6 text-center">
                    {/* Icon */}
                    <div className="mb-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="font-black text-sm uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-default-600 font-medium mb-3">
                      {category.description}
                    </p>
                    
                    {/* Count */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl font-black text-primary">{category.count}</span>
                      <span className="text-xs text-default-500 font-bold">services</span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Button
              as={NextLink}
              href="/services"
              color="primary"
              size="lg"
              radius="lg"
              className="font-black text-sm uppercase tracking-widest px-12 h-14 shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
              startContent={<RocketLaunchIcon className="w-5 h-5" />}
            >
              Browse All Categories
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section className="py-24 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-primary/10 backdrop-blur-xl rounded-full p-3 border border-primary/20">
                  <LightBulbIcon className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
            <h2 className={title({ size: "md", className: "mb-6" })}>
              How Neighbourly{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className={subtitle({ className: "max-w-2xl mx-auto text-lg" })}>
              Connect with your community in three simple, powerful steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300 group-hover:scale-110">
                  <SparklesIcon className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-black text-sm">1</div>
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-6 group-hover:text-blue-500 transition-colors duration-300">Discover & Explore</h3>
              <p className="text-default-600 leading-relaxed text-lg">
                Browse amazing services in your neighborhood. Filter by distance, price, and ratings to find exactly what you need.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto border border-green-500/20 group-hover:border-green-500/40 transition-all duration-300 group-hover:scale-110">
                  <UsersIcon className="w-10 h-10 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-black text-sm">2</div>
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-6 group-hover:text-green-500 transition-colors duration-300">Connect & Book</h3>
              <p className="text-default-600 leading-relaxed text-lg">
                View detailed provider profiles, read authentic reviews, and book services instantly. Chat directly to discuss your needs.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500/10 to-violet-600/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300 group-hover:scale-110">
                  <StarIcon className="w-10 h-10 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-black text-sm">3</div>
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-6 group-hover:text-purple-500 transition-colors duration-300">Experience & Review</h3>
              <p className="text-default-600 leading-relaxed text-lg">
                Get exceptional service from verified community members. Share your experience to help others and strengthen the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(127,86,217,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(127,86,217,0.1),transparent_40%)]" />
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-bounce" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-primary/10 backdrop-blur-xl rounded-full p-4 border border-primary/20">
                <RocketLaunchIcon className="w-12 h-12 text-primary animate-bounce" />
              </div>
            </div>
          </div>
          
          <h2 className={title({ size: "md", className: "mb-8" })}>
            Ready to{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
              Supercharge
            </span>
            <br />
            Your Community?
          </h2>
          <p className={subtitle({ className: "mb-16 max-w-3xl mx-auto text-xl leading-relaxed" })}>
            Whether you're seeking help or sharing your expertise, Neighbourly makes it effortless to connect with amazing people nearby. Join thousands who are already building stronger communities.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-12">
            <Button
              as={NextLink}
              href="/register"
              color="primary"
              size="lg"
              radius="lg"
              className="h-18 px-16 font-black text-base uppercase tracking-widest shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-500 hover:scale-110 group"
              startContent={<RocketLaunchIcon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />}
            >
              Start Your Journey
            </Button>
            <Button
              as={NextLink}
              href="/login"
              variant="bordered"
              size="lg"
              radius="lg"
              className="h-18 px-16 font-black text-base uppercase tracking-widest border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-500 hover:scale-110 group"
              startContent={<SparklesIcon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />}
            >
              Sign In
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="flex flex-wrap justify-center gap-12 text-center">
            <div className="group">
              <div className="text-sm text-default-500 font-bold uppercase tracking-wider mb-2">Trusted by</div>
              <div className="text-3xl font-black text-primary group-hover:scale-110 transition-transform duration-300">2,500+ Members</div>
            </div>
            <div className="group">
              <div className="text-sm text-default-500 font-bold uppercase tracking-wider mb-2">Average Rating</div>
              <div className="text-3xl font-black text-primary group-hover:scale-110 transition-transform duration-300 flex items-center justify-center gap-2">
                4.8 <StarIconSolid className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="group">
              <div className="text-sm text-default-500 font-bold uppercase tracking-wider mb-2">Response Time</div>
              <div className="text-3xl font-black text-primary group-hover:scale-110 transition-transform duration-300">&lt; 2 Hours</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}