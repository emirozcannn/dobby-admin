# Dobby Cafe - Full Stack Admin System

A self-service restaurant management platform for managing multiple cafe branches from a central admin panel.

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js 18.x
- **Framework:** Express.js 4.18+
- **Database:** PostgreSQL 15+
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Security:** Helmet, bcryptjs, CORS

### Frontend
- **Framework:** React 18.x
- **Build Tool:** Vite 4.x
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.x
- **HTTP Client:** Axios
- **UI Library:** Headless UI + React Icons

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 15+ installed and running
- Git installed

### 1. Clone the repository
```bash
git clone <repository-url>
cd ooby
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your database credentials
npm run migrate       # Create database tables
npm start            # Start backend server (http://localhost:3001)
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev          # Start frontend dev server (http://localhost:5173)
```

### 4. Database Configuration
Update `backend/.env` with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dobby_cafe
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### Menu Management
- `GET /api/menu` - Get menu items
- `GET /api/menu/categories` - Get categories

## 🧪 Test Credentials

**Admin User:**
- Email: `admin@dobby.com`
- Password: `postgres`

## 📦 Project Structure

```
ooby/
├── backend/                 # Node.js Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── migrations/         # Database migrations
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── .env               # Environment variables
│   ├── package.json
│   └── server.js          # Main server file
├── frontend/               # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── assets/        # Static assets
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
├── docs/                   # Documentation
├── .gitignore
└── README.md
```

## 🎯 Features

### Current Features
- ✅ JWT Authentication
- ✅ User Management (Company Admin, Branch Manager, Cashier roles)
- ✅ Menu Management
- ✅ Category Management
- ✅ PostgreSQL Database
- ✅ Input Validation
- ✅ Security Middleware

### Planned Features
- [ ] Branch Management
- [ ] Stock Management
- [ ] Order Management
- [ ] Real-time Updates (Socket.io)
- [ ] File Upload (Product Images)
- [ ] Reports & Analytics
- [ ] POS Integration
- [ ] Docker Containerization

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev        # Start with nodemon
npm run migrate    # Run database migrations
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📝 Environment Variables

### Backend (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dobby_cafe
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Security
BCRYPT_ROUNDS=12

# CORS
FRONTEND_URL=http://localhost:5173
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer:** Emir Özcan
- **Project:** Dobby Cafe Admin System
- **Version:** 1.0.0
