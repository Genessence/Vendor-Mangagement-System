# 🚀 Render Deployment Guide for Vendor Management System

## **Frontend Deployment to Render**

### **Step 1: Prepare Your Repository**
1. **Push your code to GitHub** (if not already done)
2. **Ensure all files are committed** including the `render.yaml`

### **Step 2: Deploy to Render**

#### **Option A: Using render.yaml (Recommended)**
1. **Go to [render.com](https://render.com)** and sign up/login
2. **Click "New +"** → **"Blueprint"**
3. **Connect your GitHub repository**
4. **Render will automatically detect** the `render.yaml` file
5. **Click "Apply"** to deploy

#### **Option B: Manual Setup**
1. **Go to [render.com](https://render.com)** and sign up/login
2. **Click "New +"** → **"Static Site"**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Name**: `vendor-management-frontend`
   - **Build Command**: `cd vendorhub && npm install && npm run build`
   - **Publish Directory**: `vendorhub/dist`
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: `https://vendor-management-backend.onrender.com/api/v1`
     - `VITE_USE_MOCK_DATA`: `false`

### **Step 3: Backend Deployment (Optional for Demo)**

If you want to deploy the backend to Render as well:

1. **Create a new Web Service** on Render
2. **Configure:**
   - **Name**: `vendor-management-backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `SECRET_KEY`: Your secret key
     - `CORS_ORIGINS`: Include your frontend Render URL

### **Step 4: Update Frontend API URL**

After backend deployment, update the frontend's API URL in Render dashboard:
- **Environment Variable**: `VITE_API_BASE_URL`
- **Value**: `https://your-backend-service-name.onrender.com/api/v1`

### **Step 5: Test Your Deployment**

1. **Visit your frontend URL**: `https://vendor-management-frontend.onrender.com`
2. **Test the login**: Use credentials from your database
3. **Test the vendor registration form**
4. **Check all features work correctly**

## **🔧 Troubleshooting**

### **Common Issues:**

1. **Build Fails**
   - Check if all dependencies are in `package.json`
   - Ensure `vite.config.js` exists and is configured correctly

2. **API Calls Fail**
   - Verify CORS is configured for your Render domain
   - Check if backend is deployed and accessible

3. **Environment Variables Not Working**
   - Ensure variables are set in Render dashboard
   - Check variable names match your code

### **Useful Commands:**

```bash
# Test build locally
cd vendorhub
npm run build

# Check if dist folder is created
ls dist/

# Test production build locally
npm run preview
```

## **📋 Demo Credentials**

For demo purposes, you can use these test credentials:
- **Email**: `admin@example.com`
- **Password**: `admin123`

## **🎯 Next Steps**

1. **Deploy frontend to Render**
2. **Test all functionality**
3. **Share the demo URL** with stakeholders
4. **Monitor performance** and user feedback

---

**Your Vendor Management System will be live at**: `https://vendor-management-frontend.onrender.com` 