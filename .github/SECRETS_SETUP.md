# GitHub Secrets Configuration

Bu dosya GitHub repository'nizde secrets olarak eklenecek environment variable'ları listeler.

## GitHub Repository Settings > Secrets and Variables > Actions

### Required Secrets:

#### Docker Hub (Optional - Docker images için)
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
```

#### Production Deployment (Optional - otomatik deployment için)
```
HOST=your-server-ip
USERNAME=your-server-username
KEY=your-ssh-private-key
```

#### Database (Production için - şimdilik gerekli değil)
```
PROD_DB_HOST=your-production-db-host
PROD_DB_PASSWORD=your-production-db-password
```

## Local Development

Yerel development için `.env` dosyalarınız zaten mevcut:
- `backend/.env` - Development environment
- `backend/.env.test` - Test environment

## CI/CD Pipeline Features

✅ **Automatic Testing**
- Backend: Jest + Supertest
- Frontend: Vitest + React Testing Library
- PostgreSQL test database setup

✅ **Code Quality**
- ESLint linting for both backend/frontend
- Prettier formatting checks
- Pre-commit hooks validation

✅ **Build Verification**
- Frontend build validation
- Docker image building
- Multi-platform support

✅ **Security Scanning**
- Trivy vulnerability scanner
- Dependency security checks
- SARIF report upload to GitHub

✅ **Test Coverage**
- Codecov integration
- Coverage reports for backend/frontend
- PR coverage comments

## Workflow Triggers

- **Push to master/main**: Full CI/CD pipeline
- **Pull Requests**: Tests + security scans only
- **Manual dispatch**: Can be triggered manually

## Next Steps

1. Push this CI/CD configuration to GitHub
2. Configure secrets if you want Docker publishing
3. Monitor Actions tab for pipeline results
4. Add badges to README for build status

No additional setup required for basic CI/CD functionality!
