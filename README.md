<p align="center">
  <img src="./logo.jpg" alt="PRINCETECH-X BOT" width="320">
</p>

<h1 align="center">PRINCETECH-X BOT</h1>

<p align="center">
  <b>Powerful WhatsApp Automation • Smart Commands • Security • Database</b>
</p>

<p align="center">
  <a href="https://github.com/Prince-tech-bit/PRINCETECH-X-BOT">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub">
  </a>
  <img src="https://img.shields.io/badge/Node.js-20%2B-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/WhatsApp-Bot-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp">
  <img src="https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge" alt="Version">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#commands">Commands</a> •
  <a href="#installation">Installation</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#security">Security</a>
</p>

---

## 🚀 About

**PRINCETECH-X BOT** is a WhatsApp automation project designed for developers,
communities, and tech enthusiasts.

It provides a structured command system, database-backed usage tracking,
anti-spam protection, authentication management, and deployment support for
cloud platforms.

> **Note:** The project includes an 800-command catalog. The catalog represents
> the planned/registered command set and does not mean every command is already
> fully implemented.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 WhatsApp Automation | Automate common WhatsApp tasks |
| ⚡ Command System | Organized command registry |
| 📚 800 Command Catalog | Large command catalogue for future expansion |
| 🗄️ Database | Store users, logs, blocklist and usage data |
| 🛡️ Anti-Spam | Rate limiting and command abuse protection |
| 🔐 Authentication | Persistent WhatsApp authentication state |
| 🚨 Security | Defensive security and hijack-protection tools |
| 📊 Usage Tracking | Track command activity |
| 🚫 Blocklist | Restrict abusive users |
| 🖼️ Custom Branding | PRINCETECH-X BOT branding and logo |
| ☁️ Cloud Ready | Railway / Render deployment support |
| 🐳 Docker | Docker deployment support |
| 🔧 Developer Friendly | Modular project structure |

---

# 📋 Commands

PRINCETECH-X BOT uses a command-based architecture.

Example:

```text
.help
.menu
.ping
.info
.owner
.status
.uptime

Command Categories

📌 General
🛠️ Tools
🎨 Media
📥 Downloader
👥 Group Management
🔐 Security
🤖 AI
📚 Education
🎮 Games
⚙️ System
👨‍💻 Developer

View Available Commands

After starting the bot, use:

.help

or:

.menu

> Commands depend on the implementation available in your current version.




---

📦 Requirements

Before installing PRINCETECH-X BOT, make sure you have:

Node.js 20+

npm

Git

A WhatsApp account

Internet connection



---

💻 Installation

1. Clone the Repository

git clone https://github.com/Prince-tech-bit/PRINCETECH-X-BOT.git

Enter the project:

cd PRINCETECH-X-BOT


---

2. Install Dependencies

npm install


---

3. Configure Environment

Create your environment file:

cp .env.example .env

Then edit:

nano .env

Add the required configuration.


---

🔑 WhatsApp Authentication

PRINCETECH-X BOT uses a persistent authentication state.

Start the bot:

npm start

If authentication is required, the terminal will display a QR code.

On your phone:

WhatsApp
   ↓
Settings
   ↓
Linked Devices
   ↓
Link a Device
   ↓
Scan QR Code

After successful authentication, the authentication files should be stored locally according to the bot configuration.

⚠️ Never upload authentication files to GitHub.


---

▶️ Run the Bot

Start normally:

npm start

For development:

npm run dev

If npm run dev is not defined in your current package.json, use:

npm start


---

☁️ Deployment

PRINCETECH-X BOT can be deployed to several environments.

🚂 Railway

1. Create a Railway account.


2. Create a new project.


3. Connect your GitHub repository.


4. Select:



PRINCETECH-X-BOT

5. Allow Railway to detect the project.


6. Configure the required environment variables.


7. Deploy.



Railway should use the project's Node/Docker configuration depending on the configuration committed to the repository.


---

🟣 Render

The repository contains Render deployment configuration.

General process:

Render
  ↓
New Web Service
  ↓
Connect GitHub
  ↓
Select PRINCETECH-X-BOT
  ↓
Configure Environment Variables
  ↓
Deploy


---

🐳 Docker

Build the image:

docker build -t princetech-x-bot .

Run:

docker run --env-file .env princetech-x-bot


---

🗄️ Database

PRINCETECH-X BOT includes database functionality for application-level data such as:

Users
Command Logs
Usage Tracking
Blocklist
Security Events

The database is intended to help manage bot activity and reduce abusive behavior.

Important

A database or anti-spam system cannot guarantee that WhatsApp will never restrict or ban an account.

Use the bot responsibly and comply with WhatsApp's applicable rules.


---

🛡️ Security

PRINCETECH-X BOT includes defensive security features.

Security Features

Rate limiting

User blocklist

Command logging

Authentication-state protection

Abuse detection

Defensive hijack-protection concepts


Important

The security features are intended for defensive and educational purposes.

They are not designed to steal WhatsApp credentials, take over accounts, or gain unauthorized access to groups or accounts.


---

🔐 Protect Your Secrets

Never commit these files or values to GitHub:

.env
auth_info/
auth/
session/
SESSION_ID
API keys
Database passwords
Private tokens
Bot credentials

Add sensitive files to .gitignore.

Example:

.env
auth_info/
auth/
session/
*.session
*.log
node_modules/


---

📁 Project Structure

PRINCETECH-X-BOT/
│
├── assets/
│
├── commands/
│
├── data/
│
├── lib/
│
├── index.js
├── config.js
├── settings.js
├── database.js
├── registry.js
│
├── package.json
├── package-lock.json
│
├── Dockerfile
├── railway.json
├── render.yaml
├── heroku.yml
├── app.json
│
├── catalog-800.txt
├── CHANGELOG.md
├── README.md
└── logo.jpg


---

📊 Project Information

Information	Value

Project	PRINCETECH-X BOT
Version	2.0.0
Runtime	Node.js
Platform	WhatsApp
Database	SQLite
Deployment	Railway / Render / Docker
Command Catalog	800
License	See repository



---

👥 Community

Join the PRINCETECH-X BOT community:

<p align="center"><a href="https://chat.whatsapp.com/FmFVTjGTf1hB0GXpyG0KQL">
<img src="https://img.shields.io/badge/WhatsApp-Join%20Community-25D366?style=for-the-badge&logo=whatsapp&logoColor=white">
</a></p>
---

🧑‍💻 Development

Want to improve the bot?

git clone https://github.com/Prince-tech-bit/PRINCETECH-X-BOT.git
cd PRINCETECH-X-BOT
npm install
npm start

You can extend the project by adding:

New Commands
New Plugins
AI Features
Database Features
Security Modules
Media Tools
Admin Tools
Developer Tools


---

📝 Disclaimer

PRINCETECH-X BOT is provided for educational, development, and automation purposes.

The developer is not responsible for misuse of the software.

Users are responsible for complying with applicable laws, platform rules, and the terms of services of any third-party platform they use.


---

⭐ Support the Project

If you find PRINCETECH-X BOT useful:

⭐ Star the repository

🍴 Fork the project

🐛 Report bugs

💡 Suggest features

🤝 Contribute improvements


---

<p align="center"><b>PRINCETECH-X BOT</b>

<br>Built for automation.
Designed for developers.
Powered by PRINCETECH.

</p>
---

<p align="center">
  <sub>© 2026 PRINCETECH-X BOT. All rights reserved.</sub>
</p>
```One important thing

Before pasting it, check that your actual project really has the files/features mentioned (for example npm run dev, the exact database implementation, and all 800 commands). The README should describe the repository accurately rather than claim features that aren't implemented.

For your GitHub page, the key image line is:

<img src="./logo.jpg" alt="PRINCETECH-X BOT" width="320">
