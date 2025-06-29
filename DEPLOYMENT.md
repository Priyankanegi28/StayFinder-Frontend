# Frontend Deployment Guide for Render

## Environment Variables

Create a `.env.production` file in the `client` directory with:

```
VITE_API_URL=https://stayfinder-backend-j3p3.onrender.com
```

## Render Static Site Configuration

1. **Service Type**: Static Site
2. **Root Directory**: `client`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`

## Environment Variables in Render Dashboard

Add this environment variable in your Render dashboard:
- **Key**: `VITE_API_URL`
- **Value**: `https://stayfinder-backend-j3p3.onrender.com`

## Build Process

The build process will:
1. Install dependencies
2. Build the React app with Vite
3. Output static files to `dist` directory
4. Serve the static files

## CORS Configuration

Your backend is already configured with CORS to allow requests from any origin. If you need to restrict it to your frontend domain, update the CORS configuration in `server/server.js`.

## Testing

After deployment:
1. Visit your frontend URL
2. Test user registration/login
3. Test creating listings
4. Test booking functionality
5. Test host dashboard features

## Troubleshooting

- If API calls fail, check the browser console for CORS errors
- Ensure the backend URL is correct in environment variables
- Verify the backend is running and accessible 