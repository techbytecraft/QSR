#!/bin/bash

echo "🚀 Starting QSR Synergy Suite Server..."

# Check if server is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Server is already running on port 3000"
    echo "🌐 Access your app at: http://localhost:3000"
    exit 0
fi

# Start the server
echo "📦 Starting server..."
npm start
