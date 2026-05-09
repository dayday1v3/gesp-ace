#!/bin/bash
set -e
echo "Building GESP Ace Backend (Prisma client)..."
npm install
npx prisma generate
echo "Build completed. Start with: npm start"
