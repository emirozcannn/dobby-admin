# Dobby Cafe - Full Stack Admin System

[![CI/CD Pipeline](https://github.com/emirozcannn/dobby-admin/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/emirozcannn/dobby-admin/actions/workflows/ci-cd.yml)
[![Backend Tests](https://img.shields.io/badge/Backend%20Tests-17%2F17%20Passing-brightgreen)](https://github.com/emirozcannn/dobby-admin)
[![Frontend Tests](https://img.shields.io/badge/Frontend%20Tests-9%2F9%20Passing-brightgreen)](https://github.com/emirozcannn/dobby-admin)
[![Code Style](https://img.shields.io/badge/Code%20Style-Prettier%20%2B%20ESLint-blue)](https://github.com/emirozcannn/dobby-admin)

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

## � Development Workflow

### For Contributors

#### First Time Setup
1. Install Docker Desktop
2. Clone the repository:
```bash
git clone https://github.com/emirozcannn/dobby-admin.git
cd dobby-admin
```
3. Start the application:
```bash
docker compose up -d
```

#### Daily Development
```bash
# Pull latest changes
git pull origin master

# Update and restart (use one of these methods):

# Method 1: Manual
docker compose build
docker compose up -d

# Method 2: Update scripts
./update.sh      # Linux/Mac
update.bat       # Windows
```

#### Making Changes

**Frontend Changes:**
```bash
# 1. Make changes in frontend/src/
# 2. Commit and push
git add .
git commit -m "feat: your changes"
git push origin master

# 3. Rebuild frontend
docker compose build frontend
docker compose up -d
```

**Backend Changes:**
```bash
# 1. Make changes in backend/
# 2. Commit and push
git add .
git commit -m "feat: your changes"
git push origin master

# 3. Rebuild backend
docker compose build backend
docker compose restart backend
```

**Database Changes:**
```bash
# 1. Create migration script in backend/migrations/
# 2. Commit and push
# 3. Run migration:
docker run --rm --network ooby_dobby_network \\
  -v "${PWD}/backend:/app" -w /app \\
  -e DB_HOST=database -e DB_PORT=5432 \\
  -e DB_NAME=dobby_cafe -e DB_USER=postgres -e DB_PASSWORD=postgres \\
  node:20-alpine node migrations/your-migration.js
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

## 🚀 CI/CD Pipeline

### Automated Testing & Deployment
- **GitHub Actions**: Automated CI/CD pipeline
- **Testing**: Backend (Jest) + Frontend (Vitest) tests on every push
- **Code Quality**: ESLint + Prettier checks
- **Security**: Trivy vulnerability scanning
- **Docker**: Automated image building and pushing
- **Coverage**: Codecov integration for test coverage tracking

### Pipeline Features
```yaml
✅ Automated testing (17 backend + 9 frontend tests)
✅ Code quality checks (ESLint + Prettier)
✅ Security vulnerability scanning
✅ Docker image building for production
✅ Test coverage reporting
✅ PR status checks
```

### Workflow Triggers
- **Push to master**: Full CI/CD pipeline + deployment
- **Pull Requests**: Tests + security scans only
- **Manual**: Can be triggered manually from Actions tab

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes (auto-formatting with Prettier)
4. **Pre-commit hooks** automatically run:
   - ESLint checks
   - Prettier formatting  
   - Test execution
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request (triggers CI/CD pipeline)

### Code Quality
- **Husky**: Pre-commit hooks ensure code quality
- **ESLint**: Consistent code style enforcement
- **Prettier**: Automatic code formatting
- **Jest/Vitest**: Comprehensive test coverage
- **TypeScript**: Type safety in frontend

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer:** Emir Özcan
- **Project:** Dobby Cafe Admin System
- **Version:** 1.0.0
