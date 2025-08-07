| File        | Purpose                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `app.js`    | Responsible for configuring the **Express app** — middleware, routes, error handling, etc.                          |
| `server.js` | Responsible for starting the **HTTP server** and handling process-level events like SIGINT or unhandled rejections. |

📊 Flow Diagram – app.js Setup

┌────────────────────────────┐
│ Incoming HTTP Request │
└────────────┬───────────────┘
│
▼
┌────────────────────────────┐
│ Trust Proxy (for proxies) │ <-- For Heroku/Netlify etc
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Set Security Headers │ <-- helmet
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Rate Limiting │ <-- express-rate-limit
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Body Parsing │ <-- express.json()
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Sanitize Input │ <-- mongo-sanitize, xss-clean
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Compression │ <-- compression
└────────────────────────────┘
▼
┌────────────────────────────┐
│ CORS (if needed) │ <-- cors
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Logger (dev only) │ <-- morgan or Winston console
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Mount Routes │ <-- /api/v1/products etc.
└────────────────────────────┘
▼
┌────────────────────────────┐
│ 404 Not Found Middleware │ <-- notFound.js
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Global Error Handler │ <-- globalErrorHandler.js
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Response Sent │
└────────────────────────────┘

🔐 Middleware Checklist (for production-ready APIs)

🔁 server.js Flow

┌────────────────────────────┐
│ Start Server │
│ (app.listen(PORT)) │
└────────────┬───────────────┘
│
▼
┌────────────────────────────┐
│ Connect to MongoDB │
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Log Server Start │
└────────────────────────────┘
▼
┌────────────────────────────┐
│ Listen for SIGINT, SIGTERM │
│ and handle unhandledRejections │
└────────────────────────────┘

| Middleware or Feature  | Why it's important                                                             |
| ---------------------- | ------------------------------------------------------------------------------ |
| `helmet`               | Adds security headers (CSP, HSTS, XSS protection, etc.)                        |
| `hpp`                  | Prevents malicious query strings with repeated keys                            |
| `cors`                 | Allows your API to be called securely from frontends on other domains          |
| `compression`          | Reduces response sizes for faster load times                                   |
| `express.json()`       | Parses JSON request bodies for easy access                                     |
| `express.urlencoded()` | Parses URL encoded form data (optional)                                        |
| `sanitizeMongo`        | Removes MongoDB operators from input to prevent NoSQL injection                |
| `morgan`               | Logs HTTP requests during development for debugging                            |
| `validateBody` (Zod)   | Enforces request data shape, preventing invalid data from entering your system |
| `notFound`             | Catches unmatched routes and sends a 404 response                              |
| `globalErrorHandler`   | Centralizes error responses, distinguishing client and server errors           |

flowchart TD
%% Starting point: server setup
A[server.js + app.js + db.js] --> B[Error Handling (notFound, globalErrorHandler, AppError)]

%% Core backend structure done
B --> C[Controllers]
C --> D[Routes]

%% Frontend Setup
D --> E[React Frontend Setup]
E --> F[Main Page + Styles (Tailwind + shadcn)]

%% Feature 1: User Signup Flow
F --> G[Display Signup Form (React)]
G --> H[Frontend sends Signup Data]
H --> I[Backend route creates User]
I --> J[User saved in DB]

%% Feature 2: Show Users Flow
J --> K[Frontend fetches user list]
K --> L[Backend fetches users from DB]
L --> M[Send users to Frontend]
M --> N[Display Users List in React]

%% Feature 3: Create Post Flow
N --> O[Display Create Post Form (React)]
O --> P[Frontend sends post data]
P --> Q[Backend route creates Post]
Q --> R[Post saved in DB]

%% Feature 4: Display Posts
R --> S[Frontend fetches posts]
S --> T[Backend fetches posts from DB]
T --> U[Send posts to Frontend]
U --> V[Display Posts List in React]

%% Feature 5: Comments & Ratings
V --> W[Display Comments + Ratings]
W --> X[Frontend sends comments/ratings]
X --> Y[Backend saves comments/ratings]

%% Feature 6: Messaging (Socket.IO)
Y --> Z[React Messaging UI]
Z --> AA[Connect to Socket.IO backend]
AA --> AB[Real-time messages stored & forwarded]

%% Moderation & Badges
AB --> AC[Admin Panel]
AC --> AD[Manage users, complaints, badges]

%% Trust and Legal Layers throughout
AD -.-> AE[Warning banners, disclaimers, warranty info]

# 1. 1. Users Collection

Stores all user accounts and related info.

| Field            | Type                                        | Description                                        |
| ---------------- | ------------------------------------------- | -------------------------------------------------- |
| `_id`            | ObjectId                                    | Unique user identifier                             |
| `username`       | String                                      | Unique display name                                |
| `email`          | String                                      | User email, unique                                 |
| `passwordHash`   | String                                      | Hashed password                                    |
| `location`       | { type: "Point", coordinates: \[lng, lat] } | GeoJSON location for geospatial queries            |
| `address`        | String                                      | Optional textual address or city                   |
| `role`           | String                                      | e.g., "buyer", "seller", "admin"                   |
| `badges`         | \[String]                                   | Badge identifiers (e.g., "verified", "pro-seller") |
| `ratingAverage`  | Number                                      | Average rating score                               |
| `complaintCount` | Number                                      | Number of complaints filed against this user       |
| `isBanned`       | Boolean                                     | Flag for banned users                              |
| `createdAt`      | Date                                        | Account creation timestamp                         |
| `updatedAt`      | Date                                        | Last profile update timestamp                      |

# 2. Listings Collection

Stores marketplace items posted by users.

| Field             | Type                                        | Description                                          |
| ----------------- | ------------------------------------------- | ---------------------------------------------------- |
| `_id`             | ObjectId                                    | Unique listing identifier                            |
| `title`           | String                                      | Listing title                                        |
| `description`     | String                                      | Detailed description                                 |
| `price`           | Number                                      | Price (currency stored separately if multi-currency) |
| `images`          | \[String]                                   | URLs or paths to images                              |
| `location`        | { type: "Point", coordinates: \[lng, lat] } | Item location (for meet-up)                          |
| `deliveryOptions` | { shipping: Boolean, meetup: Boolean }      | Buyer & seller delivery preferences                  |
| `warranty`        | String (enum)                               | Warranty option (e.g., None, 7 days, 30 days)        |
| `createdBy`       | ObjectId                                    | Reference to User who created the listing            |
| `createdAt`       | Date                                        | Timestamp when listing was created                   |
| `updatedAt`       | Date                                        | Timestamp of last update                             |
| `status`          | String                                      | e.g., "active", "sold", "removed"                    |

# 3. Comments Collection

Stores comments on listings or users.

| Field       | Type     | Description                                        |
| ----------- | -------- | -------------------------------------------------- |
| `_id`       | ObjectId | Unique comment ID                                  |
| `listingId` | ObjectId | Reference to Listing being commented on (optional) |
| `userId`    | ObjectId | User who made the comment                          |
| `content`   | String   | Comment text                                       |
| `createdAt` | Date     | Timestamp                                          |

# 4. Ratings Collection

Stores ratings users give to other users (mainly sellers).

| Field          | Type     | Description               |
| -------------- | -------- | ------------------------- |
| `_id`          | ObjectId | Unique rating ID          |
| `targetUserId` | ObjectId | User receiving the rating |
| `createdBy`    | ObjectId | User who gave the rating  |
| `rating`       | Number   | Rating score (e.g., 1-5)  |
| `comment`      | String   | Optional review text      |
| `createdAt`    | Date     | Timestamp                 |

# 5. Badges Collection

Defines available badges and which users hold them.

| Field         | Type        | Description                   |
| ------------- | ----------- | ----------------------------- |
| `_id`         | ObjectId    | Badge identifier              |
| `name`        | String      | Badge name (e.g., "Verified") |
| `description` | String      | Badge description             |
| `users`       | \[ObjectId] | Users who have this badge     |

# 6. Complaints Collection

Stores user complaints and flags for moderation.

| Field         | Type     | Description                           |
| ------------- | -------- | ------------------------------------- |
| `_id`         | ObjectId | Complaint identifier                  |
| `complainant` | ObjectId | User who filed the complaint          |
| `targetUser`  | ObjectId | User complaint is against             |
| `reason`      | String   | Complaint details                     |
| `status`      | String   | e.g., "open", "resolved", "dismissed" |
| `createdAt`   | Date     | Timestamp                             |

# 7. Messages Collection

Stores direct messages between users (can be stored as conversations or message arrays).

| Field          | Type                                | Description                        |
| -------------- | ----------------------------------- | ---------------------------------- |
| `_id`          | ObjectId                            | Conversation or message thread ID  |
| `participants` | \[ObjectId]                         | Users involved in the conversation |
| `messages`     | \[{ senderId, content, timestamp }] | Array of message objects           |
| `lastUpdated`  | Date                                | Timestamp of last message          |

# pnpm

| Item            | Before (`npm`)      | After (`pnpm`)          |
| --------------- | ------------------- | ----------------------- |
| Lockfile        | `package-lock.json` | `pnpm-lock.yaml`        |
| Package manager | `npm`               | `pnpm`                  |
| Node modules    | flat `node_modules` | symlinked, deduplicated |
| Install command | `npm install`       | `pnpm install`          |

# Marketplace Models & Validations Plan

## Overview

This document outlines:

- Core data models required for the marketplace
- Fields per model
- Relationships between models
- Zod validation schemas required
- Passport authentication strategy

---

## 1. User Model

### Purpose

Stores user profiles, badges, ratings summary, and activity tracking.

### Fields

- `username` (unique, required)
- `email` (unique, required)
- `passwordHash` (required)
- `avatar` (URL or file reference)
- `coverPhoto` (URL or file reference)
- `badges` (array: e.g., `['seller', 'reseller']`)
- `listingsCount` (integer — track free vs paid slots)
- `ratings` (array or summary: avg score, total count)
- `role` (`user`, `admin`)
- `location` (GeoJSON: coordinates + optional city/country)
- `warnings` (count or array of warning messages)
- `banned` (boolean)
- `createdAt` / `updatedAt`

### Relationships

- Has many **Listings**
- Has many **Ratings** (as ratee or rater)
- Has many **Messages**
- Can initiate or be involved in **Disputes**
- Can create **Reports**

### Zod Validations

- `registerSchema` (username, email, password)
- `loginSchema` (email, password)
- `updateProfileSchema` (avatar, coverPhoto, badges)
- `locationSchema` (lat/long)
- `roleUpdateSchema` (admin only)

---

## 2. Listing Model

### Purpose

Represents items users are selling.

### Fields

- `title` (string)
- `description` (string)
- `price` (number)
- `images` (array of URLs or file references)
- `seller` (User reference)
- `status` (`open`, `closed`, `sold`)
- `location` (GeoJSON)
- `createdAt` / `updatedAt`

### Relationships

- Has many **Comments**
- Can have **Disputes**
- Can receive **Ratings**

### Zod Validations

- `createListingSchema` (title, description, price, images)
- `updateListingSchema` (optional fields)
- `statusUpdateSchema` (close/sold)

---

## 3. Rating Model

### Purpose

Feedback between users after transactions.

### Fields

- `rater` (User reference)
- `ratee` (User reference)
- `listing` (Listing reference)
- `score` (1–5)
- `review` (string)
- `createdAt`

### Relationships

- Belongs to **User** (ratee and rater)
- Linked to **Listing**

### Zod Validations

- `createRatingSchema` (score, review)

---

## 4. Comment Model

### Purpose

Comments/discussions on listings.

### Fields

- `listing` (Listing reference)
- `author` (User reference)
- `content` (string)
- `createdAt`

### Relationships

- Belongs to **Listing**
- Belongs to **User** (author)

### Zod Validations

- `createCommentSchema` (content)

---

## 5. Message Model (DM)

### Purpose

Direct private messages between users.

### Fields

- `sender` (User reference)
- `receiver` (User reference)
- `content` (string)
- `read` (boolean)
- `createdAt`

### Relationships

- Belongs to **User** (sender and receiver)

### Zod Validations

- `sendMessageSchema` (receiver ID, content)

---

## 6. Dispute Model

### Purpose

Handle complaints or bad deals.

### Fields

- `listing` (Listing reference)
- `initiator` (User reference)
- `respondent` (User reference)
- `reason` (string)
- `status` (`open`, `resolved`, `closed`)
- `createdAt`

### Relationships

- Linked to **Listing**
- Linked to **Users** (initiator/respondent)

### Zod Validations

- `createDisputeSchema` (listing ID, reason)
- `updateDisputeSchema` (status changes by admin)

---

## 7. Report Model

### Purpose

Reports on listings or users.

### Fields

- `reporter` (User reference)
- `targetType` (`user`, `listing`)
- `targetId` (ID reference)
- `reason` (string)
- `status` (`open`, `reviewed`)
- `createdAt`

### Relationships

- Belongs to **User** or **Listing**

### Zod Validations

- `createReportSchema` (targetType, targetId, reason)

---

## 8. Relationships Summary

- **User → Listings**: One-to-Many
- **User → Ratings**: One-to-Many
- **Listing → Comments**: One-to-Many
- **Listing → Disputes**: One-to-Many
- **User ↔ Messages**: Many-to-Many
- **User ↔ Reports**: Many-to-Many

---

## 9. Passport Authentication Strategy

### Local Strategy

- **Purpose**: Authenticate using email + password
- **Flow**:
  1. User submits email/password
  2. Verify user exists and password matches
  3. On success, issue JWT

### JWT Strategy

- **Purpose**: Protect API routes
- **Flow**:
  1. Frontend sends JWT in `Authorization` header
  2. Passport verifies token and attaches user to request
  3. Role-based middleware can check `user.role`

### Refresh Token (Optional)

- Stored in secure cookie or DB
- Allows renewing short-lived access tokens without forcing login

---

## 10. Build Order for Models & Validations

1. **User Model** (foundation)
2. **Listing Model**
3. **Comment Model**
4. **Rating Model**
5. **Message Model**
6. **Dispute Model**
7. **Report Model**

---

## 11. Next Steps

- Implement each model in Mongoose
- For each model:
  - Create Zod schema for `create`, `update`, and special actions
  - Write validation middleware
  - Prepare relationships (refs) early to avoid later refactoring
- Once models are done → move to controllers/routes

# 🧱 Required Models Overview

| Model          | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| `User`         | Stores user info, badges, roles, ratings, etc.           |
| `Listing`      | Items listed by users (flagged as sale/help/wanted)      |
| `Rating`       | One-way rating from user to another                      |
| `Comment`      | Comments on listings                                     |
| `Message`      | DMs between users                                        |
| `Conversation` | Connects two users in a message thread                   |
| `Dispute`      | A case raised by a user against another, moderated       |
| `Category`     | Optional: Structured categories like phones/laptops/etc. |
| `Report`       | Reports on listings or users                             |

✅ Finalized Requirements Recap
🔵 User Model
Stores personal info, avatar, badges, listing stats, location, etc.

Tracks ratings and warnings

Automated email verification

🔵 Listing Model
Created by a user

Has a category (from tech-focused categories only)

Includes flags: sale, help, wanted

Has status: active, sold, locked, reported

Connects to comments, price offers, etc.

🔵 Comment Model
Nested like Reddit (parent, depth, childrenCount)

Text-only, no images

Belongs to a listing and a user

🔵 Rating Model
One-way rating with type: good | bad, optional comment, and numeric score

Buyer and seller can rate each other

🔵 Conversation & Message Model
Private messages

No image/media, text-only

Messages can be "deleted" per user only

Cannot be edited

🔵 Dispute Model
Triggered by a user against another user, related to a listing

Moderators get involved

Threaded case log

🔵 Category Model
Static set of tech-related categories

Admin-controlled (optional)

🔵 Report Model
For flagging users or listings

Includes reason, reporter, target
