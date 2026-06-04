#!/bin/sh
set -e

if [ "$SKIP_DB_MIGRATE" = "true" ]; then
  echo "Skipping migrations (SKIP_DB_MIGRATE=true)"
else
  echo "Applying database migrations..."
  MIGRATE_URL="${DIRECT_DATABASE_URL:-$DATABASE_URL}"
  PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=true \
    DATABASE_URL="$MIGRATE_URL" \
    npx prisma migrate deploy
fi

exec "$@"
