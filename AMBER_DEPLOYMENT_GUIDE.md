# 🚀 Amber Compliance System - Vendor Portal Deployment Guide

## 📋 **Overview**

This guide covers deploying the Vendor Management System as a subdomain under the existing Amber Compliance System domain: `ambercompliancesystem.com`

## 🌐 **Domain Architecture**

```
https://ambercompliancesystem.com/           → Landing page with service selection
https://msme.ambercompliancesystem.com/      → Existing MSME service (already deployed)
https://vendor.ambercompliancesystem.com/    → New Vendor Management System
```

## 🏗️ **Infrastructure Setup**

### **Option 1: Same VM as MSME Service (Recommended)**
- Use the existing VM where MSME service is running
- Deploy Vendor Portal on different ports to avoid conflicts
- Configure Nginx to route subdomains

### **Option 2: Separate VM**
- New VM for Vendor Portal
- Independent scaling and management
- More complex DNS configuration

## 🔧 **DNS Configuration**

Add these DNS records to your domain:

```
Type: A
Name: vendor
Value: [Your VM IP Address]
TTL: 300

Type: A  
Name: @
Value: [Your VM IP Address]
TTL: 300

Type: A
Name: www
Value: [Your VM IP Address]
TTL: 300
```

## 🚀 **Deployment Steps**

### **Step 1: Prepare Your Code**

1. **Update environment variables:**
   ```bash
   # backend/.env
   DATABASE_URL=postgresql://vendor_user:secure_password@localhost:5432/vendor_management_db
   SECRET_KEY=your-super-secure-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=["vendor.ambercompliancesystem.com"]
   CORS_ORIGINS=["https://ambercompliancesystem.com", "https://www.ambercompliancesystem.com", "https://vendor.ambercompliancesystem.com"]
   ```

2. **Build frontend for production:**
   ```bash
   cd vendorhub
   npm run build:prod
   ```

### **Step 2: Deploy on Existing VM**

1. **SSH into your existing VM:**
   ```bash
   ssh username@your-vm-ip
   ```

2. **Create directory for vendor portal:**
   ```bash
   mkdir -p /opt/vendor-portal
   cd /opt/vendor-portal
   ```

3. **Upload your code:**
   ```bash
   # Upload via SCP or Git clone
   git clone https://github.com/yourusername/vendor-management-system.git .
   ```

4. **Set up environment:**
   ```bash
   cp backend/env.example backend/.env
   # Edit backend/.env with production values
   nano backend/.env
   ```

### **Step 3: Deploy with Docker**

1. **Build and deploy:**
   ```bash
   # Build frontend
   cd vendorhub
   npm install
   npm run build:prod
   cd ..
   
   # Build backend Docker image
   cd backend
   docker build -t vendor-management-backend:latest .
   cd ..
   
   # Deploy with Docker Compose
   docker-compose -f docker-compose.vendor.yml up -d
   ```

2. **Initialize database:**
   ```bash
   docker-compose -f docker-compose.vendor.yml exec backend python scripts/init_db.py
   ```

### **Step 4: Configure Nginx (Main Server)**

Update your main Nginx configuration to handle the landing page and subdomain routing:

```nginx
# /etc/nginx/sites-available/ambercompliancesystem.com

# Landing page
server {
    listen 80;
    server_name ambercompliancesystem.com www.ambercompliancesystem.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ambercompliancesystem.com www.ambercompliancesystem.com;
    
    # SSL configuration (existing)
    ssl_certificate /etc/letsencrypt/live/ambercompliancesystem.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ambercompliancesystem.com/privkey.pem;
    
    # Landing page
    location / {
        root /var/www/landing-page;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

# Vendor Portal subdomain
server {
    listen 80;
    server_name vendor.ambercompliancesystem.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vendor.ambercompliancesystem.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/vendor.ambercompliancesystem.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vendor.ambercompliancesystem.com/privkey.pem;
    
    # Proxy to vendor portal (running on port 8080)
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **Step 5: SSL Certificates**

1. **Get SSL certificate for vendor subdomain:**
   ```bash
   sudo certbot --nginx -d vendor.ambercompliancesystem.com
   ```

2. **Test SSL:**
   ```bash
   curl -I https://vendor.ambercompliancesystem.com
   ```

### **Step 6: Deploy Landing Page**

1. **Copy landing page to web server:**
   ```bash
   sudo cp -r landing-page /var/www/
   sudo chown -R www-data:www-data /var/www/landing-page
   ```

2. **Reload Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 🧪 **Testing**

### **Test URLs:**
- **Landing Page**: `https://ambercompliancesystem.com`
- **Vendor Portal**: `https://vendor.ambercompliancesystem.com`
- **API Health**: `https://vendor.ambercompliancesystem.com/health`
- **API Docs**: `https://vendor.ambercompliancesystem.com/docs`

### **Test Commands:**
```bash
# Test landing page
curl -I https://ambercompliancesystem.com

# Test vendor portal
curl -I https://vendor.ambercompliancesystem.com

# Test API
curl https://vendor.ambercompliancesystem.com/health

# Test CORS
curl -H "Origin: https://ambercompliancesystem.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://vendor.ambercompliancesystem.com/api/v1/auth/login
```

## 🔒 **Security Checklist**

- [ ] SSL certificates installed for all subdomains
- [ ] CORS properly configured for main domain
- [ ] Database password is secure
- [ ] SECRET_KEY is strong and unique
- [ ] DEBUG=False in production
- [ ] Firewall rules configured
- [ ] Regular backups scheduled

## 📊 **Monitoring**

### **Health Checks:**
```bash
# Create monitoring script
cat > /opt/monitor-vendor.sh << 'EOF'
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" https://vendor.ambercompliancesystem.com/health)
if [ $response -ne 200 ]; then
    echo "Vendor portal health check failed: $response"
    # Send alert email
    echo "Vendor portal is down!" | mail -s "Vendor Portal Alert" admin@ambercompliancesystem.com
fi
EOF

chmod +x /opt/monitor-vendor.sh

# Add to crontab
echo "*/5 * * * * /opt/monitor-vendor.sh" | crontab -
```

### **Log Monitoring:**
```bash
# Monitor vendor portal logs
docker-compose -f /opt/vendor-portal/docker-compose.vendor.yml logs -f backend

# Monitor Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 **Maintenance**

### **Updates:**
```bash
cd /opt/vendor-portal
git pull origin main
docker-compose -f docker-compose.vendor.yml down
docker-compose -f docker-compose.vendor.yml up -d --build
```

### **Backups:**
```bash
# Database backup
docker-compose -f /opt/vendor-portal/docker-compose.vendor.yml exec postgres \
    pg_dump -U vendor_user vendor_management_db > backup_$(date +%Y%m%d).sql

# File uploads backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /opt/vendor-portal/uploads/
```

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   - Check CORS_ORIGINS in backend config
   - Verify Nginx proxy headers

2. **SSL Issues:**
   - Check certificate paths
   - Verify domain DNS resolution

3. **Port Conflicts:**
   - Ensure vendor portal uses port 8080
   - Check if MSME service uses different ports

4. **Database Connection:**
   - Verify DATABASE_URL
   - Check PostgreSQL service status

### **Debug Commands:**
```bash
# Check service status
docker-compose -f /opt/vendor-portal/docker-compose.vendor.yml ps

# Check logs
docker-compose -f /opt/vendor-portal/docker-compose.vendor.yml logs backend

# Test database
docker-compose -f /opt/vendor-portal/docker-compose.vendor.yml exec backend \
    python -c "from app.database import engine; print(engine.execute('SELECT 1').fetchone())"

# Check Nginx config
sudo nginx -t
```

## 📞 **Support**

For deployment support:
- Email: support@ambercompliancesystem.com
- Documentation: https://vendor.ambercompliancesystem.com/docs
- Health Status: https://vendor.ambercompliancesystem.com/health

---

**Your Vendor Management System will be live at:**
**https://vendor.ambercompliancesystem.com** 🎉 