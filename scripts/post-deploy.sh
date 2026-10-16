#!/usr/bin/env bash
set -euo pipefail

ln -sf /home/sites/t2u-webinar-ai/shared/.env.local .env.local
npm ci
npm run build

pm2 reload ecosystem.config.cjs --env production --update-env || pm2 start ecosystem.config.cjs --env production
pm2 save
