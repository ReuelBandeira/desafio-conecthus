#!/bin/sh
set -e

echo "⏳ Waiting for database to be ready..."
sleep 5 

echo "🔄 Running TypeORM migrations..."
npx typeorm migration:run -d dist/core/config/database/data-source.js

echo "🚀 Starting application..."
exec node dist/main