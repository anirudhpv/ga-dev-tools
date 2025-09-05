# Overview

This is a Google Analytics Demos & Tools website built with Gatsby and React. The project showcases various demos and tools for Google Analytics APIs, including GA4 (Google Analytics 4) measurement protocol tools, request composers, and various analytics utilities. It serves as both a demonstration platform and a practical tool collection for developers working with Google Analytics APIs.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Gatsby (React-based static site generator) with TypeScript
- **UI Components**: Material-UI (MUI) v5 for consistent design system
- **Styling**: Emotion-based styling with Material-UI's styled components
- **State Management**: Redux with legacy createStore for application state
- **Routing**: Gatsby's built-in routing with pages-based structure

## Build System & Tooling
- **Build Tool**: Gatsby with custom build scripts in TypeScript
- **Package Management**: Yarn as the primary package manager
- **TypeScript Configuration**: ESNext target with React JSX support
- **Linting**: ESLint with TypeScript support and React-app configuration
- **Testing**: Jest with React Testing Library and custom Babel preprocessing

## Authentication & API Integration
- **Google APIs**: Integrated with Google Analytics Reporting API v4, Analytics Data API, and Analytics Admin API
- **Authentication**: Google API Client (gapi) with OAuth2 for user authentication
- **API Scopes**: Read-only access to Google Analytics data

## Data Management
- **Static Data**: JSON files in `/data` directory for demo product information
- **Runtime Configuration**: Environment-specific configuration through `runtime.json`
- **Local Storage**: Persistent user preferences and cached data using browser localStorage

## Deployment & Hosting
- **Hosting Platform**: Firebase Hosting with custom deployment scripts
- **Functions**: Firebase Cloud Functions for server-side operations (Bitly integration)
- **Environment Management**: Multi-environment setup (production/staging) with custom configuration scripts
- **Cache Strategy**: Gatsby-optimized caching with immutable static assets

## Code Organization
- **Component Structure**: Reusable React components in `/src/components`
- **Custom Hooks**: Utility hooks for state management and API interactions in `/src/hooks`
- **Type Definitions**: Comprehensive TypeScript types in `/src/types.ts` and global definitions
- **Constants Management**: Centralized URL and configuration constants

# External Dependencies

## Google Services
- **Google Analytics APIs**: Multiple API versions including GA4 Data API, Admin API, and legacy Reporting API
- **Google API Client Library**: For authentication and API communication
- **Google OAuth2**: User authentication and authorization

## Third-Party APIs
- **Bitly API**: URL shortening service integration through Firebase Functions
- **Firebase**: Full Firebase suite including Hosting, Functions, and project management

## Development Tools
- **Parcel**: Asset bundling and transformation
- **Firebase Tools**: CLI tools for deployment and local development
- **Gatsby Plugins**: Extensive plugin ecosystem including image optimization, manifest generation, and sitemap creation

## UI & Styling Libraries
- **Material-UI**: Complete React component library with theming
- **React Icons**: Icon library for UI elements
- **Syntax Highlighting**: React Syntax Highlighter for code display
- **Loading Indicators**: React Loader Spinner for UI feedback

## Utility Libraries
- **Base64 Encoding**: js-base64 for data encoding/decoding
- **Clipboard Operations**: copy-to-clipboard for user interactions
- **JSON Schema**: json-schema-library for data validation
- **Memoization**: memoizee for performance optimization