# User Manual

## STAR Smart Bus Ticketing and Reservation System (SBTRS)


## 1. Introduction

Welcome to the STAR Smart Bus Ticketing and Reservation System (SBTRS). This web-based platform is designed to make bus travel across Sri Lanka seamless and cash-free. Using our integrated digital wallet, you can search for routes, reserve specific seats, and manage your trips entirely online.

This manual provides step-by-step instructions for all system users, including Passengers, Bus Owners, and Drivers.


## 2. Getting Started

### 2.1 System Requirements

- A modern web browser (e.g., Google Chrome, Mozilla Firefox, Safari, Microsoft Edge).

- An active internet connection.

- A valid email address for account registration.

### 2.2 Accessing the System

Open your web browser and navigate to the application URL.

### 2.3 Account Registration

1. On the homepage, click **Create Account** or **Log In** -\> **Register**.

2. Select your role: **I'm a passenger** or **I'm a bus owner**.

3. Fill in your details (Full Name, Phone Number, Email).

4. Create a strong password. The password meter will guide you (requires minimum 8 characters, an uppercase letter, a number, and a special symbol).

5. Accept the Terms and Conditions and click **Register**.

6. You will be automatically logged in and redirected to the appropriate dashboard.

### 2.4 Logging In

1. Navigate to the Login page (`/login`).

2. Enter your registered email address and password.

3. Click **Login** to access your dashboard.


## 3. Passenger Guide

### 3.1 Searching for a Bus

1. From the Homepage or Dashboard, locate the **Bus Search** section.

2. Select your **From** (Origin) and **To** (Destination) cities using the dropdowns.

3. Choose your **Travel Date**.

4. Select the number of travelers (1-10).

5. Click **Search Available Buses**.

6. A list of available buses matching your criteria will be displayed, showing departure times, available seats, and ticket prices.

### 3.2 Booking a Ticket and Selecting Seats

1. On the search results page, find your preferred bus and click **Buy Ticket** (or View Seats).

2. You will be presented with a visual seat map of the bus.

   - **Light Green:** Available seat.

   - **Blue/Green:** Selected seat.

   - **Red:** Booked/Unavailable seat.

3. Click on the available seats you wish to reserve.

4. Review the trip details and total price on the side panel.

5. Click **Proceed to Payment**.

6. The system will check your Digital Wallet balance. If sufficient, the fare is deducted, and your booking is confirmed. If not, you will be prompted to top-up your wallet.

### 3.3 Managing the Digital Wallet

Your digital wallet is used for all transactions within the platform.

**To Top-Up Your Wallet:**

1. Navigate to the **Wallet** section from the sidebar navigation.

2. On the right panel, select a quick top-up amount (e.g., Rs. 500, Rs. 1000) or enter a custom amount.

3. Click **Authorize Top-Up**.

4. You will be redirected to a secure payment gateway (Stripe) to enter your credit/debit card details.

5. Upon successful payment, your wallet balance will be updated automatically.

**Viewing Transactions:** The Wallet page displays a complete ledger of your activities, including top-ups, ticket payments (marked in red as debits), and refunds (marked in green as credits).

### 3.4 Managing Bookings and Cancellations

1. Navigate to **My Bookings** from the sidebar.

2. Here you can view all your Upcoming, Completed, and Cancelled trips.

3. To cancel an upcoming trip, click **Cancel Booking** on the specific ticket.

4. Provide a brief reason for cancellation and confirm.

5. The ticket fare will be automatically refunded to your digital wallet according to the platform's cancellation policy.

### 3.5 Downloading Your Ticket

1. After a successful booking, you will be directed to the Ticket Confirmation page.

2. This page displays your trip details and a unique **QR Code**.

3. Click **Download / Print Ticket** to save a copy. You must present this QR code to the bus conductor upon boarding.


## 4. Bus Owner Guide

### 4.1 Owner Dashboard Overview

As a registered bus owner, navigating to the **Owner Dashboard** provides an overview of your business:

- Total active buses.

- Total scheduled routes.

- Total bookings across your fleet.

- Daily Revenue analytics.

### 4.2 Adding a New Bus

1. Navigate to **Bus Setup** (`/owner/bus-setup`).

2. Fill in the bus details: Bus Name, Plate Number, assigned Route, and assigned Driver/Conductor contacts.

3. Use the **Seat Map Designer** to configure the seating layout (rows and columns). Click on seats to disable them (e.g., for aisles or driver space).

4. Click **Add Bus** to add it to your fleet.

5. Click **Save All & Finish** to update the system.


## 5. Driver Guide

### 5.1 Shift Management and Manifest

*(Note: Driver features require specific account setup by an Administrator or Bus Owner)*

1. Log in using your provided driver credentials.

2. Your dashboard will display your assigned bus and today's schedule.

3. You can log the start and end of your driving shifts using the provided buttons.

4. To view passengers, navigate to the **Passenger Manifest**. This lists all confirmed bookings for your current trip, including passenger names and assigned seat numbers.


## 6. General Information

### 6.1 Changing Language

The platform supports multiple languages. Click the **Globe icon** in the top navigation bar to cycle through English (EN), Sinhala (SI), and Tamil (TA).

### 6.2 Getting Help

For further assistance, navigate to the **Contact** page to send a message to our support team, or view the **About** page for general Terms and Conditions.

