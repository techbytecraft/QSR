#!/bin/bash

SERVER_PORT=3000
SERVER_NAME="QSR Synergy Suite"

case "$1" in
    start)
        echo "🚀 Starting $SERVER_NAME..."
        if lsof -Pi :$SERVER_PORT -sTCP:LISTEN -t >/dev/null ; then
            echo "⚠️  Server is already running on port $SERVER_PORT"
            echo "🌐 Access your app at: http://localhost:$SERVER_PORT"
        else
            npm start
        fi
        ;;
    stop)
        echo "🛑 Stopping $SERVER_NAME..."
        if lsof -ti:$SERVER_PORT >/dev/null ; then
            lsof -ti:$SERVER_PORT | xargs kill -9
            echo "✅ Server stopped successfully"
        else
            echo "ℹ️  Server is not running"
        fi
        ;;
    restart)
        echo "🔄 Restarting $SERVER_NAME..."
        if lsof -ti:$SERVER_PORT >/dev/null ; then
            lsof -ti:$SERVER_PORT | xargs kill -9
            sleep 2
        fi
        npm start
        ;;
    status)
        if lsof -Pi :$SERVER_PORT -sTCP:LISTEN -t >/dev/null ; then
            echo "✅ $SERVER_NAME is running on port $SERVER_PORT"
            echo "🌐 Access your app at: http://localhost:$SERVER_PORT"
            echo "📊 Process ID: $(lsof -ti:$SERVER_PORT)"
        else
            echo "❌ $SERVER_NAME is not running"
        fi
        ;;
    build)
        echo "📦 Building $SERVER_NAME..."
        npm run build
        echo "✅ Build completed successfully"
        ;;
    deploy)
        echo "🚀 Deploying $SERVER_NAME..."
        npm run build
        if lsof -ti:$SERVER_PORT >/dev/null ; then
            lsof -ti:$SERVER_PORT | xargs kill -9
            sleep 2
        fi
        npm start
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|build|deploy}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the server"
        echo "  stop    - Stop the server"
        echo "  restart - Restart the server"
        echo "  status  - Check server status"
        echo "  build   - Build the application"
        echo "  deploy  - Build and start the server"
        echo ""
        echo "Examples:"
        echo "  $0 start    # Start the server"
        echo "  $0 status   # Check if server is running"
        echo "  $0 deploy   # Build and deploy"
        exit 1
        ;;
esac
