# Community Marketplace Platform

A **community-driven marketplace** inspired by Carbonite, combining **trusted peer-to-peer listings** with **social features** (comments, ratings, badges, and direct messaging). The platform prioritizes **trust, transparency, and safety**, while minimizing legal liability by **not handling payments directly**.

---

## Vision

Create a **marketplace + community hybrid** where buyers and sellers:

- Can **list items** for sale with **location-based search** (meet-ups or shipping).
- Build **trust** through ratings, badges, and complaint moderation.
- Use **direct messaging** for negotiation without platform-managed escrow.
- Are guided by **warranty options** and **community-driven trust signals** (e.g., new seller warnings, complaint thresholds).

The platform’s role is to **enforce order and transparency** rather than act as a payment intermediary.

---

## Key Features

### **Marketplace**

- Listings with:
  - Location (city/province + geospatial queries for nearby items)
  - Shipping or meet-up options
  - Warranty terms (None, 7 days, 30 days)
- Free listing quota: 2 free listings every 6 months; pay for extras
- Badges and privileges for sellers (e.g., Verified, Pro)

### **Community**

- Ratings & reviews on sellers
- Comments on listings
- Complaint system (auto-ban threshold, admin override)
- Trust score derived from ratings, complaints, and badge level
- Warning banners for new/low-rated sellers

### **Messaging**

- Direct messages between buyers and sellers
- Real-time chat via Socket.IO

### **Moderation**

- Admin panel for user and complaint management
- Auto-ban for repeated complaints
- Crowdsourced moderation via trusted users (future enhancement)

### **Legal & Safety**

- No escrow or platform-managed payments (users transact directly)
- Clear disclaimers and buyer-seller responsibility statements
- Emphasis on diligence: ratings, badges, and community trust

---

## Tech Stack

### **Backend**

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) (geospatial queries for location search)
- [Redis](https://redis.io/) (caching, rate limiting, sessions)

#### **Security & Validation**

- [Zod](https://zod.dev/) for schema validation
- [Helmet](https://helmetjs.github.io/) for HTTP headers security
- [Hpp](https://www.npmjs.com/package/hpp) for HTTP parameter pollution protection
- [Passport.js](https://www.passportjs.org/) for authentication strategies (JWT, OAuth if needed)
- [Cors](https://www.npmjs.com/package/cors) for cross-origin resource sharing
- [Winston](https://github.com/winstonjs/winston) for logging

---

### **Frontend**

- [React](https://react.dev/) (SPA)
- [Tailwind CSS](https://tailwindcss.com/) for rapid, utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) for reusable, accessible UI components
- [React Router](https://reactrouter.com/) for routing

---

### **Real-Time Features**

- [Socket.IO](https://socket.io/) for direct messaging and live updates

---

## Future Enhancements

- **Paid badges and premium features** (Stripe integration)
- **Advanced trust score algorithm**
- **Push/email notifications**
- **GraphQL API version** (after React mastery)

---

## Architecture Overview

### **Backend (Express + MongoDB)**

- Modular structure: `auth`, `listings`, `comments`, `ratings`, `badges`, `complaints`, `messaging`
- REST API endpoints with JWT authentication
- Geospatial queries for location-based listing search

### **Frontend (React)**

- Pages: Home, Listings, Profile, Dashboard, Messaging, Admin
- State management: Context API or Redux Toolkit
- API data fetching: React Query (caching + revalidation)

---

## Database Schema (High-Level)

### Users

- `username`, `email`, `passwordHash`
- `location` (geo point + text)
- `badges`, `complaintCount`, `ratingAverage`
- `role` (user, seller, admin)

### Listings

- `title`, `description`, `price`, `images`
- `location`, `deliveryOptions` (shipping, meet-up)
- `warranty` (enum)
- `createdBy` (user reference)

### Complaints

- `complainant`, `targetUser`, `reason`, `status`

### Ratings

- `rating`, `comment`, `targetUser`, `createdBy`

### Messages

- `participants` (array of users)
- `messages` (array of message objects)

---
