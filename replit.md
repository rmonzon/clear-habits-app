# Overview

ClearHabits is a personal habit tracking application that helps users build lasting habits through goal setting, progress visualization, and streak tracking. The application features a clean, modern interface with Material Design principles, allowing users to create daily, weekly, monthly, or yearly habits with custom targets and categories. Users can track their progress with intuitive visualizations including progress bars, streak counters, and completion statistics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management with optimistic updates
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens supporting light/dark themes
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with structured error handling
- **File Structure**: Monorepo setup with shared schema between client and server

## Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL via Neon serverless
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Connection**: Connection pooling with neon-serverless client

## Authentication System
- **Provider**: Supabase Authentication
- **Session Management**: Stateless JWT token authentication
- **Security**: Bearer token authorization with JWT verification
- **User Management**: Automatic user creation/updates on authentication

## Core Data Models
- **Users**: Profile information and authentication data
- **Goals**: Habit definitions with frequency, targets, and categories
- **Goal Completions**: Time-stamped completion records for progress tracking
- **Sessions**: Secure session storage for authentication state

## Design System
- **Theme Support**: Light/dark mode with CSS custom properties
- **Typography**: Inter for UI text, JetBrains Mono for numerical data
- **Component Patterns**: Consistent spacing (2, 4, 6, 8, 12, 16px units)
- **Interactive Elements**: Hover and active states with elevation effects
- **Color Palette**: Material Design inspired with productivity focus

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Database URL**: Environment-based configuration for database connections

## Authentication Services  
- **Supabase Auth**: JWT-based authentication provider
- **Token Management**: Stateless authentication with Bearer tokens

## Development Tools
- **Vite**: Frontend build tool with HMR and development server
- **Replit Integration**: Development environment with live preview and error overlays

## UI Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework for styling

## Validation & Forms
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management with validation integration

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx/tailwind-merge**: Conditional class name utilities
- **memoizee**: Function memoization for performance optimization