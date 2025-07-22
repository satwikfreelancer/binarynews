# BinaryNews - Technology News Platform

## Overview

BinaryNews is a modern technology news platform built with React, Express.js, and PostgreSQL. The application provides a clean, responsive interface for reading technology news articles, browsing by categories, and includes an admin interface for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack monorepo architecture with clear separation between client and server:

- **Frontend**: React SPA with Vite build system
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **React SPA**: Modern React application with TypeScript
- **Component Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables
- **Query Management**: TanStack Query for efficient data fetching and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Express.js Server**: RESTful API with middleware for logging and error handling
- **Database Layer**: Drizzle ORM with PostgreSQL dialect
- **Storage Interface**: Abstracted storage layer with PostgreSQL database implementation for data persistence
- **API Structure**: Resource-based endpoints for articles, categories, and breaking news

### Database Schema
The application uses three main entities:
- **Categories**: Technology news categories with slugs and colors
- **Articles**: News articles with rich metadata, SEO fields, and category associations
- **Breaking News**: Time-sensitive news items with active/inactive states

### Development Setup
- **Vite Development Server**: Hot module replacement and fast builds
- **TypeScript Configuration**: Strict type checking with path aliases
- **ESBuild Production**: Fast production builds with ES modules

## Data Flow

1. **Client Requests**: React components use TanStack Query hooks to fetch data
2. **API Layer**: Express routes handle requests and interact with storage layer
3. **Database Operations**: Drizzle ORM manages database queries and migrations
4. **Response Handling**: Structured JSON responses with error handling
5. **State Management**: Client-side caching and synchronization via TanStack Query

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database (via @neondatabase/serverless)
- **Drizzle ORM**: Type-safe database operations with schema migrations

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first styling framework
- **Date-fns**: Date manipulation utilities

### Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundler for production
- **TypeScript**: Type safety and enhanced developer experience

## Deployment Strategy

### Development
- Vite development server with HMR
- Express server running with tsx for TypeScript execution
- PostgreSQL database with persistent data storage

### Production
- Vite builds optimized static assets
- ESBuild bundles the Express server
- PostgreSQL database with environment-based configuration
- Static file serving integrated with Express

### Database Management
- Drizzle migrations for schema versioning
- Environment-based database URL configuration
- Push-based schema updates for development

The application is designed to be easily deployable on platforms like Replit, with proper environment variable handling and both development and production configurations.