import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Stage 1 Data Models
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'provider' | 'seeker' | 'both';
  rating: number;
  reviewCount: number;
  joinedDate: string;
  verified: boolean;
}

export interface ServiceListing {
  id: string;
  providerId: string;
  provider: User;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  priceType: 'hourly' | 'fixed' | 'daily';
  availability: string[];
  location: string;
  images?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface BookingRequest {
  id: string;
  serviceId: string;
  service: ServiceListing;
  seekerId: string;
  seeker: User;
  requestedDate: string;
  requestedTime: string;
  duration: number; // in hours
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 
  | 'tutoring'
  | 'repair'
  | 'cleaning'
  | 'gardening'
  | 'tech-support'
  | 'pet-care'
  | 'delivery'
  | 'handyman'
  | 'cooking'
  | 'fitness'
  | 'other';

export interface ServiceFilter {
  category?: ServiceCategory;
  priceRange?: [number, number];
  location?: string;
  availability?: string;
  rating?: number;
}
