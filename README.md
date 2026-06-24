# Smart Bus Ticketing and Reservation System (SBTRS)

The **Smart Bus Ticketing and Reservation System (SBTRS)** is a web-based platform designed to digitize and manage passenger reservations for long-distance and pre-defined bus routes. By utilizing a **prepaid wallet ecosystem**, the system streamlines payments and ticketing for a more efficient transit experience.

---

## Project Overview

The SBTRS facilitates ticket bookings based on specific route sections and distances traveled. The platform is built with a focus on **island-wide scalability** and **24-hour reliability** (99.9% uptime) to ensure consistent service for all users.

### Key Features

* **Digital Prepaid Wallet**: A built-in ledger for managing top-ups, seamless online payments, and automated refund deductions.
* **Unique ID Booking**: Prevents duplicate bookings and ticket scalping by tying every trip to a specific customer ID.
* **Ticketing & Routing Engine**: Automatically calculates fares based on route sections and issues unique digital tickets.
* **Refund Management**: A robust, automated workflow for processing claims related to missed trips or incidents.
* **Role-Based Dashboards**: Customized web interfaces for Passengers, Drivers, Bus Owners, and Administrators.

---

## System Roles & Stakeholders

The system provides specialized portals for various end-users:

* **Passengers**: Load wallets, search routes, book tickets, and request refunds.
* **Bus Drivers**: View passenger manifests and verify booked tickets for assigned trips.
* **Bus Owners**: Monitor fleet financial earnings, ticket sales, and utilization rates via analytics.

---

## Development Roadmap

The project is divided into four modular phases over an 8-week timeline:

| Phase | Duration | Focus Areas |
| --- | --- | --- |
| **Phase 1** | Weeks 1–2 | Database schema, User Authentication, and ID verification. |
| **Phase 2** | Weeks 3–5 | Prepaid Wallet ecosystem and Route/Distance pricing logic. |
| **Phase 3** | Weeks 6–7 | Ticketing engine, Refund workflow, and role-based dashboards. |
| **Phase 4** | Week 8 | UAT, load testing, and final deployment. |

---

## Constraints & Scope

* **Web-Only**: The system is strictly a web application; native mobile apps are currently out of scope.
* **No Real-Time GPS**: Geographic tracking of buses is not included in this phase due to feasibility constraints.
* **Pre-defined Routes**: The system does not accommodate brief transits or atypical, undefined distances.

---

## Success Metrics

* **Scalability**: Successfully handle 500 concurrent wallet transactions.
* **Integrity**: 0% duplicate bookings through enforced ID-verification.
* **Reliability**: Maintain 99.9% system uptime.
