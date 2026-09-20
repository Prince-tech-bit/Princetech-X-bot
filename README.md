# PRINCETECH-X BOT

A clean rebuild of the uploaded WhatsApp bot project under the **PRINCETECH-X BOT** name.

## What changed

- Rebranded the runtime and deployment configuration from the old project name to **PRINCETECH-X BOT**.
- Added the supplied Princetech-X wolf logo at `assets/logo.jpg`.
- Updated the community link to:
  `https://chat.whatsapp.com/FmFVTjGTf1hB0GXpyG0KQL`
- Replaced the previous remote ZIP downloader/launcher with local application code. The bot does **not** download and execute hidden JavaScript payloads at runtime.
- Added SQLite operational database:
  - user first/last seen
  - command counts
  - command audit log
  - local blocklist
- Added conservative per-user command rate limiting.
- Added a deterministic **800-entry command catalog**. The core commands are functional; catalog entries are safe placeholders ready for real feature implementations.
- Added a defensive `hijack`/`hijack-protection` command that explains the bot does not perform unauthorized account or group takeovers.
- Added Railway, Render, Docker and Heroku configuration.

## Core commands

Use the default prefix `.`:

`.help`
`.ping`
`.info`
`.stats`
`.db`
`.health`
`.privacy`
`.security`
`.antispam`
`.rules`
`.group`
`.link`
`.owner`
`.uptime`
`.version`
`.about`
`.commands`
`.logs`
`.source`
`.hijack`

## Anti-ban / anti-spam

No bot can honestly guarantee that WhatsApp will never restrict an account. This build instead uses defensive measures:

1. Command rate limiting.
2. No bulk-message feature.
3. No credential/session stealing features.
4. No hidden remote-code execution.
5. Local audit logging.
6. Blocklist support in the database.
7. `markOnlineOnConnect: false` and conservative message handling.

For production use, respect WhatsApp's rules, avoid unsolicited bulk messaging, and keep the session credentials private.

## Database

SQLite database file:

`data/princetech-x.sqlite`

On ephemeral/free cloud services, local SQLite data can be lost when the service is redeployed or the filesystem is reset. Use a managed database or persistent disk if durable history is required.

## Run locally

```bash
npm install
npm start
```

The bot prints a QR code in the terminal. Scan it using WhatsApp > Linked devices.

## Environment variables

Copy `.env.example` to `.env` and configure:

- `BOT_NAME`
- `OWNER_NAME`
- `OWNER_NUMBER`
- `PREFIX`
- `PORT`

Do not publish `auth_info/`, `.env`, or session credentials.

## Important

This repository intentionally does not include account hijacking, credential theft, phishing, spam-bombing, DDoS, malware, or other unauthorized-access functions.
