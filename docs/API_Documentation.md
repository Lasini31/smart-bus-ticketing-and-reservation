# API Documentation

## STAR Smart Bus Ticketing and Reservation System (SBTRS)


## 1. Overview

This document provides a comprehensive reference for the REST APIs exposed by the Spring Boot backend of the STAR Smart Bus Ticketing and Reservation System. The API handles authentication, driver operations, owner management, and backend-validated booking flows.

### 1.1 General Information

- **Base URL:** `http://localhost:8081`

- **Content-Type:** `application/json`

- **Server Framework:** Java 17, Spring Boot 4.0.5

- **Authentication:** Bearer Token (JWT via Supabase Auth)

- **CORS Policy:** Allowed exclusively from `http://localhost:5173`


## 2. Authentication Mechanism

The system utilizes stateless JWT-based authentication. Tokens are issued by the Supabase Auth service and validated server-side by the Spring Boot application using an OAuth2 Resource Server configuration.

### 2.1 Token Usage

- All protected endpoints require the JWT to be passed in the Authorization header.

- **Format:** `Authorization: Bearer \<token\>`

- Roles are extracted from the JWT's `app\_metadata.role` claim.

### 2.2 Security Configuration

- **Public Endpoints:** `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/login-google`

- **Protected Endpoints:** All other endpoints require authentication.

- **CSRF:** Disabled due to the stateless nature of JWTs.


## 3. Endpoints

### 3.1 Authentication Module

#### POST `/auth/login`

Authenticates a user with email and password.

- **Auth Required:** No

- **Request Body:**

- ```
\{  
  "username": "user@example.com",  
  "password": "securepassword123"  
\}
```

- **Success Response (200 OK):**

- ```
\{  
  "token": "eyJhbG...",  
  "role": "passenger",  
  "userId": "123e4567-e89b-12d3-a456-426614174000"  
\}
```

- **Error Response (401 Unauthorized):**

- ```
\{  
  "error": \{  
    "code": "INVALID\_CREDENTIALS",  
    "message": "Invalid login credentials"  
  \}  
\}
```

#### POST `/auth/register`

Registers a new user account.

- **Auth Required:** No

- **Request Body:**

- ```
\{  
  "email": "newuser@example.com",  
  "password": "StrongPassword!1",  
  "role": "passenger"  
\}
```

- **Success Response (200 OK):** Returns `AuthResponse` (same structure as login).

#### DELETE `/auth/logout`

Invalidates the current session.

- **Auth Required:** Yes

- **Headers:** `Authorization: Bearer \<token\>`

- **Success Response (200 OK):** Empty body.


### 3.2 Booking Module

#### POST `/bookings`

Creates a new booking record.

- **Auth Required:** Yes

- **Request Body:**

- ```
\{  
  "tripId": "UUID",  
  "passengerId": "UUID",  
  "fare": 1500.00,  
  "seatNo": 12,  
  "startLocation": "Colombo",  
  "endLocation": "Kandy",  
  "startAt": "2026-07-01T08:00:00Z"  
\}
```

- **Success Response (200 OK):** Returns the created `Booking` entity.

#### GET `/bookings/passenger/\{passengerId\}`

Retrieves all bookings for a specific passenger.

- **Auth Required:** Yes

- **Success Response (200 OK):** Array of `Booking` entities.


### 3.3 Route and Trip Modules

#### GET `/routes`

Retrieves all configured routes.

- **Auth Required:** Yes

- **Success Response (200 OK):** Array of `RouteResponse` objects.

#### POST `/trips`

Creates a new scheduled trip.

- **Auth Required:** Yes

- **Request Body:** `CreateTripRequest`

- **Success Response (200 OK):** Returns the created `Trip` entity.


### 3.4 Driver Module

#### GET `/driver/\{id\}/passengers`

Retrieves the passenger manifest for the driver's currently assigned trip.

- **Auth Required:** Yes (Role: Driver)

- **Success Response (200 OK):**

- ```
\[  
  \{  
    "passengerId": "UUID",  
    "name": "John Doe",  
    "seatSelection": "12",  
    "boardingStop": "Colombo"  
  \}  
\]
```

#### POST `/driver/\{id\}/shift/start`

Records the start time of a driver's shift.

- **Auth Required:** Yes (Role: Driver)

- **Success Response (200 OK):** `ShiftResponse` object.


### 3.5 Owner Module

#### POST `/owner/buses`

Adds a new bus to the owner's fleet.

- **Auth Required:** Yes (Role: Owner)

- **Request Body:** `AddBusRequest`

- **Success Response (201 Created):** `MessageResponse` indicating success.

#### GET `/owner/analytics`

Retrieves overview statistics for the owner dashboard.

- **Auth Required:** Yes (Role: Owner)

- **Success Response (200 OK):**

- ```
\{  
  "totalBuses": 5,  
  "totalDrivers": 8,  
  "totalPassengers": 1842,  
  "tripsToday": 94,  
  "revenueToday": 47500.00,  
  "generatedAt": "2026-06-19T10:00:00Z"  
\}
```

- *(Note: Some values in the current implementation are mocked placeholders).*


## 4. Frontend Direct Data Access (Supabase)

In addition to the Spring Boot REST API, the React frontend interacts directly with the Supabase PostgreSQL database via the Supabase JS client for several operations. These requests are secured using Supabase Row Level Security (RLS).

### Key Direct Interactions:

- **Wallet Management:** Fetching balances and logging transactions (`wallets`, `wallet\_transactions` tables).

- **General Browsing:** Fetching available routes and buses for search functionalities.

- **Refund Requests:** Submitting and viewing refund status (`refund\_requests` table).


## 5. Mock Mode Configuration

For development and frontend testing without a live Supabase connection, the backend can operate in Mock Mode.

- **Enable:** Set `app.auth.mock:true`  in `application.yml`.

- **Behavior:** Authentication endpoints return hardcoded successful responses. Security checks on other endpoints are bypassed.


## 6. Error Handling

The API uses a standardized error response format governed by a global exception handler.

```
\{  
  "error": \{  
    "code": "ERROR\_CODE\_STRING",  
    "message": "Human readable description."  
  \}  
\}
```

- `401 Unauthorized`: Returned for invalid credentials or missing JWT.

- `500 Internal Server Error`: Returned for unexpected backend failures.

