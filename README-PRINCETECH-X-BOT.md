```{=html}
<p align="center">
```
`<img src="./logo.jpg" width="500" alt="PRINCETECH-X BOT">`{=html}
```{=html}
</p>
```
```{=html}
<h1 align="center">
```
🐺 PRINCETECH-X BOT
```{=html}
</h1>
```
```{=html}
<p align="center">
```
`<strong>`{=html}WhatsApp automation bot by PRINCETECH`</strong>`{=html}
```{=html}
</p>
```
```{=html}
<p align="center">
```
A Node.js WhatsApp bot project with command registration, local database
support, rate limiting, defensive hijack protection, and deployment
configurations for common hosting platforms.
```{=html}
</p>
```
```{=html}
<p align="center">
```
`<a href="https://github.com/Prince-tech-bit/PRINCETECH-X-BOT">`{=html}
`<img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub">`{=html}
`</a>`{=html}
```{=html}
</p>
```

------------------------------------------------------------------------

## ✨ About

**PRINCETECH-X BOT** is a WhatsApp bot project maintained under the
PRINCETECH name.

The repository includes:

-   🤖 WhatsApp bot core
-   🧩 Command registry and command catalog
-   🗃️ Local database support
-   🛡️ Anti-spam / rate-limiting protection
-   🔐 Authentication-state storage
-   🐺 PRINCETECH-X branding
-   🚂 Railway deployment configuration
-   🖥️ Render deployment configuration
-   🐳 Docker support
-   📦 Heroku configuration
-   📋 800-command catalog

> **Note:** The 800-command catalog is a catalog/framework. It does not
> mean every listed command is a fully implemented feature.

------------------------------------------------------------------------

## 🔗 PRINCETECH-X COMMUNITY

### WhatsApp Group

Join the official community:

**https://chat.whatsapp.com/FmFVTjGTf1hB0GXpyG0KQL**

------------------------------------------------------------------------

## 📁 Project Structure

``` text
PRINCETECH-X-BOT/
├── assets/
├── commands/
├── data/
├── lib/
├── index.js
├── config.js
├── settings.js
├── database.js
├── registry.js
├── package.json
├── Dockerfile
├── railway.json
├── render.yaml
├── heroku.yml
├── app.json
├── catalog-800.txt
├── CHANGELOG.md
├── README.md
└── logo.jpg
```

------------------------------------------------------------------------

## ⚙️ Requirements

Before running the bot, install:

-   Node.js
-   npm
-   Git (optional, useful for development)
-   A WhatsApp account for linking the bot

Check your versions:

``` bash
node -v
npm -v
```

------------------------------------------------------------------------

## 🚀 Run Locally

Clone the repository:

``` bash
git clone https://github.com/Prince-tech-bit/PRINCETECH-X-BOT.git
cd PRINCETECH-X-BOT
```

Install dependencies:

``` bash
npm install
```

Start the bot:

``` bash
npm start
```

The current bot authentication flow uses WhatsApp authentication state
and can display a QR code in the terminal when a new connection is
required.

In WhatsApp:

**Settings → Linked devices → Link a device**

Then scan the QR code displayed by the bot.

------------------------------------------------------------------------

## 🔐 Authentication & Secrets

Do **not** publish WhatsApp authentication credentials, session data,
passwords, API keys, or other secrets in GitHub.

Use environment variables or the hosting platform's secret/variable
manager for sensitive values.

Never commit files containing real credentials.

If authentication data is generated locally, keep the authentication
directory private and do not upload it to a public repository.

------------------------------------------------------------------------

## 🗃️ Database

The project includes a local database layer for bot data such as users,
command activity, and defensive controls.

The database can be used for:

-   User records
-   Command usage tracking
-   Rate-limit information
-   Blocked-user records
-   Other bot state required by the project

### Important

A database **cannot guarantee that WhatsApp will never ban an account**.
It can help the bot enforce responsible usage patterns, but WhatsApp's
own systems and policies remain outside the bot's control.

------------------------------------------------------------------------

## 🛡️ Safety & Abuse Protection

PRINCETECH-X BOT includes defensive mechanisms intended to reduce
abusive automation, including:

-   Rate limiting
-   Anti-spam controls
-   Usage tracking
-   Blocklist support
-   Defensive hijack-protection functionality

The **hijack-protection** functionality is intended for defense and
detection, not for taking control of WhatsApp accounts, groups, or other
people's devices.

Do not use the bot to send spam, impersonate people, obtain credentials,
bypass account security, or interfere with accounts you do not control.

------------------------------------------------------------------------

## 🚂 Railway Deployment

The repository contains `railway.json` for Railway deployment.

General process:

1.  Push this repository to GitHub.
2.  Open Railway.
3.  Create a new project.
4.  Choose **Deploy from GitHub repo**.
5.  Select `PRINCETECH-X-BOT`.
6.  Allow Railway to build the Node.js project.
7.  Configure required environment variables/secrets in Railway.
8.  Deploy.
9.  Check the deployment logs.

Do not place real credentials inside `railway.json` or any source file.

------------------------------------------------------------------------

## 🖥️ Render Deployment

The repository contains `render.yaml` for Render configuration.

General process:

1.  Push the repository to GitHub.
2.  Open Render.
3.  Create a service from the GitHub repository.
4.  Select `PRINCETECH-X-BOT`.
5.  Review the detected build/start configuration.
6.  Add required environment variables securely.
7.  Deploy.
8.  Check the service logs.

------------------------------------------------------------------------

## 🐳 Docker

Build the image:

``` bash
docker build -t princetech-x-bot .
```

Run it:

``` bash
docker run --env-file .env princetech-x-bot
```

Keep `.env` private.

------------------------------------------------------------------------

## 📋 Commands

The repository contains:

``` text
catalog-800.txt
```

This contains the project's 800-command catalog/framework.

The command registry is handled through the project's JavaScript
registry files.

Use:

``` text
.help
```

or the command/help mechanism implemented by the current bot to inspect
available commands after the bot is connected.

------------------------------------------------------------------------

## 🔧 Configuration

Main configuration files include:

  File             Purpose
  ---------------- ----------------------------------------
  `config.js`      Bot configuration
  `settings.js`    Runtime/settings values
  `database.js`    Database layer
  `registry.js`    Command registry
  `package.json`   Node.js dependencies and scripts
  `railway.json`   Railway configuration
  `render.yaml`    Render configuration
  `Dockerfile`     Docker image configuration
  `heroku.yml`     Heroku Docker deployment configuration
  `app.json`       Heroku application metadata

------------------------------------------------------------------------

## 🧹 Clean Repository Rules

Before pushing changes to GitHub:

-   Do not upload `.env`
-   Do not upload real WhatsApp authentication files
-   Do not upload passwords
-   Do not upload private API keys
-   Do not hard-code credentials into JavaScript
-   Keep deployment secrets in the hosting platform's
    environment-variable system

------------------------------------------------------------------------

## 📝 Development

Install dependencies:

``` bash
npm install
```

Run the bot:

``` bash
npm start
```

Check the project after making changes:

``` bash
npm install
npm start
```

Review the terminal logs for connection, authentication, or dependency
errors.

------------------------------------------------------------------------

## 📜 License

This repository should be used according to the license and permissions
provided with the project.

If you redistribute or modify the project, review the original
dependencies and their individual licenses.

------------------------------------------------------------------------

## ⚠️ Disclaimer

PRINCETECH-X BOT is provided for legitimate automation, development,
testing, and educational purposes.

You are responsible for how you configure and use the software.

The project does not guarantee immunity from WhatsApp restrictions,
account bans, service interruptions, or changes to WhatsApp's protocols.

Use automation responsibly and respect the rules of the services you
connect to.

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<strong>`{=html}🐺 PRINCETECH-X BOT`</strong>`{=html} `<br>`{=html}
`<sub>`{=html}Built under the PRINCETECH brand`</sub>`{=html}
```{=html}
</p>
```
