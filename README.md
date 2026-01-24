# Neighbourly - Stage 1: The Neighborhood Pilot

A hyper-local marketplace connecting community members to exchange skills, tools, and services.

## 🚀 Stage 1 Features

### Core Functionality
- **Service Listings**: Browse and search available services in your neighborhood
- **Service Categories**: Organized by type (tutoring, repair, cleaning, gardening, etc.)
- **Provider Profiles**: View provider ratings, reviews, and verification status
- **Booking System**: Request services with date, time, and custom messages
- **User Authentication**: Login/Register with role selection (Provider, Seeker, Both)
- **Role-Based Interface**: Navbar adapts based on authentication status
- **Responsive Design**: Modern, clean UI that works on all devices
- **Dark/Light Mode**: Automatic theme switching support

### Pages Built
1. **Home Page** (`/`) - Hero section with search and featured services
2. **Services Page** (`/services`) - Complete service browser with filtering
3. **Bookings Page** (`/bookings`) - Manage your service requests and status
4. **Post Service Page** (`/post-service`) - Create new service listings
5. **Login Page** (`/login`) - User authentication with social login options
6. **Register Page** (`/register`) - Account creation with role selection (Provider/Seeker/Both)
7. **Forgot Password Page** (`/forgot-password`) - Password reset functionality

### Tech Stack
- **Frontend**: Next.js 15 with TypeScript
- **UI Library**: Hero UI (modern React components)
- **Styling**: Tailwind CSS with custom theme
- **Data**: Mock data (JSON) for Stage 1 demonstration

## 🎨 Design Philosophy

- **Clean & Modern**: No glowing or shiny effects, just clean professional design
- **Community-Focused**: Emphasizes trust, verification, and local connections
- **Accessible**: Built with Hero UI's accessibility-first components
- **Responsive**: Mobile-first design that scales beautifully

## 🏗️ Data Model (Stage 1)

### Core Entities
- **User**: Provider/Seeker with ratings and verification
- **ServiceListing**: Title, description, pricing, availability
- **BookingRequest**: Service requests with status tracking

### Key Features
- User roles (Provider, Seeker, Both)
- Service categorization and tagging
- Flexible pricing (hourly, fixed, daily)
- Availability scheduling
- Rating and review system

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🔮 Evolution to Stage 2

The current architecture is designed to easily scale:
- Mock data will be replaced with PostgreSQL database
- Location-based queries will be added with geospatial indexing
- Authentication system will be implemented
- API endpoints will replace client-side data management

## 📱 Current Features Demo

- Browse 5+ sample services across different categories
- Interactive search and filtering
- Responsive service cards with provider info
- Booking management with status tracking
- Service posting form with validation
- User authentication with role selection
- Responsive navbar with user dropdown
- Theme switching (dark/light mode)
- Password reset functionality

Built with ❤️ for the community using Hero UI and Next.js.