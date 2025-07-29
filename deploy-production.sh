#!/bin/bash

# 🚀 Production Deployment Script for Vendor Management System
# This script handles the complete deployment cycle with domain configuration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=${1:-"vendormanagement.com"}
FRONTEND_PORT=4173
BACKEND_PORT=8000

echo -e "${BLUE}🚀 Starting Production Deployment for ${DOMAIN}${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f "backend/.env" ]; then
        print_warning "backend/.env file not found. Creating from template..."
        cp backend/env.example backend/.env
        print_warning "Please edit backend/.env with your production values before continuing."
        exit 1
    fi
    
    print_status "Prerequisites check passed!"
}

# Build frontend for production
build_frontend() {
    print_status "Building frontend for production..."
    
    cd vendorhub
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Build for production
    print_status "Creating production build..."
    npm run build:prod
    
    # Copy build to nginx directory
    if [ -d "../nginx" ]; then
        print_status "Copying frontend build to nginx..."
        rm -rf ../nginx/html
        cp -r dist ../nginx/html
    fi
    
    cd ..
    print_status "Frontend build completed!"
}

# Build backend Docker image
build_backend() {
    print_status "Building backend Docker image..."
    
    cd backend
    
    # Build the Docker image
    docker build -t vendor-management-backend:latest .
    
    cd ..
    print_status "Backend Docker image built!"
}

# Deploy with Docker Compose
deploy_services() {
    print_status "Deploying services with Docker Compose..."
    
    # Stop existing services
    print_status "Stopping existing services..."
    docker-compose -f docker-compose.prod.yml down || true
    
    # Start services
    print_status "Starting services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    sleep 30
    
    # Check service status
    print_status "Checking service status..."
    docker-compose -f docker-compose.prod.yml ps
    
    print_status "Services deployed successfully!"
}

# Initialize database
initialize_database() {
    print_status "Initializing database..."
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Run database initialization
    docker-compose -f docker-compose.prod.yml exec -T backend python scripts/init_db.py || {
        print_warning "Database initialization failed. You may need to run it manually."
    }
    
    print_status "Database initialization completed!"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Test backend health
    print_status "Testing backend health..."
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        print_status "Backend health check passed!"
    else
        print_error "Backend health check failed!"
        return 1
    fi
    
    # Test frontend (if nginx is configured)
    if [ -d "nginx/html" ]; then
        print_status "Testing frontend..."
        if curl -f http://localhost:80 > /dev/null 2>&1; then
            print_status "Frontend is accessible!"
        else
            print_warning "Frontend test failed. Check nginx configuration."
        fi
    fi
    
    print_status "Deployment testing completed!"
}

# Setup SSL certificates (Let's Encrypt)
setup_ssl() {
    print_status "Setting up SSL certificates..."
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        print_warning "Certbot not found. Installing..."
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Check if domain is accessible
    print_status "Checking domain accessibility..."
    if ! curl -f "http://${DOMAIN}" > /dev/null 2>&1; then
        print_warning "Domain ${DOMAIN} is not accessible. Please ensure DNS is configured correctly."
        print_warning "SSL setup will be skipped. You can run this manually later."
        return 0
    fi
    
    # Get SSL certificate
    print_status "Obtaining SSL certificate for ${DOMAIN}..."
    sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} || {
        print_warning "SSL certificate setup failed. You can run this manually later."
    }
    
    print_status "SSL setup completed!"
}

# Display deployment information
show_deployment_info() {
    echo -e "${BLUE}"
    echo "🎉 Deployment Completed Successfully!"
    echo "======================================"
    echo "Domain: ${DOMAIN}"
    echo "Frontend: http://${DOMAIN}"
    echo "Backend API: http://${DOMAIN}/api/v1"
    echo "API Documentation: http://${DOMAIN}/docs"
    echo ""
    echo "Default Admin Credentials:"
    echo "Email: admin@company.com"
    echo "Password: admin123"
    echo ""
    echo "Next Steps:"
    echo "1. Update DNS records to point to this server"
    echo "2. Configure SSL certificates (if not done automatically)"
    echo "3. Change default admin password"
    echo "4. Set up monitoring and backups"
    echo "5. Configure email settings for notifications"
    echo -e "${NC}"
}

# Main deployment process
main() {
    echo -e "${BLUE}Starting deployment process...${NC}"
    
    # Check prerequisites
    check_prerequisites
    
    # Build frontend
    build_frontend
    
    # Build backend
    build_backend
    
    # Deploy services
    deploy_services
    
    # Initialize database
    initialize_database
    
    # Test deployment
    test_deployment
    
    # Setup SSL (optional)
    read -p "Do you want to set up SSL certificates now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_ssl
    fi
    
    # Show deployment information
    show_deployment_info
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "build")
        check_prerequisites
        build_frontend
        build_backend
        print_status "Build completed!"
        ;;
    "test")
        test_deployment
        ;;
    "ssl")
        setup_ssl
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command] [domain]"
        echo ""
        echo "Commands:"
        echo "  deploy    Full deployment (default)"
        echo "  build     Build frontend and backend only"
        echo "  test      Test deployment"
        echo "  ssl       Setup SSL certificates"
        echo "  help      Show this help"
        echo ""
        echo "Examples:"
        echo "  $0 deploy vendormanagement.com"
        echo "  $0 build"
        echo "  $0 ssl"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac 