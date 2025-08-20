# Battery Voltage Tool

## Overview

This is a full-stack web application for battery voltage analysis, built with React frontend and Express backend. The application provides a tool for selecting battery chemistry types and cell configurations, displaying voltage specifications for different battery states (empty, storage, nominal, full). It features a tabbed interface with a main tool view and a chart view for comprehensive battery data visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Built with React 18 and TypeScript for type safety
- **Component Library**: Uses shadcn/ui components built on Radix UI primitives for consistent, accessible UI
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **State Management**: TanStack Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing between tool and chart views
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript
- **Static File Serving**: Serves CSV battery data from attached assets
- **Development Integration**: Vite middleware integration for seamless development experience
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Data Layer
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Schema Management**: Shared schema between client and server for type consistency
- **Database Provider**: Neon Database serverless PostgreSQL configured
- **Data Source**: CSV file serving battery voltage specifications for different chemistries and cell counts

### File Organization
- **Monorepo Structure**: Shared code in `/shared`, client in `/client`, server in `/server`
- **Path Aliases**: TypeScript path mapping for clean imports (`@/`, `@shared/`)
- **Asset Management**: Static assets served from `/attached_assets` directory

### Authentication & Sessions
- **Session Management**: PostgreSQL session store using connect-pg-simple
- **User Schema**: Prepared user table with username/password authentication structure
- **Memory Storage**: Fallback in-memory user storage for development

### Development Experience
- **Hot Reloading**: Vite HMR integration with Express server
- **TypeScript**: Full TypeScript coverage across frontend, backend, and shared code
- **Code Quality**: ESLint and TypeScript strict mode for code consistency
- **Development Tools**: Runtime error overlay and development banner for Replit environment

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe PostgreSQL ORM with migration support
- **Connect PG Simple**: PostgreSQL session store for Express sessions

### UI & Styling
- **Radix UI**: Headless UI component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system built on Radix UI

### Development & Build
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type system for enhanced developer experience
- **ESBuild**: Fast bundling for production server build
- **PostCSS**: CSS processing with Tailwind CSS integration

### Data Processing
- **PapaParse**: CSV parsing library for battery data processing
- **Zod**: Runtime type validation and schema parsing
- **Date-fns**: Date utility library for time-based operations

### State Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Hookform Resolvers**: Integration between React Hook Form and validation libraries