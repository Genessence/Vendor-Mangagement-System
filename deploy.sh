#!/bin/bash

# Production Deployment Script for VendorHub
set -e

echo "🚀 Starting VendorHub Production Deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with the following variables:"
    echo "POSTGRES_PASSWORD=your_secure_password"
    echo "SECRET_KEY=your_secret_key"
    echo "DOMAIN=your-domain.com"
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$POSTGRES_PASSWORD" ] || [ -z "$SECRET_KEY" ] || [ -z "$DOMAIN" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Please ensure POSTGRES_PASSWORD, SECRET_KEY, and DOMAIN are set in .env"
    exit 1
fi

echo "📦 Building frontend..."
cd vendorhub
npm run build:prod
cd ..

echo "🐳 Building Docker images..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "🔍 Checking service health..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    docker-compose logs backend
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Service URLs:"
echo "   Frontend: https://$DOMAIN"
echo "   Backend API: https://$DOMAIN/api/v1"
echo "   Health Check: https://$DOMAIN/health"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down" 