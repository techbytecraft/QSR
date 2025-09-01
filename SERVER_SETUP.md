# QSR Synergy Suite - Server Setup Guide

## 🎯 Overview

Your QSR Synergy Suite is now configured to run on a production server using Express.js. The application serves the built React application with proper routing and static file serving.

## 🚀 Quick Start

### 1. Start the Server
```bash
npm start
```

### 2. Access Your Application
Open your browser and navigate to: **http://localhost:3000**

## 🛠️ Server Management

### Using the Server Manager Script
We've created a comprehensive server management script for easy operations:

```bash
# Check server status
./server-manager.sh status

# Start the server
./server-manager.sh start

# Stop the server
./server-manager.sh stop

# Restart the server
./server-manager.sh restart

# Build the application
./server-manager.sh build

# Deploy (build + start)
./server-manager.sh deploy
```

### Manual Commands
```bash
# Build the application
npm run build

# Start the server
npm start

# Development mode
npm run dev
```

## 📁 Project Structure

```
qsr-synergy-suite/
├── components/          # React components
├── data/               # Mock data and types
├── hooks/              # Custom React hooks
├── services/           # API services (Gemini AI)
├── dist/               # Built application (generated)
├── server.js           # Express server
├── server-manager.sh   # Server management script
├── deploy.sh           # Deployment script
└── package.json        # Dependencies and scripts
```

## 🌐 Server Configuration

- **Port**: 3000 (configurable via `PORT` environment variable)
- **Framework**: Express.js
- **Static Files**: Served from `dist/` directory
- **Routing**: Handles client-side routing for SPA
- **Environment**: Production-ready with optimized builds

## 🔧 Environment Variables

Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000  # Optional, defaults to 3000
```

## 📦 Production Deployment

### Local Production Server
1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Install production dependencies:**
   ```bash
   npm install --production
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

### Using Deployment Scripts
```bash
# Quick deployment
./deploy.sh

# Or use the server manager
./server-manager.sh deploy
```

## 🔍 Troubleshooting

### Server Won't Start
- Check if port 3000 is already in use: `lsof -ti:3000`
- Kill existing processes: `lsof -ti:3000 | xargs kill -9`
- Verify all dependencies are installed: `npm install`

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`
- Verify Vite configuration

### Application Not Loading
- Check server logs for errors
- Verify the `dist/` directory exists and contains files
- Check browser console for JavaScript errors

## 📊 Monitoring

### Check Server Status
```bash
./server-manager.sh status
```

### View Server Logs
The server outputs logs to the console when running. Monitor for:
- Server startup messages
- Request logs
- Error messages

### Process Management
```bash
# View running processes
ps aux | grep "node server.js"

# Kill server process
pkill -f "node server.js"
```

## 🚀 Next Steps

1. **Customize the server** - Modify `server.js` for additional middleware
2. **Add environment-specific configs** - Create `.env.production`, `.env.staging`
3. **Implement logging** - Add Winston or Morgan for production logging
4. **Add health checks** - Implement `/health` endpoint
5. **Configure reverse proxy** - Use Nginx for production deployment
6. **Add SSL/TLS** - Configure HTTPS for production

## 📞 Support

Your QSR Synergy Suite is now running on a production-ready server! The application includes:

- ✅ Interactive dashboards with real-time analytics
- ✅ AI-powered cost optimization and forecasting
- ✅ Sales forecasting and profit/loss analysis
- ✅ Inventory management and status tracking
- ✅ Task management and workflow automation
- ✅ Cost analysis and optimization recommendations

Access your application at **http://localhost:3000** and start managing your restaurant operations!
