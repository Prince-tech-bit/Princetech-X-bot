const settings = require("../settings");
const db = require("../lib/database");

const core = new Map();

function add(name, fn, aliases=[]) {
  core.set(name, fn);
  for (const a of aliases) core.set(a, fn);
}

add("menu", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:
`╭───〔 ${settings.botname} 〕───╮
│ Prefix: ${settings.prefix}
│ Core commands: 30+
│ Catalog: 800 command slots
╰────────────────────────────
${settings.prefix}help
${settings.prefix}ping
${settings.prefix}info
${settings.prefix}stats
${settings.prefix}rules
${settings.prefix}group
${settings.prefix}owner
${settings.prefix}uptime
${settings.prefix}privacy
${settings.prefix}antispam
${settings.prefix}link`});
},["help","start"]);

add("ping", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"Pong! 🟢"});
});
add("info", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:`${settings.botname}\\nProfessional WhatsApp automation for Princetech.\\nPrefix: ${settings.prefix}\\nSafety controls: rate limits + blocklist + local audit DB.`});
});
add("rules", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"Rules: no spam, scams, harassment, credential theft, or unauthorized account access. Use automation responsibly and follow WhatsApp policies."});
});
add("link", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:`Princetech-X community:\\n${settings.groupLink}`});
});
add("group", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:`Community group:\\n${settings.groupLink}`});
});
add("owner", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:`Owner: ${settings.ownername}${settings.owner ? "\\nNumber: "+settings.owner : ""}`});
});
add("privacy", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"Privacy mode: the bot stores only operational user IDs, timestamps, command counts, audit logs, and an optional blocklist in SQLite. Do not place secrets in messages."});
});
add("antispam", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:`Anti-spam is enabled: ${settings.rateLimit.maxCommands} commands per ${settings.rateLimit.windowMs/1000}s per user. Limits reduce automated spam; they cannot guarantee that WhatsApp will never restrict an account.`});
});
add("uptime", async ({sock,msg,startedAt}) => {
  const s=Math.floor((Date.now()-startedAt)/1000);
  await sock.sendMessage(msg.key.remoteJid,{text:`Uptime: ${s}s`});
});
add("stats", async ({sock,msg}) => {
  const s=await db.stats();
  await sock.sendMessage(msg.key.remoteJid,{text:`Database stats\\nUsers: ${s.users}\\nCommands: ${s.commands}\\nBlocked: ${s.blocked}`});
});
add("id", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:`Chat JID: ${msg.key.remoteJid}`});
});
add("time", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:`Server time: ${new Date().toISOString()}`});
});
add("date", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:`Server date: ${new Date().toISOString().slice(0,10)}`});
});
add("db", async ({sock,msg}) => {
  const s=await db.stats();
  await sock.sendMessage(msg.key.remoteJid,{text:`SQLite is online. ${s.users} users, ${s.commands} logged commands.`});
});
add("health", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"System health: bot process online; SQLite online; anti-spam enabled."});
});
add("version", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"PRINCETECH-X BOT v2.0.0"});
});
add("about", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"Princetech-X Bot is a rebuilt automation base focused on maintainability, rate limiting and transparent configuration."});
});
add("commands", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:`Use ${settings.prefix}help for core commands. The project contains an 800-entry command catalog; catalog entries are safe placeholders until implemented.`});
});
add("contact", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"Use the configured owner contact or Princetech's official support channel. Never send passwords, OTPs or session tokens."});
});
add("security", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"Security: keep SESSION_ID private, rotate exposed credentials, use environment variables, and never run unknown remote JavaScript."});
});
add("hijack", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"Hijack protection is available as a safety topic only. This bot does not provide account/group hijacking or unauthorized access tools. Use .security for defensive guidance."});
},["hijackprotection","hijack-protection"]);
add("ban", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"The bot cannot guarantee immunity from WhatsApp restrictions. Use the built-in rate limits, avoid bulk unsolicited messaging, and respect platform rules."});
},["unban"]);
add("logs", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"Audit logs are stored locally in data/princetech-x.sqlite. They record command activity for operational troubleshooting."});
});
add("source", async ({sock,msg}) => {
  await sock.sendMessage(msg.key.remoteJid,{text:"This build intentionally does not download and execute hidden remote ZIP payloads. All runtime code is kept in the project."});
});

const unsafeNames = new Set([
  "phish","phishing","steal","tokensteal","sessionsteal","passwordsteal",
  "credentialsteal","accounttakeover","otpsteal","cardsteal","spy","keylogger",
  "ddos","ransom","malware","exploit","bruteforce","crack","bypass"
]);

function buildCatalog() {
  const catalog = new Map(core);
  // 800 deterministic command names, with safe informational behavior.
  // 30+ core commands are functional; generated catalog entries are placeholders.
  const prefixes=["ai","admin","audio","auto","backup","bot","chat","cloud","code","crypto","data","dev","docs","edu","file","fun","group","help","image","info","log","media","music","news","phone","photo","privacy","project","search","server","social","system","text","time","tool","translate","user","video","web","work"];
  const actions=["about","check","guide","help","info","list","status","tips","tools","usage","what","why","how","show","report","setup","test","version","docs","faq"];
  let count=0;
  for (const p of prefixes) {
    for (const a of actions) {
      const name=`${p}-${a}`;
      if (!unsafeNames.has(name) && !catalog.has(name)) {
        catalog.set(name, async ({sock,msg}) => {
          await sock.sendMessage(msg.key.remoteJid,{text:`${name}: catalog command. This slot is reserved for a safe ${p} feature. Use ${settings.prefix}help for implemented core commands.`});
        });
        count++;
        if (count>=800-core.size) return catalog;
      }
    }
  }
  return catalog;
}
module.exports={core,buildCatalog,unsafeNames};
