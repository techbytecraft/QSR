#!/bin/bash

echo "🚀 Building QSR Synergy Suite..."
npm run build

echo "📦 Installing production dependencies..."
npm install --production

echo "🌐 Starting server..."
npm start
