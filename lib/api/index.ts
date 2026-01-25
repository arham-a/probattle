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
  ServicesResponse,
  SearchServicesParams 
} from './services';

// My Services
export { myServicesService } from './my-services';
export type {
  CreateServiceRequest,
  ServiceCategory,
  PriceType,
  MyServicesResponse,
  MyServicesParams
} from './my-services';

// Bookings
export { bookingsService } from './bookings';
export type { 
  Booking,
  BookingStatus,
  MyBookingsResponse
} from './bookings';

// Users
export { usersService } from './users';
export type { 
  UserProfile, 
  UpdateProfileRequest, 
  ChangePasswordRequest 
} from './users';