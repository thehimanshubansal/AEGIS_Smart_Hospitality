#!/bin/sh
set -e

echo "--- AEGIS SYSTEM STARTUP ---"

# 1. Firebase SQL Connect is active
# Migrations are managed via the Firebase CLI/Console.
# No manual migrations needed here.

# 2. Start the Next.js server IMMEDIATELY
# This makes Cloud Run happy by opening port 8080 right away
echo "Launching web server on Port $PORT..."
export HOSTNAME="0.0.0.0"
exec node server.js