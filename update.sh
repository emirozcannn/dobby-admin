#!/bin/bash
# Dobby Cafe - Update Script

echo "🔄 Pulling latest changes from GitHub..."
git pull origin master

echo "🐳 Building Docker containers..."
docker compose build

echo "🚀 Starting services..."
docker compose up -d

echo "📊 Checking service status..."
docker compose ps

echo "✅ Update complete!"
echo "🌐 Application: http://localhost"
echo "📡 Backend API: http://localhost/api"
