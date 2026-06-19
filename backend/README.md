# STAR Bus Management System — Backend API

A Spring Boot REST API for a bus ticketing and management
system, using Supabase for authentication and database.

---

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Security (OAuth2 Resource Server)
- Supabase (Authentication + Database)
- Maven

---

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven
- A Supabase project (free tier works)
- IntelliJ IDEA (recommended) or any Java IDE

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

### Step 2 — Configure the Application

Copy the example config file and fill in your real values:

```bash
cp src/main/resources/application.yml.example src/main/resources/application.yml
```

Open `application.yml` and replace the placeholder:

```yaml
server:
  port: 8081

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          jwk-set-uri: YOUR_SUPABASE_PROJECT_URL/auth/v1/keys

app:
  auth:
    mock: false
```

Replace `YOUR_SUPABASE_PROJECT_URL` with your actual Supabase
project URL found at:
Supabase Dashboard → Project Settings → API → Project URL

---

### Step 3 — Configure `SupabaseAuthService.java`

Open this file:
src/main/java/com/STAR/busmanagement/auth/service/SupabaseAuthService.java

Replace the two placeholder values at the top:

```java
private final String SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
private final String API_KEY = "YOUR_SUPABASE_ANON_KEY";
```

Your anon key is found at:
Supabase Dashboard → Project Settings → API → anon public

---

### Step 4 — Run the Application

In IntelliJ:
1. Open `BusmanagementApplication.java`
2. Click the green play button ▶
3. Wait for: `Tomcat started on port 8081`

In terminal:
```bash
./mvnw spring-boot:run
```

---

### Step 5 — Set Up Test Users in Supabase

Rather than using the Register endpoint repeatedly, create
test users directly in Supabase to avoid rate limits:

1. Go to Supabase Dashboard → Authentication → Users
2. Click Add User → Create New User
3. Create these three test accounts:

| Email | Password | Role |
|---|---|---|
| starbus.passenger@gmail.com | Test@1234 | passenger |
| starbus.owner@gmail.com | Test@1234 | owner |
| starbus.driver@gmail.com | Test@1234 | driver |

4. Go to Authentication → Providers → Email
5. Turn off **Confirm email** for development

---

## API Testing

See the [Postman README](postman/README.md) for full
instructions on importing and running the API tests.

---

## Stripe Wallet Top-up Backend

The backend supports Stripe Checkout for passenger wallet top-ups.
The frontend should not collect raw card numbers for this flow.
Instead, it should ask the backend to create a Stripe Checkout
Session, then redirect the passenger to the Stripe-hosted checkout
page returned by the backend.

### Required environment variables

```bash
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_SUCCESS_URL=http://localhost:5173/payment?stripe_status=success&session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=http://localhost:5173/payment?stripe_status=cancelled
```

`STRIPE_SUCCESS_URL` and `STRIPE_CANCEL_URL` are optional because
development defaults are already configured in `application.yml`.

### Endpoints

#### Create a wallet top-up Checkout Session

```http
POST /payments/topups/checkout-session
Authorization: Bearer <passenger jwt>
Content-Type: application/json

{
  "amount": 1200.00
}
```

Success response:

```json
{
  "paymentId": 1,
  "checkoutSessionId": "cs_test_...",
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
  "amount": 1200.00,
  "currency": "lkr",
  "status": "pending"
}
```

The frontend should redirect the passenger to `checkoutUrl`.

#### Stripe webhook

```http
POST /payments/stripe/webhook
Stripe-Signature: <stripe signature>
```

Stripe calls this endpoint after the hosted payment flow changes
state. On a verified paid Checkout Session, the backend calls the
Supabase `complete_stripe_topup` function, marks the top-up as
completed, and credits the wallet exactly once.

#### Check a top-up session

```http
GET /payments/topups/sessions/{checkoutSessionId}
Authorization: Bearer <passenger jwt>
```

Returns the stored payment status and latest wallet balance for the
logged-in passenger.

### Database objects

The migration `supabase/migrations/20260618150000_add_stripe_topup_payments.sql`
adds:

- `stripe_topup_payments`: stores pending, completed, failed, and
  expired Stripe wallet top-ups.
- `complete_stripe_topup(...)`: an atomic Supabase function that
  prevents duplicate wallet credits when Stripe retries webhooks.

### Frontend integration notes

- Keep the amount field and min/max validation: LKR 100 to LKR 50,000.
- Do not submit card number, expiry, or CVC to this backend.
- Call `POST /payments/topups/checkout-session` with the passenger JWT.
- Redirect the browser to the returned `checkoutUrl`.
- After redirect back to the app, read `session_id` from the URL and
  call `GET /payments/topups/sessions/{sessionId}` to show pending or
  completed status.
- The wallet balance should be fetched from the backend after payment,
  not updated locally before webhook confirmation.

---

## Mock Mode

The app supports a mock mode for testing without Supabase.
To enable it, set the following in `application.yml`:

```yaml
app:
  auth:
    mock: true
```

In mock mode all auth endpoints return dummy data and no
real database connection is required.

---
