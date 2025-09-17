# CampusLink

CampusLink is a student-focused app that allows users to:

- Register and login
- Browse and search books in the store with images & prices
- Add, remove, and register courses
- Upload and download personal student documents

The app is **PWA-ready**, **SEO-optimized**, and designed to prevent students from being cheated by false information about books or courses.

## Features

### Landing Page

- Simple, clean, responsive
- SEO-friendly

### Authentication

- JWT-based login and registration
- Passwords hashed with bcrypt

### Dashboard

- Shows user info after login
- Placeholder for future course & book modules

### Courses

- Add, remove, and register courses
- Automatic update to database

### Books

- Search books via `/api/book/:query`
- Display images, authors, and prices

### Documents

- Upload and download student files
- Secure access per user

### PWA & SEO

- `manifest.json` included
- `sitemap.xml` included
- Open Graph metadata supported

## Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

###Docker
```bash
docker-compose up -d
```
