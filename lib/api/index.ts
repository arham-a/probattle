// API Configuration
export { apiClient, tokenManager, API_BASE_URL } from './config';

// Authentication
export { authService } from './auth';
export type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User 
} from './auth';

// Services
export { servicesService } from './services';
export type { 
  Service, 
  CreateServiceRequest, 
  UpdateServiceRequest, 
  ServiceSearchParams 
} from './services';

// Bookings
export { bookingsService } from './bookings';
export type { 
  Booking, 
  CreateBookingRequest, 
  UpdateBookingRequest, 
  BookingSearchParams 
} from './bookings';

// Users
export { usersService } from './users';
export type { 
  UserProfile, 
  UpdateProfileRequest, 
  ChangePasswordRequest 
} from './users';