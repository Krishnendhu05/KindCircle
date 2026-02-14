# 🌟 KindCircle — Community Help Platform

KindCircle is a college-based community web application where students can help each other with small tasks and earn reward coins.  
Instead of focusing on freelancing or skills, KindCircle promotes **kindness, collaboration, and community building**.

Users can post help requests, accept tasks, earn coins, and track their progress through a profile system.

---

# 🚀 Project Overview

KindCircle allows college students to:

- 📌 Post help requests
- 🤝 Accept and complete tasks
- 🪙 Earn reward coins
- 👤 View profile progress
- 💬 Interact through a community feed

The goal is to create a positive ecosystem where helping others is encouraged and rewarded.

---

# 🧰 Tech Stack

## Frontend
- HTML
- TailwindCSS
- JavaScript
- FontAwesome Icons

## Backend
- Node.js
- Express.js

## Database
- Supabase (PostgreSQL)

---

# 📂 Project Structure

```
KindCircle/
│
├── public/
│   ├── home.html
│   ├── profile.html
│   ├── login.html
│   ├── home.js
│   ├── profile.js
│   ├── script.js
│   ├── feed.js
│   └── style.css
│
├── server.js
|__ package.json
└── README.md
```

---

# ✨ Features

## 🔐 Login System
Users log in using college email and college unique passkey.  
Session is stored using localStorage.

## 🏠 Home Dashboard
Users can:
- View coin balance
- View total tasks completed
- Create Ask for help posts
- Accept tasks of others
- chatbox tool

## 📋 Task System
Each post has a status:
- `open`
- `taken`
With the help of database we will know who created as well as accepted the task.
Only another user can accept a task — creators cannot help their own posts.

## 🪙 Reward Coins
Coins increase when a user helps someone else.

Database table:
```
members
- email
- full_name
- passkey
- coins
- tasks_completed
```
```
tasks
- id
- title
- description
- created_by
- status
- accepted_by
- created_at
```

## 👤 Profile Page
Displays:
- Name
- Email
- Reward Coins
- Avatar initials

Profile data loads directly from Supabase.

## 🎨 UI Design
- Glass card design
- Gradient elements
- TailwindCSS responsive layout

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/kindcircle.git
cd kindcircle
```

Install dependencies:

```bash
npm install express
```

---

# ▶️ Running the Project

Start the server:

```bash
node server.js
```

Open browser:

```
http://localhost:3000
```

Login page opens first.

---

# 🧠 Architecture Overview

```
Browser (HTML + JS)
        ↓
Express Server
        ↓
Supabase Database
```

Flow:

```
Login → Home Feed → Help Task → Coins Update → Profile
```

---

# 🗄️ Database Tables

## members
```
email
full_name
passkey
coins
tasks_completed
```
## tasks
```
tasks
- id
- title
- description
- created_by
- status
- accepted_by
- created_at
```



---

# 📡 API Endpoints

### Get Posts
```
GET /posts
```

### Create Post
```
POST /posts
{
  title,
  description,
  creator_email
}
```

### Accept Help
```
POST /help/:id
{
  user_email
}
```

### Profile
```
GET /profile/:email
```

### Chat
```
POST /chat
GET /chat/:postId
```

---

# 👥 Team

- Krishnendhu S — Backend + Integration
- Anitta Joffy — Authentication + UI + Backend

---

# 🤖 AI Assistance

AI tools were used for:

- Debugging backend logic
- UI design improvements
- Database structure guidance

---

# 📜 License

MIT License

---

# ❤️ Purpose

KindCircle encourages small acts of kindness inside college communities by rewarding collaboration rather than competition.

PROJECT URL: https://kind-circle-tau.vercel.app/
YOUTUBE DEMO URL : https://youtu.be/yvVyWL-szKs?si=kMten77C421HIDiR
