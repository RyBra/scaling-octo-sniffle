#!/bin/sh
set -e
cd /app
prisma generate --schema=./prisma/schema.prisma
prisma migrate deploy --schema=./prisma/schema.prisma
node prisma/seed.js
exec node dist/src/main.js
