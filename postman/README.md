# STAR Bus Management — Postman API Tests

This folder contains the Postman collection for testing all
API endpoints of the STAR Bus Management System.

---

## Requirements

- Postman installed (postman.com/downloads)
- Spring Boot app running on localhost:8081
- A configured Supabase project
- Test user accounts created in Supabase

---

## Importing the Collection

1. Open Postman
2. Click **Import** (top left)
3. Select the file: postman/Bus Management API.postman_collection.json 
4. The collection appears in your left sidebar

---

## Collection Variables

After importing, set these variables in the collection:

1. Click **Bus Management API** in the sidebar
2. Go to the **Variables** tab
3. Set the following:

| Variable | Value |
|---|---|
| baseUrl | http://localhost:8081 |
| authToken | (leave blank) |
| userId | (leave blank) |

`authToken` and `userId` are filled in automatically
when you run the Login request.

---

## Running the Auth Tests

Always run requests in this order:

### 1 — Login
Authenticates with Supabase and automatically saves the
token and userId to collection variables.

- Method: `POST`
- URL: `{{baseUrl}}/auth/login`
- Body:
```json
{
    "username": "starbus.passenger@gmail.com",
    "password": "Test@1234"
}
```
- Expected response: `200 OK`
```json
{
    "token": "eyJhbGci...",
    "role": "passenger",
    "userId": "some-uuid"
}
```

---

### 2 — Register
Creates a new passenger account. Only run this when adding
a new test user — do not run repeatedly as Supabase enforces
an email rate limit.

- Method: `POST`
- URL: `{{baseUrl}}/auth/register`
- Body:
```json
{
    "email": "newuser@gmail.com",
    "password": "Test@1234"
}
```
- Expected response: `200 OK`

⚠️ Known Issue: Returns a SERVER_ERROR in Postman when
email confirmation is enabled, even though the account is
created successfully. See GitHub Issues for details.
Workaround: Turn off email confirmation in Supabase dashboard
for development.

---

### 3 — Forgot Password
Sends a password reset email. No token required.

- Method: `POST`
- URL: `{{baseUrl}}/auth/forgot-password`
- Body:
```json
{
    "email": "starbus.passenger@gmail.com"
}
```
- Expected response: `200 OK` with empty body

---

### 4 — Google Login
Requires a real Google OAuth ID token. Cannot be tested
with a fake token.

- Method: `POST`
- URL: `{{baseUrl}}/auth/login-google`
- Body:
```json
{
    "idToken": "YOUR_REAL_GOOGLE_ID_TOKEN"
}
```

To get a real Google ID token, use Google OAuth Playground:
https://developers.google.com/oauthplayground

Note: Tokens expire after 1 hour so a fresh token is needed
each time you test this endpoint.

---

### 5 — Logout
Invalidates the current session. Automatically uses the
token saved from Login. Clears authToken and userId after
running.

- Method: `DELETE`
- URL: `{{baseUrl}}/auth/logout`
- Auth: Bearer token (inherited automatically from collection)
- Body: none
- Expected response: `200 OK` with empty body

---

## How Token Handling Works

Login runs

↓

Post-response script saves token → {{authToken}}

Post-response script saves userId → {{userId}}

↓

All subsequent requests automatically use {{authToken}} in Authorization header

↓

Logout runs

↓

Post-response script clears {{authToken}} and {{userId}}

---

## Known Issues

| Endpoint | Issue |
|---|---|
| POST /auth/register | Returns SERVER_ERROR when email confirmation is on — see GitHub Issues |
| POST /auth/login-google | Requires real Google ID token — cannot use fake token |
| DELETE /auth/logout | Returns 401 without SecurityConfig fix — see GitHub Issues |

---

## Test Accounts

| Email | Password | Role |
|---|---|---|
| starbus.passenger@gmail.com | Test@1234 | passenger |
| starbus.owner@gmail.com | Test@1234 | owner |
| starbus.driver@gmail.com | Test@1234 | driver |
