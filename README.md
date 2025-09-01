<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# QSR Synergy Suite

A comprehensive restaurant management and analytics platform built with React and TypeScript.

## Features

- 📊 Interactive dashboards with real-time analytics
- 🧠 AI-powered cost optimization and forecasting
- 📈 Sales forecasting and profit/loss analysis
- 📦 Inventory management and status tracking
- 📋 Task management and workflow automation
- 💰 Cost analysis and optimization recommendations

## Quick Start

### Development Mode
```bash
npm install
npm run dev
```

### Production Server

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

   Or use the deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Access the application:**
   Open http://localhost:3000 in your browser

### Environment Variables

Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Server Configuration

The application runs on an Express.js server that:
- Serves static files from the `dist` directory
- Handles client-side routing
- Runs on port 3000 by default (configurable via `PORT` environment variable)
- Optimized for production deployment

## Build Output

The build process creates a `dist` directory containing:
- Optimized and minified JavaScript bundles
- CSS files with vendor prefixes
- Static assets (images, fonts, etc.)
- `index.html` for the main application

## Deployment

For production deployment:
1. Run `npm run build` to create the production build
2. Copy the `dist` folder and `server.js` to your server
3. Install production dependencies: `npm install --production`
4. Start the server: `npm start`

The server will automatically serve the built application and handle all routing.
