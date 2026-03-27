# Smart Bus Ticketing and Reservation System (SBTRS)

[cite_start]The **Smart Bus Ticketing and Reservation System (SBTRS)** is a web-based platform designed to digitize and manage passenger reservations for long-distance and pre-defined bus routes[cite: 7, 8]. [cite_start]By utilizing a **prepaid wallet ecosystem**, the system streamlines payments and ticketing for a more efficient transit experience[cite: 8].

---

## ## Project Overview

[cite_start]The SBTRS facilitates ticket bookings based on specific route sections and distances traveled[cite: 10, 27]. [cite_start]The platform is built with a focus on **island-wide scalability** and **24-hour reliability** (99.9% uptime) to ensure consistent service for all users[cite: 34, 35, 63].

### Key Features
* [cite_start]**Digital Prepaid Wallet**: A built-in ledger for managing top-ups, seamless online payments, and automated refund deductions[cite: 11, 28, 40].
* [cite_start]**Unique ID Booking**: Prevents duplicate bookings and ticket scalping by tying every trip to a specific customer ID[cite: 30, 58].
* [cite_start]**Ticketing & Routing Engine**: Automatically calculates fares based on route sections and issues unique digital tickets[cite: 27, 41].
* [cite_start]**Refund Management**: A robust, automated workflow for processing claims related to missed trips or incidents[cite: 33, 42].
* [cite_start]**Role-Based Dashboards**: Customized web interfaces for Passengers, Drivers, Bus Owners, and Administrators[cite: 31].

---

## ## System Roles & Stakeholders

[cite_start]The system provides specialized portals for various end-users[cite: 17]:
* [cite_start]**Passengers**: Load wallets, search routes, book tickets, and request refunds[cite: 18].
* [cite_start]**Bus Drivers**: View passenger manifests and verify booked tickets for assigned trips[cite: 19].
* [cite_start]**Bus Owners**: Monitor fleet financial earnings, ticket sales, and utilization rates via analytics[cite: 20].
* [cite_start]**Administrators**: Oversee system health, manage route pricing, and resolve escalated disputes[cite: 21].

---

## ## Development Roadmap

[cite_start]The project is divided into four modular phases over an 8-week timeline[cite: 45]:

| Phase | Duration | Focus Areas |
| :--- | :--- | :--- |
| **Phase 1** | Weeks 1-2 | [cite_start]Database schema, User Authentication, and ID verification[cite: 46]. |
| **Phase 2** | Weeks 3-5 | [cite_start]Prepaid Wallet ecosystem and Route/Distance pricing logic[cite: 47, 48]. |
| **Phase 3** | Weeks 6-7 | [cite_start]Ticketing engine, Refund workflow, and role-based dashboards[cite: 49]. |
| **Phase 4** | Week 8 | [cite_start]UAT, load testing, and final deployment[cite: 50]. |

---

## ## Constraints & Scope
* [cite_start]**Web-Only**: The system is strictly a web application; native mobile apps are currently out of scope[cite: 15, 62].
* [cite_start]**No Real-Time GPS**: Geographic tracking of buses is not included in this phase due to feasibility constraints[cite: 14, 62].
* [cite_start]**Pre-defined Routes**: The system does not accommodate brief transits or atypical, undefined distances[cite: 13].

---

## ## Success Metrics
* [cite_start]**Scalability**: Successfully handle 500 concurrent wallet transactions[cite: 57].
* [cite_start]**Integrity**: 0% duplicate bookings through enforced ID-verification[cite: 58].
* [cite_start]**Reliability**: Maintain 99.9% system uptime[cite: 35].
