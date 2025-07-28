# VendorHub Production Deployment Guide

## 🚀 Overview

This guide provides step-by-step instructions for deploying the VendorHub system to production on Azure VM.

## 📋 Prerequisites

### Azure VM Requirements
- **VM Size**: Standard D2s v3 (2 vCPUs, 8 GB RAM, 16 GB SSD)
- **OS**: Ubuntu 20.04 LTS or later
- **Disk**: At least 50 GB for system and data
- **Network**: Public IP with ports 80, 443, 22 open

### Software Requirements
- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- SSL Certificate (Let's Encrypt recommended)

## 🔧 Server Setup

### 1. Connect to Azure VM
```bash
ssh azureuser@your-vm-ip
```

### 2. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
exit
# SSH back in
```

### 4. Clone Repository
```bash
git clone https://github.com/your-repo/vendor-management-system.git
cd vendor-management-system
```

## 🔐 Environment Configuration

### 1. Create Environment File
```bash
cp backend/env.example .env
```

### 2. Configure Environment Variables
Edit `.env` file:
```bash
nano .env
```

Required variables:
```env
# Database
POSTGRES_PASSWORD=your_very_secure_password_here
DATABASE_URL=postgresql://vendorhub_user:your_very_secure_password_here@postgres:5432/vendorhub

# Security
SECRET_KEY=your_very_long_random_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
CORS_ORIGINS=https://your-domain.com,http://localhost:3000

# Domain
DOMAIN=your-domain.com
```

### 3. Generate Secure Keys
```bash
# Generate SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate POSTGRES_PASSWORD
python3 -c "import secrets; print(secrets.token_urlsafe(16))"
```

## 🔒 SSL Certificate Setup

### Option 1: Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to nginx directory
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
sudo chown -R $USER:$USER nginx/ssl/
```

### Option 2: Self-Signed (Development Only)
```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"
```

## 🚀 Deployment

### 1. Make Deployment Script Executable
```bash
chmod +x deploy.sh
```

### 2. Run Deployment
```bash
./deploy.sh
```

### 3. Verify Deployment
```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs -f

# Test endpoints
curl -k https://localhost/health
curl -k https://localhost/api/v1/health
```

## 📊 Monitoring & Maintenance

### 1. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f nginx
```

### 2. Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U vendorhub_user vendorhub > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose exec -T postgres psql -U vendorhub_user vendorhub < backup_file.sql
```

### 3. Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 4. SSL Certificate Renewal
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
sudo chown -R $USER:$USER nginx/ssl/

# Restart nginx
docker-compose restart nginx
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Kill process if needed
sudo kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

#### 3. Frontend Not Loading
```bash
# Check nginx logs
docker-compose logs nginx

# Verify static files
docker-compose exec nginx ls -la /usr/share/nginx/html
```

#### 4. Backend API Errors
```bash
# Check backend logs
docker-compose logs backend

# Test API directly
curl -X GET http://localhost:8000/api/v1/health
```

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_created_at ON vendors(created_at);
CREATE INDEX idx_approvals_status ON vendor_approvals(status);
```

### 2. Nginx Optimization
- Gzip compression enabled
- Static file caching configured
- Rate limiting implemented

### 3. Application Optimization
- JWT token expiration: 30 minutes
- Database connection pooling
- File upload size limits

## 🔒 Security Checklist

- [ ] Strong passwords for all services
- [ ] SSL/TLS encryption enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Database backups scheduled
- [ ] Firewall rules configured
- [ ] Regular security updates
- [ ] Access logs monitored

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify configuration files
3. Test individual services
4. Check Azure VM resources
5. Contact system administrator

## 🔄 Backup Strategy

### Automated Backups
Create a cron job for daily backups:
```bash
# Edit crontab
crontab -e

# Add backup job (runs daily at 2 AM)
0 2 * * * cd /path/to/vendor-management-system && docker-compose exec -T postgres pg_dump -U vendorhub_user vendorhub > /backups/vendorhub_$(date +\%Y\%m\%d).sql
```

### Manual Backups
```bash
# Database backup
docker-compose exec -T postgres pg_dump -U vendorhub_user vendorhub > backup_$(date +%Y%m%d_%H%M%S).sql

# Configuration backup
tar -czf config_backup_$(date +%Y%m%d_%H%M%S).tar.gz .env nginx/ssl/
``` 