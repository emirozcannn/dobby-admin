# Dobby Cafe Docker Commands

.PHONY: help build up down logs clean dev prod migrate

# Default target
help: ## Show this help message
	@echo "Dobby Cafe Docker Commands:"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development
dev: ## Start development environment (database + redis only)
	docker compose -f docker-compose.dev.yml up -d

dev-down: ## Stop development environment
	docker compose -f docker-compose.dev.yml down

migrate: ## Run database migrations
	docker compose -f docker-compose.dev.yml up migrate

# Production
build: ## Build all Docker images
	docker compose build

up: ## Start all services in production mode
	docker compose up -d

down: ## Stop all services
	docker compose down

restart: ## Restart all services
	docker compose restart

# Logs and debugging
logs: ## Show logs from all services
	docker compose logs -f

logs-backend: ## Show backend logs
	docker compose logs -f backend

logs-frontend: ## Show frontend logs
	docker compose logs -f frontend

logs-db: ## Show database logs
	docker compose logs -f database

# Maintenance
clean: ## Remove all containers, images, and volumes
	docker compose down -v --remove-orphans
	docker system prune -af --volumes

clean-dev: ## Remove development containers and volumes
	docker compose -f docker-compose.dev.yml down -v --remove-orphans

status: ## Show status of all services
	docker compose ps

# Database
db-shell: ## Connect to PostgreSQL shell
	docker compose exec database psql -U postgres -d dobby_cafe

redis-shell: ## Connect to Redis shell
	docker compose exec redis redis-cli

# Backend debugging
backend-shell: ## Connect to backend container shell
	docker compose exec backend sh

# Health checks
health: ## Check health of all services
	@echo "Checking service health..."
	@docker compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"

# Quick start
quick-start: dev migrate ## Quick start development environment
	@echo "✅ Development environment started!"
	@echo "📦 Database and Redis are running"
	@echo "🚀 Run 'cd backend && npm start' for backend"
	@echo "🎨 Run 'cd frontend && npm run dev' for frontend"

full-start: build up ## Build and start full production environment
	@echo "✅ Full production environment started!"
	@echo "🌐 Frontend: http://localhost:80"
	@echo "🔌 Backend API: http://localhost:80/api"
	@echo "📊 Direct backend: http://localhost:3001"
