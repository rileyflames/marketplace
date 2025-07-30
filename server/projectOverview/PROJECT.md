

| File        | Purpose                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `app.js`    | Responsible for configuring the **Express app** — middleware, routes, error handling, etc.                          |
| `server.js` | Responsible for starting the **HTTP server** and handling process-level events like SIGINT or unhandled rejections. |


📊 Flow Diagram – app.js Setup

┌────────────────────────────┐
│  Incoming HTTP Request     │
└────────────┬───────────────┘
             │
             ▼
 ┌────────────────────────────┐
 │ Trust Proxy (for proxies)  │  <-- For Heroku/Netlify etc
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ Set Security Headers       │  <-- helmet
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ Rate Limiting              │  <-- express-rate-limit
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ Body Parsing               │  <-- express.json()
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ Sanitize Input             │  <-- mongo-sanitize, xss-clean
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ Compression                │  <-- compression
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ CORS (if needed)           │  <-- cors
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ Logger (dev only)          │  <-- morgan or Winston console
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ Mount Routes               │  <-- /api/v1/products etc.
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ 404 Not Found Middleware   │  <-- notFound.js
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ Global Error Handler       │  <-- globalErrorHandler.js
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │       Response Sent        │
 └────────────────────────────┘

🔐 Middleware Checklist (for production-ready APIs)









🔁 server.js Flow

┌────────────────────────────┐
│     Start Server           │
│  (app.listen(PORT))        │
└────────────┬───────────────┘
             │
             ▼
 ┌────────────────────────────┐
 │ Connect to MongoDB         │
 └────────────────────────────┘
             ▼
 ┌────────────────────────────┐
 │ Log Server Start           │
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
