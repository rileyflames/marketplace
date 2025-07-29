

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
