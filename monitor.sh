#!/bin/bash

# CI/CD Monitoring Dashboard
# Quick status check for Dobby Cafe production deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Load environment
if [ -f ".env.prod" ]; then
    export $(cat .env.prod | grep -v '#' | awk '/=/ {print $1}')
fi

clear
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  🚀 Dobby Cafe CI/CD Dashboard                ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# System Information
echo -e "${PURPLE}📊 System Information${NC}"
echo -e "Date/Time: $(date)"
echo -e "Hostname: $(hostname)"
echo -e "Uptime: $(uptime -p 2>/dev/null || uptime)"
echo ""

# Docker Status
echo -e "${PURPLE}🐳 Docker Status${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker: $(docker --version | cut -d' ' -f3 | cut -d',' -f1)${NC}"
    
    if command -v docker-compose &> /dev/null; then
        echo -e "${GREEN}✅ Docker Compose: $(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)${NC}"
    else
        echo -e "${RED}❌ Docker Compose: Not installed${NC}"
    fi
else
    echo -e "${RED}❌ Docker: Not installed${NC}"
fi
echo ""

# Service Status
echo -e "${PURPLE}🔧 Service Status${NC}"
if [ -f "docker-compose.prod.yml" ]; then
    services=$(docker-compose -f docker-compose.prod.yml ps --services 2>/dev/null || echo "")
    
    if [ ! -z "$services" ]; then
        for service in $services; do
            status=$(docker-compose -f docker-compose.prod.yml ps $service 2>/dev/null | tail -n +3 | awk '{print $3}')
            
            case $status in
                *"Up"*) 
                    echo -e "${GREEN}✅ $service: Running${NC}"
                    ;;
                *"Exit"*)
                    echo -e "${RED}❌ $service: Stopped${NC}"
                    ;;
                *)
                    echo -e "${YELLOW}⚠️  $service: Unknown${NC}"
                    ;;
            esac
        done
    else
        echo -e "${YELLOW}⚠️  No services found${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Production compose file not found${NC}"
fi
echo ""

# Application Health
echo -e "${PURPLE}🏥 Application Health${NC}"
if [ ! -z "$DOMAIN" ]; then
    # Check API health
    api_health=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api/health" 2>/dev/null || echo "000")
    
    if [ "$api_health" = "200" ]; then
        echo -e "${GREEN}✅ API Health: OK (200)${NC}"
    else
        echo -e "${RED}❌ API Health: Failed ($api_health)${NC}"
    fi
    
    # Check frontend
    frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" 2>/dev/null || echo "000")
    
    if [ "$frontend_status" = "200" ]; then
        echo -e "${GREEN}✅ Frontend: OK (200)${NC}"
    else
        echo -e "${RED}❌ Frontend: Failed ($frontend_status)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Domain not configured${NC}"
fi
echo ""

# Database Status
echo -e "${PURPLE}💾 Database Status${NC}"
if docker-compose -f docker-compose.prod.yml ps db 2>/dev/null | grep -q "Up"; then
    db_status=$(docker-compose -f docker-compose.prod.yml exec -T db pg_isready -U ${DB_USER:-postgres} 2>/dev/null | grep -o "accepting connections" || echo "not ready")
    
    if [ "$db_status" = "accepting connections" ]; then
        echo -e "${GREEN}✅ PostgreSQL: Ready${NC}"
        
        # Get database size
        db_size=$(docker-compose -f docker-compose.prod.yml exec -T db psql -U ${DB_USER:-postgres} -d ${DB_NAME:-dobby_cafe_prod} -t -c "SELECT pg_size_pretty(pg_database_size('${DB_NAME:-dobby_cafe_prod}'));" 2>/dev/null | xargs || echo "unknown")
        echo -e "   Database size: $db_size"
    else
        echo -e "${RED}❌ PostgreSQL: Not ready${NC}"
    fi
else
    echo -e "${RED}❌ PostgreSQL: Not running${NC}"
fi
echo ""

# Recent Logs (last 10 lines)
echo -e "${PURPLE}📋 Recent Logs (Backend)${NC}"
if docker-compose -f docker-compose.prod.yml ps backend 2>/dev/null | grep -q "Up"; then
    docker-compose -f docker-compose.prod.yml logs --tail=5 backend 2>/dev/null | sed 's/^/   /' || echo "   No logs available"
else
    echo -e "${YELLOW}   Backend service not running${NC}"
fi
echo ""

# GitHub Actions Status (if available)
echo -e "${PURPLE}🔄 CI/CD Pipeline${NC}"
if command -v gh &> /dev/null; then
    latest_run=$(gh run list --limit 1 --json status,conclusion,createdAt 2>/dev/null | jq -r '.[0] | "\(.status) \(.conclusion) \(.createdAt)"' 2>/dev/null || echo "unknown unknown unknown")
    
    status=$(echo $latest_run | cut -d' ' -f1)
    conclusion=$(echo $latest_run | cut -d' ' -f2)
    
    case $conclusion in
        "success")
            echo -e "${GREEN}✅ Latest Pipeline: Success${NC}"
            ;;
        "failure")
            echo -e "${RED}❌ Latest Pipeline: Failed${NC}"
            ;;
        "null")
            if [ "$status" = "in_progress" ]; then
                echo -e "${YELLOW}🔄 Latest Pipeline: Running${NC}"
            else
                echo -e "${YELLOW}⚠️  Latest Pipeline: $status${NC}"
            fi
            ;;
        *)
            echo -e "${YELLOW}⚠️  Latest Pipeline: $conclusion${NC}"
            ;;
    esac
else
    echo -e "${YELLOW}⚠️  GitHub CLI not installed${NC}"
fi
echo ""

# Quick Actions
echo -e "${PURPLE}⚡ Quick Actions${NC}"
echo -e "   ${BLUE}Logs:${NC}     docker-compose -f docker-compose.prod.yml logs -f"
echo -e "   ${BLUE}Status:${NC}   docker-compose -f docker-compose.prod.yml ps"
echo -e "   ${BLUE}Restart:${NC}  docker-compose -f docker-compose.prod.yml restart"
echo -e "   ${BLUE}Deploy:${NC}   ./deploy.sh production"
echo ""

echo -e "${BLUE}Dashboard refreshed at $(date)${NC}"
echo -e "${YELLOW}Press Ctrl+C to exit, or run: watch -n 30 ./monitor.sh${NC}"
