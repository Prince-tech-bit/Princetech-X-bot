# Quick Deployment Checklist

## 🔴 Critical: Dockerfile Fix

Replace the old RUN line with:

```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ffmpeg \
    imagemagick \
    webp \
    && rm -rf /var/lib/apt/lists/*
```

**Why?** Git binary is required for npm to install `@whiskeysockets/baileys` from GitHub.

---

## ✅ .hijack Command

### Endpoint
```
POST /api/hijack
```

### Actions Available
- `action: "status"` - Check protection status
- `action: "block"` - Block a user
- `action: "unblock"` - Unblock a user
- `action: "enable"` - Enable protection
- `action: "disable"` - Disable protection

### User Command
```
.hijack status
```

### Configuration
```env
HIJACK_SECRET=your-secret-key-here
```

---

## 🔗 Pairing Link

### Endpoints
- **UI**: `GET /pair`
- **API**: `POST /api/pair`

### Configuration
```env
PAIRING_SECRET=your-pairing-secret-here
```

### How Users Pair
1. Visit `https://your-domain.com/pair`
2. Enter WhatsApp number (digits only)
3. Enter pairing key
4. Submit to get 8-digit code
5. Enter code in WhatsApp Settings → Linked Devices

---

## 🚀 Deploy

### Local Docker
```bash
docker build -t princetech-x-bot .
docker run --env-file .env -p 3000:3000 princetech-x-bot
```

### Railway
```bash
git push
# Then set environment variables in Railway dashboard:
# - PAIRING_SECRET=...
# - HIJACK_SECRET=...
```

### Render
```bash
git push
# Render automatically picks up render.yaml and .env variables
```

---

## ✓ Environment Variables

```env
NODE_ENV=production
PAIRING_SECRET=abc123def456
HIJACK_SECRET=xyz789uvw123
PORT=3000  # Optional, defaults to 3000
```

---

## 🧪 Quick Test

```bash
# Root info
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health

# Hijack status
curl -X POST http://localhost:3000/api/hijack \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_HIJACK_SECRET","action":"status"}'
```

---

## Files to Update

1. **Dockerfile** → Add git to apt-get install
2. **index.js** → Use enhanced version with .hijack and pairing improvements
3. **.env** → Add PAIRING_SECRET and HIJACK_SECRET
4. **.gitignore** → Ensure .env is ignored

---

## Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] Never commit real secrets
- [ ] Use strong random secrets (32+ chars)
- [ ] Different secret for pairing vs hijack
- [ ] PAIRING_SECRET environment variable set
- [ ] HIJACK_SECRET environment variable set
- [ ] NODE_ENV=production in Docker
- [ ] Test health endpoint after deployment

---

**Version**: 2.1.0  
**Bot**: PRINCETECH-X BOT  
🐺
