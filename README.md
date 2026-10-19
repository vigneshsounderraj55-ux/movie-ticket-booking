# 🎬 CineBook — Movie Ticket Booking App (MERN Stack)

A full-stack movie ticket booking application built with **MongoDB, Express.js, React.js, and Node.js**. Designed to be beginner-friendly and suitable for college project submission.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)

---

## ✨ Features

### 👤 User Side
- User registration & login (JWT Authentication)
- Browse movies with genre filter & search
- View detailed movie information
- View available shows (theaters & timings)
- Interactive seat selection grid (A1–E10)
- Book movie tickets
- View personal booking history

### 🛠️ Admin Side
- Add / Edit / Delete movies
- Add / Delete show timings
- View all bookings with revenue stats

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS, React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens) |
| **HTTP Client** | Axios |

---

## 📁 Folder Structure

```
movie-booking/
│
├── server/                  # Backend (Node + Express)
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Show.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── showRoutes.js
│   │   └── bookingRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── showController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── seed.js              # Demo data seeder
│   ├── index.js             # Server entry point
│   ├── .env.example
│   └── package.json
│
└── client/                  # Frontend (React)
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── MovieCard.js
        │   ├── ProtectedRoute.js
        │   └── Toast.js
        ├── pages/
        │   ├── HomePage.js
        │   ├── AuthPage.js
        │   ├── MovieDetailsPage.js
        │   ├── SeatBookingPage.js
        │   ├── MyBookingsPage.js
        │   └── AdminDashboard.js
        ├── context/
        │   └── AuthContext.js
        ├── utils/
        │   └── api.js
        ├── App.js
        ├── index.js
        └── index.css
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally (or MongoDB Atlas URL)

---

### Step 1: Clone & Setup Server

```bash
cd movie-booking/server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**.env file:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/moviebooking
JWT_SECRET=your_super_secret_key_here
```

---

### Step 2: Seed Demo Data (Optional but Recommended)

```bash
# From server/ folder
node seed.js
```

This will:
- Add 6 sample movies to the database
- Create an admin account: `admin@cinebook.com` / `admin123`

---

### Step 3: Start the Backend

```bash
# From server/ folder
npm run dev       # Development (with nodemon)
# or
npm start         # Production
```

Server runs at: `http://localhost:5000`

---

### Step 4: Setup & Start Frontend

```bash
cd movie-booking/client

# Install dependencies
npm install

# Start development server
npm start
```

App opens at: `http://localhost:3000`

---

## 🔐 Authentication

JWT tokens are stored in `localStorage`.  
All protected API routes require: `Authorization: Bearer <token>`

### Making a User Admin
After registering, open MongoDB Compass or shell and run:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { isAdmin: true } })
```

Or use the seeded admin account: `admin@cinebook.com` / `admin123`

---

## 📡 API Reference

### Auth
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login & get token | Public |
| GET | `/api/auth/profile` | Get current user | Protected |

### Movies
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/movies` | Get all movies | Public |
| GET | `/api/movies/:id` | Get single movie | Public |
| POST | `/api/movies` | Add new movie | Admin |
| PUT | `/api/movies/:id` | Update movie | Admin |
| DELETE | `/api/movies/:id` | Delete movie | Admin |

### Shows
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/shows/movie/:movieId` | Get shows by movie | Public |
| GET | `/api/shows/:id` | Get single show | Public |
| POST | `/api/shows` | Add new show | Admin |
| DELETE | `/api/shows/:id` | Delete show | Admin |

### Bookings
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/bookings` | Book tickets | Protected |
| GET | `/api/bookings/my` | My bookings | Protected |
| GET | `/api/bookings` | All bookings | Admin |

---

## 🗄️ Database Schema

### Users
```json
{ "name": "string", "email": "string", "password": "hashed", "isAdmin": false }
```

### Movies
```json
{ "title": "string", "image": "url", "genre": "string", "language": "string", "duration": 120, "description": "string", "rating": 8.5 }
```

### Shows
```json
{ "movie": "ObjectId", "theater": "string", "showTime": "10:00", "showDate": "2024-01-01", "totalSeats": 50, "bookedSeats": ["A1","B3"], "ticketPrice": 250 }
```

### Bookings
```json
{ "user": "ObjectId", "movie": "ObjectId", "show": "ObjectId", "seats": ["A1","A2"], "totalAmount": 500, "status": "confirmed" }
```

---

## 📄 License

MIT — Free to use for college projects and learning purposes.

---

**Built with ❤️ using the MERN Stack**
