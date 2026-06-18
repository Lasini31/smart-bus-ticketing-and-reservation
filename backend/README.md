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
