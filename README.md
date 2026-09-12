# EduQuery

A peer-to-peer doubt-solving platform for students. Post a question, get answers from other students, browse and help others with theirs.

Built as a MERN app — React (Vite) on the frontend, Node/Express/MongoDB on the backend.

## Features

- Email + OTP based signup, login, and password reset
- Post a doubt under a subject, with optional tags
- Browse and filter other students' doubts by subject
- Answer questions, edit or delete your own answers, upvote answers
- Personal dashboard with recent activity
- Editable student profile (class, semester, roll number)

## Tech stack

**Frontend:** React, React Router, Axios, react-icons, Vite
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT-based auth

## Project structure

```
EduQuery/
├── eduquery-backend/
│   ├── config/          # DB connection
│   ├── controllers/     # auth, question, subject, user logic
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Question, Subject, User schemas
│   ├── routes/          # auth, questions, subjects, users
│   ├── scripts/         # importSubjects.js — seeds subjects.json into the DB
│   └── server.js
└── eduquery-frontend/
    └── src/
        ├── api/          # axios instance
        ├── components/   # Sidebar, AuthLayout, ProtectedRoute
        ├── context/      # AuthContext (JWT-based session)
        └── pages/        # Landing, Auth, Dashboard, AskDoubt, YourDoubts, ExploreDoubts, QuestionDetails, Profile
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (local instance or MongoDB Atlas)

### Backend setup

```bash
cd eduquery-backend
npm install
```

Create a `.env` file in `eduquery-backend/` — check `config/db.js` and `controllers/authController.js` for the exact variable names your code expects, but it will look something like:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

Then seed subjects (one-time) and start the server:

```bash
node scripts/importSubjects.js
npm start
```

### Frontend setup

```bash
cd eduquery-frontend
npm install
npm run dev
```

Check `src/api/axios.js` and point `baseURL` at wherever your backend is running (e.g. `http://localhost:5000/api`).

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Sign up, triggers OTP email |
| POST | `/auth/verify-otp` | Verify OTP, returns JWT |
| POST | `/auth/login` | Log in, returns JWT |
| POST | `/auth/forgot-password` | Send password reset link |
| POST | `/auth/reset-password/:token` | Set new password |
| GET | `/users/:id` | Get profile |
| PUT | `/users/:id` | Update profile (class, semester, roll number) |
| GET | `/subjects` | List subjects |
| GET | `/questions` | List questions, optional `subjectId` filter |
| GET | `/questions/mine` | Questions posted by the logged-in user |
| GET | `/questions/:id` | Single question with answers |
| POST | `/questions` | Post a new doubt |
| PUT | `/questions/:id` | Edit a doubt |
| DELETE | `/questions/:id` | Delete a doubt |
| POST | `/questions/:id/answers` | Post an answer |
| PUT | `/questions/:id/answers/:answerId` | Edit your answer |
| DELETE | `/questions/:id/answers/:answerId` | Delete your answer |
| PUT | `/questions/:id/answers/:answerId/upvote` | Upvote/un-upvote an answer |

## Author

Deepanshu — [Deepanshu0109](https://github.com/Deepanshu0109)
