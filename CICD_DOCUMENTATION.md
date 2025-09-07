# CI/CD Pipeline Documentation

## 🚀 Complete CI/CD Setup for Dobby Cafe

### Pipeline Overview
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Push to   │───▶│    Tests     │───▶│    Build    │───▶│   Deploy     │
│   master    │    │  & Quality   │    │   Images    │    │ Production   │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
```

### ✅ Pipeline Features

#### 🧪 **Automated Testing**
- **Backend Tests**: 17 Jest/Supertest tests with PostgreSQL
- **Frontend Tests**: 9 Vitest/React Testing Library tests
- **Code Quality**: ESLint + Prettier validation
- **Security Scanning**: Trivy vulnerability scanner
- **Coverage Reports**: Codecov integration

#### 🐳 **Docker Build & Push**
- Multi-stage Docker builds for optimized images
- Automatic tagging with git SHA and latest
- Docker Hub registry integration
- Build caching for faster builds

#### 🔄 **Deployment Automation**
- Production environment deployment
- Database migration execution
- Health check validation
- Rollback capabilities

#### 🛡️ **Security & Monitoring**
- Vulnerability scanning on every commit
- SARIF reports uploaded to GitHub Security
- SSL/TLS configuration
- Rate limiting and security headers

### 📋 Setup Instructions

#### 1. GitHub Repository Setup
```bash
# Repository is already configured with:
✅ .github/workflows/ci-cd.yml
✅ Docker configurations
✅ Environment templates
✅ Deployment scripts
```

#### 2. GitHub Secrets Configuration (Optional)
For Docker Hub publishing and automated deployment:

```
Settings → Secrets and Variables → Actions
```

**Required Secrets (Optional):**
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password/token
- `HOST`: Production server IP (for auto-deploy)
- `USERNAME`: Server SSH username
- `KEY`: SSH private key

#### 3. Production Server Setup
```bash
# Copy environment template
cp .env.prod.template .env.prod

# Configure production values
nano .env.prod

# Deploy to production
./deploy.sh production
```

### 🔧 Pipeline Jobs

#### **backend-test**
- PostgreSQL 15 test database
- Jest testing framework
- ESLint code quality checks
- Coverage report generation

#### **frontend-test**
- Vitest with jsdom environment
- React Testing Library
- Build verification
- Coverage reporting

#### **build-and-deploy**
- Multi-platform Docker builds
- Image pushing to registry
- Production deployment (optional)
- Health check validation

#### **security-scan**
- Trivy filesystem scanning
- Dependency vulnerability checks
- SARIF report generation
- GitHub Security integration

### 📊 Monitoring & Observability

#### **Application Health**
```bash
# Quick status check
./monitor.sh

# Detailed monitoring
docker-compose -f docker-compose.prod.yml logs -f
```

#### **Database Backups**
```bash
# Automatic backups before deployment
# Manual backup
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U $DB_USER $DB_NAME > backups/manual_$(date +%Y%m%d_%H%M%S).sql
```

#### **Performance Metrics**
- Response time monitoring via health checks
- Database size tracking
- Service uptime monitoring
- Error rate tracking

### 🚦 Pipeline Triggers

| Event | Jobs Run | Deploy |
|-------|----------|--------|
| Push to master | All (test + build + security) | ✅ Yes |
| Pull Request | Test + Security only | ❌ No |
| Manual Trigger | All (configurable) | ⚙️ Optional |

### 📈 Quality Gates

All checks must pass before deployment:
```
✅ Backend tests (17/17)
✅ Frontend tests (9/9)  
✅ Linting (0 errors)
✅ Security scan (no high vulnerabilities)
✅ Build success
✅ Health checks
```

### 🔄 Rollback Strategy

```bash
# View recent deployments
docker images | grep dobby

# Rollback to previous version
docker-compose -f docker-compose.prod.yml down
docker tag your-username/dobby-backend:previous-sha your-username/dobby-backend:latest
docker tag your-username/dobby-frontend:previous-sha your-username/dobby-frontend:latest
docker-compose -f docker-compose.prod.yml up -d
```

### 📝 Best Practices

#### **Development Workflow**
1. Create feature branch
2. Make changes with automatic formatting
3. Push triggers CI/CD pipeline
4. PR review with automated checks
5. Merge to master triggers deployment

#### **Production Deployment**
1. Automated backup creation
2. Zero-downtime deployment
3. Health check validation
4. Automatic rollback on failure
5. Monitoring and alerting

#### **Security**
1. Regular vulnerability scanning
2. Dependency updates via Dependabot
3. Secrets management via GitHub Secrets
4. SSL/TLS enforcement
5. Rate limiting and CORS protection

### 🎯 Next Steps

1. **API Documentation**: Swagger/OpenAPI integration
2. **Performance Testing**: Load testing with k6
3. **E2E Testing**: Cypress or Playwright
4. **Advanced Monitoring**: Prometheus + Grafana
5. **Blue-Green Deployment**: Zero-downtime strategy

---

**🚀 Your CI/CD pipeline is now production-ready!**

Monitor pipeline status: https://github.com/emirozcannn/dobby-admin/actions
