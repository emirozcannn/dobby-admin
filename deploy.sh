#!/bin/bash

# Production Deployment Script for Dobby Cafe
# Usage: ./deploy.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-production}
ENV_FILE=".env.prod"

echo -e "${BLUE}🚀 Dobby Cafe Deployment Script${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo ""

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Environment file $ENV_FILE not found!${NC}"
    echo -e "${YELLOW}💡 Please copy .env.prod.template to $ENV_FILE and configure it${NC}"
    exit 1
fi

# Load environment variables
export $(cat $ENV_FILE | grep -v '#' | awk '/=/ {print $1}')

echo -e "${YELLOW}📋 Pre-deployment checks...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

# Check required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET" "DOMAIN")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Required environment variable $var is not set${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ All pre-deployment checks passed${NC}"
echo ""

# Backup existing data (if exists)
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}💾 Creating backup...${NC}"
    
    if docker-compose -f docker-compose.prod.yml ps db | grep -q "Up"; then
        timestamp=$(date +%Y%m%d_%H%M%S)
        backup_file="backup_${timestamp}.sql"
        
        docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U $DB_USER $DB_NAME > "backups/${backup_file}"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Backup created: backups/${backup_file}${NC}"
        else
            echo -e "${RED}❌ Backup failed${NC}"
            exit 1
        fi
    fi
fi

# Pull latest images
echo -e "${YELLOW}📥 Pulling latest Docker images...${NC}"
docker-compose -f docker-compose.prod.yml pull

# Stop existing services
echo -e "${YELLOW}🛑 Stopping existing services...${NC}"
docker-compose -f docker-compose.prod.yml down

# Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
timeout 120s bash -c '
    while [ "$(docker-compose -f docker-compose.prod.yml ps | grep -c healthy)" -lt 2 ]; do
        echo -n "."
        sleep 5
    done
'

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ All services are healthy${NC}"
else
    echo -e "\n${RED}❌ Services failed to start properly${NC}"
    echo -e "${YELLOW}📋 Service status:${NC}"
    docker-compose -f docker-compose.prod.yml ps
    exit 1
fi

# Run database migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Display deployment summary
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo -e "${BLUE}🌐 Application URLs:${NC}"
echo -e "  Frontend: https://${DOMAIN}"
echo -e "  API:      https://${DOMAIN}/api"
echo -e "  Health:   https://${DOMAIN}/api/health"

echo ""
echo -e "${YELLOW}📝 Post-deployment tasks:${NC}"
echo -e "  • Monitor logs: docker-compose -f docker-compose.prod.yml logs -f"
echo -e "  • Check health: curl https://${DOMAIN}/api/health"
echo -e "  • View services: docker-compose -f docker-compose.prod.yml ps"

echo ""
echo -e "${GREEN}🚀 Dobby Cafe is now running in ${ENVIRONMENT} mode!${NC}"
