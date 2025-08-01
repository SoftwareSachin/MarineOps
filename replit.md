# Marine Vessel Operations Dashboard

## Overview

The Marine Vessel Operations platform is a comprehensive maritime logistics dashboard that revolutionizes maritime operations by providing real-time monitoring and analytics for marine vessels. The system combines a modern React frontend with an Express.js backend to deliver real-time performance metrics, environmental monitoring, maintenance scheduling, and alert management. The platform is designed to optimize vessel performance, enable predictive maintenance, ensure safety assurance, and improve cost efficiency across global fleets.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom maritime-themed color palette including deep navy, maritime blue, and safety colors

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL via Neon serverless driver
- **Real-time Communication**: WebSocket server for live data streaming
- **API Design**: RESTful API with comprehensive vessel, performance, alert, and maintenance endpoints

### Data Storage Solutions
- **Primary Database**: PostgreSQL with the following schema:
  - Users table with role-based access (viewer, operator, admin)
  - Vessels table storing vessel information, position, speed, and status
  - Performance metrics table for real-time engine and fuel data
  - Alerts table with severity levels and acknowledgment system
  - Maintenance schedule table for predictive maintenance tracking
  - Environmental data table for weather and sea conditions

### Authentication and Authorization
- Role-based access control with three tiers: viewer, operator, and admin
- Session-based authentication with user management capabilities

### External Service Integrations
- **Neon Database**: Serverless PostgreSQL database hosting
- **WebSocket Integration**: Real-time data streaming for live dashboard updates
- **Replit Development Tools**: Integrated development environment with hot reload and error handling

### Key Architectural Decisions

**Component Architecture**: Modular widget-based dashboard design allowing for customizable layouts and responsive design across different screen sizes from bridge consoles to tablets.

**Real-time Data Flow**: WebSocket connection provides live updates for performance metrics, environmental data, and alerts, ensuring operators have access to current vessel status.

**Database Design**: Relational schema optimized for maritime operations with proper foreign key relationships and indexes for efficient querying of time-series data.

**Type Safety**: Full TypeScript implementation with shared schema definitions between frontend and backend, ensuring data consistency and reducing runtime errors.

**UI/UX Design**: Maritime-themed dark mode interface with high contrast for bridge console visibility, consistent iconography, and accessibility compliance for maritime environments.