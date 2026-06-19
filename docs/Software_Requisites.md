# Software Requisites and Dependencies

## STAR Smart Bus Ticketing and Reservation System (SBTRS)


## 1. Overview

This document outlines the software prerequisites, frameworks, libraries, and external services required to successfully build, run, and develop the STAR Smart Bus Ticketing and Reservation System (SBTRS). It covers both the Spring Boot backend and the React frontend.


## 2. System-Level Prerequisites

To develop and run the application locally, the following core software must be installed on the host machine:

### 2.1 Backend Environment

- **Java Development Kit (JDK):** Version 17

  - *Purpose:* Required to compile and run the Spring Boot application.

- **Maven:** Version 3.8+ (A Maven Wrapper `mvnw` is included in the project)

  - *Purpose:* Dependency management and build tool for the Java backend.

### 2.2 Frontend Environment

- **Node.js:** Version 18.0 or higher

  - *Purpose:* JavaScript runtime required to run the Vite development server and manage npm packages.

- **npm (Node Package Manager):** (Usually bundled with Node.js)

  - *Purpose:* Managing frontend dependencies.


## 3. External Services and Platforms

The SBTRS architecture relies heavily on external Cloud Services. You must have accounts and active configurations for the following:

### 3.1 Supabase

Supabase acts as the primary Database and Authentication provider.

- **PostgreSQL Database:** Hosts all system data (Routes, Buses, Bookings, Wallets).

- **Supabase Auth:** Manages user registration, secure login, password resets, and issues JWTs (JSON Web Tokens).

- **Row Level Security (RLS):** Database policies are actively used to restrict data access.

### 3.2 Stripe (Payment Gateway)

- *Purpose:* Used for processing digital wallet top-up transactions securely on the frontend.

- *Requirement:* Stripe public and secret API keys configured in the respective environments.

### 3.3 External APIs

- **QR Server API (`api.qrserver.com`):** Used by the frontend to dynamically generate QR codes for digital tickets.


## 4. Backend Dependencies (Spring Boot)

The backend is a Java Maven project located in `/backend/busmanagement`.

- **Spring Boot Version:** `4.0.5`

**Key Dependencies from `pom.xml`:**

- **`spring-boot-starter-webmvc`**: Provides core REST API capabilities and Tomcat embedded server.

- **`spring-boot-starter-security`**: Core Spring Security framework.

- **`spring-boot-starter-security-oauth2-resource-server`**: Validates JWTs issued by Supabase Auth.

- **`spring-boot-starter-data-jpa`**: Java Persistence API (Hibernate) for Object-Relational Mapping (ORM) used by specific modules (Booking, Route, Trip, User).

- **`postgresql`**: PostgreSQL JDBC Driver for connecting to the Supabase database.

- **`lombok`**: Library to reduce boilerplate code (Getters, Setters, Builders) via annotations.

- **`spring-dotenv`**: Version 4.0.0. Enables reading configuration from `.env` files.


## 5. Frontend Dependencies (React)

The frontend is a Node/npm project located in `/frontend`.

- **Build Tool:** Vite Version 8.x

- **UI Library:** React Version 19.x

**Key Dependencies from `package.json`:**

- **`react` / `react-dom` (^19.2.4):** Core libraries for building user interfaces.

- **`react-router-dom` (^7.13.2):** Handles client-side routing and navigation between pages.

- **`@supabase/supabase-js` (^2.100.1):** Official Supabase client for direct database interactions and authentication state management.

- **`tailwindcss` (^4.2.2) & `@tailwindcss/vite`:** Utility-first CSS framework for styling the application.

- **`lucide-react` (^1.18.0):** Provides the SVG icon set used throughout the UI.

- **`dompurify` (^3.4.3):** Library used to sanitize HTML and prevent Cross-Site Scripting (XSS) attacks.


## 6. Environment Configuration Requirements

To run the system, specific environment variables must be configured in both the frontend and backend.

### 6.1 Backend Configuration (`backend/busmanagement/src/main/resources/application.yml`)

- `server.port`: Typically `8081`.

- `spring.datasource.url`: JDBC URL pointing to the Supabase PostgreSQL instance.

- `spring.security.oauth2.resourceserver.jwt.jwk-set-uri`: The Supabase JWKS endpoint used to verify tokens (e.g., `https://\[PROJECT\_ID\].supabase.co/auth/v1/keys`).

- `supabase.url`: The base URL of the Supabase project.

- `supabase.key`: The Supabase Service Role Key (or Anon Key depending on the endpoint requirements).

- `app.auth.mock`: Boolean (`true`/`false`) to toggle mock authentication mode for local testing without Supabase.

### 6.2 Frontend Configuration (`frontend/.env`)

- `VITE\_SUPABASE\_URL`: The base URL of your Supabase project.

- `VITE\_SUPABASE\_PUBLISHABLE\_KEY`: The Supabase Anon/Public Key (safe to expose to the client).

- `VITE\_API\_BASE`: The URL of the Spring Boot backend API (e.g., `http://localhost:8081`).

