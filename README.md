# QuirkyRoomie
Flatmate Conflict Management System

Overview
QuirkyRoomie is a MERN stack project designed to help flatmates manage complaints, track resolutions, and earn karma points for resolving issues. The system also features a monthly 'Best Flatmate' badge based on karma scores.

Features
Users can submit complaints
Complaints can be marked as resolved
Karma points awarded for resolving complaints
Monthly 'Best Flatmate' badge
User authentication & authorization

Tech Stack
Frontend: React (Vite)
Backend: Node.js, Express
Database: MongoDB
Authentication: JWT
CSS Framework: Custom CSS

Installation Guide
Prerequisites
Make sure you have the following installed:
Node.js (v16 or later)
MongoDB
Git
Postman (for API testing)

Backend Setup
cd quirkyroomie-backend
npm install

Configure Environment Variables
Create a .env file in the backend directory:
Backend Setup

cd quirkyroomie-backend
npm install

Configure Environment Variables

Create a .env file in the backend directory:
MONGO_URI=mongodb+srv://ayushiwaskale:<Pass>@quirkyroomie.84hdl.mongodb.net/
PORT=5000
JWT_SECRET=mySuperSecretKey123!@#456$%^

Start the Backend Server
npm start
The server will run on http://localhost:5000

Frontend Setup
cd quirkyroomie-frontend
npm install

Start the Frontend
npm run dev
The frontend will run on http://localhost:5173

API Documentation
Authentication Routes

Method          Endpoint                    Description
POST             /api/auth/register         Register a new user
POST             /api/auth/login            Login user

Complaint Routes
Method          Endpoint              Description
POS             /api/complaints       Submit a new complaint
GET             /api/complaints       Get all complaints
PATCH           /api/complaints/:id   Mark complaint as resolved

User Routes
Method         Endpoint                 Description
GET            /api/users/:id           Get user profile
GET            /api/users/leaderboard   Get leaderboard rankings
