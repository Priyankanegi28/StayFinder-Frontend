# Netlify Deployment Guide for StayFinder Frontend

## 🚀 Quick Deploy Steps

### Option 1: Deploy via Netlify UI (Recommended)

1. **Go to [Netlify](https://netlify.com)** and sign up/login
2. **Click "Add new site"** → **"Import an existing project"**
3. **Connect to GitHub** and select your repository
4. **Configure build settings**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. **Set environment variables**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://stayfinder-backend-j3p3.onrender.com`
6. **Click "Deploy site"**

### Option 2: Deploy via Git Push

1. **Push your code to GitHub** (if not already done)
2. **Follow Option 1** to connect your repository
3. **Netlify will auto-deploy** on every push to main branch

### Option 3: Drag & Drop (Manual)

1. **Build locally**: `npm run build`
2. **Drag the `dist` folder** to Netlify's deploy area
3. **Set environment variables** in site settings

## ⚙️ Environment Variables

### Required Environment Variable:
```
VITE_API_URL=https://stayfinder-backend-j3p3.onrender.com
```

### How to Set in Netlify:
1. Go to **Site settings** → **Environment variables**
2. **Add variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://stayfinder-backend-j3p3.onrender.com`
3. **Save** and redeploy

## 🔧 Configuration Files

### netlify.toml (Already created)
- Handles React Router routing
- Sets build commands
- Configures redirects

### Build Process
- Installs dependencies
- Builds React app with Vite
- Outputs to `dist` directory
- Serves static files

## 🧪 Testing After Deployment

1. **Visit your Netlify URL**
2. **Test user registration/login**
3. **Test creating hotel listings**
4. **Test booking functionality**
5. **Test host dashboard**

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Node.js version (use 18+)
   - Verify all dependencies are installed
   - Check build logs in Netlify

2. **API Calls Fail**:
   - Verify `VITE_API_URL` environment variable
   - Check browser console for CORS errors
   - Ensure backend is running

3. **Routing Issues**:
   - Verify `netlify.toml` redirects are set
   - Check that all routes work

4. **Environment Variables Not Working**:
   - Redeploy after setting variables
   - Check variable names (case-sensitive)
   - Verify in build logs

## 📱 Custom Domain (Optional)

1. **Go to Site settings** → **Domain management**
2. **Add custom domain**
3. **Configure DNS** as instructed
4. **Enable HTTPS** (automatic)

## 🔄 Continuous Deployment

- **Automatic**: Deploys on every push to main branch
- **Preview**: Creates preview deployments for pull requests
- **Rollback**: Easy rollback to previous deployments

## 📊 Monitoring

- **Build logs**: Available in Netlify dashboard
- **Function logs**: If using Netlify functions
- **Analytics**: Built-in analytics (optional)

## 🎉 Success!

Your StayFinder frontend will be live at: `https://your-site-name.netlify.app` 