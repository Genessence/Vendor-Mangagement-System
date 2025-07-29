# 🚀 Production Deployment Guide

## 📋 **Deployment Overview**

This guide covers deploying your Vendor Management System to production with real domains.

## 🌐 **Domain Architecture Options**

### **Option 1: Single Domain (Recommended)**
```
https://vendormanagement.com/          → Frontend (React app)
https://vendormanagement.com/api/      → Backend (FastAPI)
```

**Pros:**
- Simpler CORS configuration
- Single SSL certificate
- Easier DNS management
- Better for SEO

### **Option 2: Separate Domains**
```
https://app.vendormanagement.com/      → Frontend (React app)
https://api.vendormanagement.com/      → Backend (FastAPI)
```

**Pros:**
- Clear separation of concerns
- Independent scaling
- Different caching strategies

## 🏗️ **Production Infrastructure**

### **Azure VM Specifications (Recommended)**
```
VM Size: Standard_B2s (2 vCPUs, 4 GB RAM)
Storage: 64 GB SSD
OS: Ubuntu 20.04 LTS
Network: Standard
```

### **Domain & DNS Setup**
1. **Purchase Domain** (e.g., `vendormanagement.com`)
2. **Configure DNS Records:**
   ```
   A Record: @ → Your Azure VM IP
   A Record: www → Your Azure VM IP
   A Record: api → Your Azure VM IP (if using separate domains)
   ```

## 🔧 **Environment Configuration**

### **1. Backend Environment (.env)**
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/vendor_management_db

# Security
SECRET_KEY=your-super-secure-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
DEBUG=False
ALLOWED_HOSTS=["vendormanagement.com", "www.vendormanagement.com", "api.vendormanagement.com"]
CORS_ORIGINS=["https://vendormanagement.com", "https://www.vendormanagement.com"]

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### **2. Frontend Environment (.env.production)**
```bash
# API Configuration
VITE_API_BASE_URL=https://vendormanagement.com/api/v1

# App Configuration
VITE_APP_NAME=Vendor Management System
VITE_APP_VERSION=1.0.0
```

## 🐳 **Docker Deployment**

### **1. Production Docker Compose**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: vendor_management_db
      POSTGRES_USER: vendor_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://vendor_user:secure_password@postgres:5432/vendor_management_db
      - SECRET_KEY=your-production-secret-key
      - DEBUG=False
      - CORS_ORIGINS=["https://vendormanagement.com", "https://www.vendormanagement.com"]
    depends_on:
      - postgres
    restart: unless-stopped
    volumes:
      - uploads:/app/uploads

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - frontend_build:/usr/share/nginx/html
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  uploads:
  frontend_build:
```

### **2. Nginx Configuration (nginx/nginx.conf)**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name vendormanagement.com www.vendormanagement.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name vendormanagement.com www.vendormanagement.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

        # Security Headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Frontend (React App)
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
            
            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # CORS headers
            add_header Access-Control-Allow-Origin $http_origin always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
            add_header Access-Control-Allow-Credentials true always;
        }

        # Health check
        location /health {
            proxy_pass http://backend/health;
        }
    }
}
```

## 🔄 **Deployment Process**

### **Step 1: Prepare Your Code**
```bash
# 1. Update domain configurations
# Edit backend/app/config.py - Update CORS_ORIGINS
# Edit vendorhub/src/config/api.js - Update production baseURL

# 2. Build frontend for production
cd vendorhub
npm run build:prod

# 3. Test locally with production build
npm run preview
```

### **Step 2: Set Up Azure VM**
```bash
# 1. Create Azure VM (Standard_B2s, Ubuntu 20.04)
# 2. Configure firewall rules (ports 22, 80, 443)
# 3. SSH into VM and update system
sudo apt update && sudo apt upgrade -y

# 4. Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **Step 3: Deploy Application**
```bash
# 1. Clone your repository
git clone https://github.com/yourusername/vendor-management-system.git
cd vendor-management-system

# 2. Set up environment variables
cp backend/env.example backend/.env
# Edit backend/.env with production values

# 3. Set up SSL certificates (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d vendormanagement.com -d www.vendormanagement.com

# 4. Deploy with Docker Compose
sudo docker-compose up -d

# 5. Initialize database
sudo docker-compose exec backend python scripts/init_db.py
```

### **Step 4: Verify Deployment**
```bash
# Check if services are running
sudo docker-compose ps

# Check logs
sudo docker-compose logs backend
sudo docker-compose logs nginx

# Test API endpoints
curl https://vendormanagement.com/health
curl https://vendormanagement.com/api/v1/auth/login
```

## 🔒 **Security Checklist**

- [ ] Strong SECRET_KEY (32+ characters, random)
- [ ] DEBUG=False in production
- [ ] HTTPS/SSL certificates installed
- [ ] Database password is secure
- [ ] CORS origins are specific to your domain
- [ ] Firewall rules configured
- [ ] Regular security updates enabled
- [ ] Database backups configured
- [ ] Log monitoring set up

## 📊 **Monitoring & Maintenance**

### **Health Checks**
```bash
# Automated health check script
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" https://vendormanagement.com/health)
if [ $response -ne 200 ]; then
    echo "Health check failed: $response"
    # Send alert email/SMS
fi
```

### **Backup Strategy**
```bash
# Database backup (daily)
docker-compose exec postgres pg_dump -U vendor_user vendor_management_db > backup_$(date +%Y%m%d).sql

# File uploads backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### **Log Rotation**
```bash
# Configure log rotation for Docker containers
sudo nano /etc/logrotate.d/docker
```

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **CORS Errors**: Check CORS_ORIGINS in backend config
2. **Database Connection**: Verify DATABASE_URL and PostgreSQL service
3. **SSL Issues**: Check certificate paths and permissions
4. **Port Conflicts**: Ensure ports 80, 443 are available

### **Debug Commands:**
```bash
# Check service status
sudo docker-compose ps

# View logs
sudo docker-compose logs -f backend

# Access container shell
sudo docker-compose exec backend bash

# Test database connection
sudo docker-compose exec backend python -c "from app.database import engine; print(engine.execute('SELECT 1').fetchone())"
```

## 📈 **Scaling Considerations**

### **Vertical Scaling (Bigger VM)**
- Upgrade to Standard_B4ms (4 vCPUs, 16 GB RAM)
- Add more storage as needed

### **Horizontal Scaling (Multiple VMs)**
- Use Azure Load Balancer
- Separate database to Azure Database for PostgreSQL
- Use Azure Container Registry for Docker images

## 💰 **Cost Optimization**

- **Development**: Use smaller VM (Standard_B1s)
- **Production**: Start with Standard_B2s, scale as needed
- **Database**: Consider Azure Database for PostgreSQL for managed service
- **Storage**: Use Azure Blob Storage for file uploads
- **CDN**: Azure CDN for static assets

---

**Next Steps:**
1. Purchase your domain
2. Set up Azure VM
3. Configure DNS records
4. Deploy using this guide
5. Set up monitoring and backups

Your system will be production-ready with proper domain configuration! 🚀 