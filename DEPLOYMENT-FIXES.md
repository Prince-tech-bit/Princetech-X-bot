# PRINCETECH-X BOT v2.1.0 - Deployment Fixes & Enhancements

## Overview
This document covers the critical fixes needed for successful Docker deployment and the new features added in v2.1.0.

---

## 🔴 Critical Issue: Dockerfile Git Binary Missing

### Problem
The npm install fails during Docker build because `@whiskeysockets/baileys` is installed from a GitHub repository (git-hosted dependency), but the Node.js base image doesn't include the `git` binary.

**Error during build:**
```
npm ERR! Error while executing:
npm ERR! /usr/bin/git clone https://github.com/WhiskeySockets/Baileys.git ...
npm ERR! /bin/sh: 1: git: not found
```

### Solution
Add `git` to the `apt-get install` list in the Dockerfile:

```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ffmpeg \
    imagemagick \
    webp \
    && rm -rf /var/lib/apt/lists/*
```

**Key points:**
- Install `git` before running `npm install`
- Keep using `--no-install-recommends` to minimize image size
- Clean up apt cache after installation

---

## ✅ Feature 1: `.hijack` Command & Anti-Hijack Protection

### What is Hijack Protection?

Hijack protection is a **defensive mechanism** designed to:
- Detect suspicious patterns that indicate unauthorized access attempts
- Block users attempting to unlink devices, logout, or access auth state
- Auto-block repeat offenders
- Provide a protected status endpoint

**This is purely defensive.** It does NOT give the bot control over other accounts or unauthorized access. It only protects the bot's own instance.

### Implementation

The `/api/hijack` endpoint provides status and control:

```bash
# Check hijack protection status
curl -X POST http://localhost:3000/api/hijack \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_HIJACK_SECRET",
    "action": "status"
  }'

# Block a specific user
curl -X POST http://localhost:3000/api/hijack \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_HIJACK_SECRET",
    "action": "block",
    "target": "237677097064@s.whatsapp.net",
    "reason": "suspicious activity"
  }'

# Unblock a user
curl -X POST http://localhost:3000/api/hijack \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_HIJACK_SECRET",
    "action": "unblock",
    "target": "237677097064@s.whatsapp.net"
  }'

# Enable/disable protection
curl -X POST http://localhost:3000/api/hijack \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_HIJACK_SECRET",
    "action": "enable"
  }'
```

### Configuration

Add to `.env`:

```env
HIJACK_SECRET=your-secret-hijack-key-here
```

### User-Facing Command

Users can check the status of hijack protection:

```
.hijack status
```

Returns:
```
🛡️ Hijack Protection Status

✓ Enabled

This bot instance is protected against unauthorized access attempts.
```

---

## ✅ Feature 2: Pairing Link Endpoint

### What is Already Implemented

The pairing system is fully functional and accessible at:

- **UI**: `GET /pair` → Interactive HTML form
- **API**: `POST /api/pair` → JSON endpoint

### How It Works

1. User visits `https://your-bot-domain.com/pair`
2. Enters WhatsApp number (international format, digits only)
3. Enters pairing key (from `.env` `PAIRING_SECRET`)
4. System generates 8-digit pairing code
5. User enters code in WhatsApp → Linked Devices → Link a device

### Configuration

Add to `.env`:

```env
PAIRING_SECRET=your-pairing-secret-here
```

### Root Endpoint Update

The root endpoint now advertises the pairing link:

```bash
GET /
```

Response:
```json
{
  "ok": true,
  "bot": "PRINCETECH-X BOT",
  "version": "2.1.0",
  "pairing": "/pair",
  "health": "/health",
  "hijack": "/api/hijack"
}
```

---

## 🔧 Additional Deployment Fixes

### 1. **PORT Environment Variable**
The enhanced version respects the `PORT` environment variable for hosting platforms:

```javascript
const PORT = process.env.PORT || settings.port || 3000;
```

This is critical for:
- Railway
- Render
- Heroku
- Any platform that assigns a dynamic port

### 2. **Graceful Shutdown**
Added proper SIGINT handling:

```javascript
process.on("SIGINT", () => {
  console.log("\n[SHUTDOWN] Received SIGINT, closing gracefully...");
  if(sockRef) sockRef.logout().catch(()=>{}).finally(()=>process.exit(0));
  else process.exit(0);
});
```

This prevents unclean shutdowns and authentication issues on restart.

### 3. **Enhanced Error Handling**
- Bot startup errors are now caught and reported
- Try-catch blocks around critical operations
- Clear error messages in logs

### 4. **Improved Health Check**
The health endpoint now includes pairing status:

```bash
GET /health
```

Response:
```json
{
  "ok": true,
  "uptime": 3600,
  "whatsapp": true,
  "paired": true
}
```

---

## 📋 Complete Dockerfile

```dockerfile
FROM node:20-bookworm-slim

# Install git and other system dependencies in one layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ffmpeg \
    imagemagick \
    webp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (git is now available for git-hosted packages)
RUN npm install --omit=dev

# Copy application code
COPY . .

# Expose port for HTTP server
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the bot
CMD ["npm", "start"]
```

---

## 🚀 Deployment Steps

### Docker Build (Local)

```bash
# Build image
docker build -t princetech-x-bot:2.1.0 .

# Run with environment file
docker run --env-file .env -p 3000:3000 princetech-x-bot:2.1.0

# Or with explicit environment variables
docker run \
  -e NODE_ENV=production \
  -e PAIRING_SECRET=your-secret \
  -e HIJACK_SECRET=your-hijack-secret \
  -p 3000:3000 \
  princetech-x-bot:2.1.0
```

### Railway Deployment

```bash
# Push to GitHub
git add .
git commit -m "fix: add git to dockerfile, implement hijack protection"
git push

# In Railway:
# 1. New Project → Deploy from GitHub
# 2. Select PRINCETECH-X-BOT
# 3. Add variables:
#    - NODE_ENV=production
#    - PAIRING_SECRET=your-secret
#    - HIJACK_SECRET=your-hijack-secret
# 4. Deploy
```

### Render Deployment

The `render.yaml` configuration is unchanged. The bot will:

1. Build with `npm install`
2. Start with `npm start`
3. Listen on the assigned `PORT`

---

## 🧪 Testing the Fixes

### 1. Test Docker Build

```bash
docker build --no-cache -t test-bot .
# Should complete without git errors
```

### 2. Test HTTP Endpoints

```bash
# Test health check
curl http://localhost:3000/health

# Test root info
curl http://localhost:3000/

# Test pairing page
curl http://localhost:3000/pair

# Test hijack API
curl -X POST http://localhost:3000/api/hijack \
  -H "Content-Type: application/json" \
  -d '{"secret":"test","action":"status"}'
```

### 3. Test .hijack Command

Once bot is paired:

```
.hijack status
```

---

## ⚠️ Security Notes

### Pairing Secret
- Never hardcode in source code
- Use strong, random values
- Store in `.env` (git-ignored)
- Rotate periodically in production

### Hijack Secret
- Separate from pairing secret
- Only share with administrators
- Use the API only from secure, private networks
- Consider IP whitelisting for `/api/hijack` endpoint

### .env File
```env
# .env (DO NOT COMMIT THIS)
NODE_ENV=production
PAIRING_SECRET=abc123def456ghi789
HIJACK_SECRET=xyz987uvw654tsr321
```

Add to `.gitignore`:
```
.env
auth_info/
node_modules/
```

---

## 📊 Version Comparison

| Feature | v2.0.0 | v2.1.0 |
|---------|--------|--------|
| Pairing | ✅ | ✅ Improved UI |
| Hijack Protection | ❌ | ✅ Full suite |
| Git in Docker | ❌ | ✅ Fixed |
| PORT env var | ❌ | ✅ Added |
| Graceful shutdown | ❌ | ✅ Added |
| Health endpoint | ✅ | ✅ Enhanced |

---

## 🐛 Troubleshooting

### Build Error: `git: not found`
**Fix**: Ensure Dockerfile has `git` in apt-get install before `npm install`

### Docker run: `Cannot find module @whiskeysockets/baileys`
**Fix**: Git wasn't available during npm install. Rebuild the image.

### Pairing code not generating
**Cause**: Bot not fully connected yet
**Fix**: Wait a few seconds and retry. Check logs for connection status.

### .hijack command not responding
**Cause**: Command not implemented in older version
**Fix**: Use the enhanced index.js that includes the .hijack handler

### Deployment fails on Render/Railway
**Cause**: PORT environment variable not respected
**Fix**: Use enhanced index.js that respects process.env.PORT

---

## 📝 Summary

✅ **Dockerfile** - Add git binary  
✅ **Hijack Protection** - Anti-takeover defense system  
✅ **Pairing Link** - Secure device linking  
✅ **Deployment** - Environment variable support & graceful shutdown  
✅ **Error Handling** - Robust startup and operation

All fixes are backward compatible and enhance security without breaking existing functionality.

---

**PRINCETECH-X BOT v2.1.0**  
Built under the PRINCETECH brand  
🐺
