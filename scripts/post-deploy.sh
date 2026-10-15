#!/usr/bin/env bash
set -euo pipefail

npm ci
npm run build

pm2 reload ecosystem.config.cjs --env production --update-env || pm2 start ecosystem.config.cjs --env production
pm2 save
