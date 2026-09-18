const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");
const P = require("pino");
const express = require("express");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");
const settings = require("./settings");
const database = require("./lib/database");
const { buildCatalog } = require("./commands/registry");

const startedAt = Date.now();
const authDir = path.join(__dirname, "auth_info");
fs.mkdirSync(authDir, {recursive:true});

const app = express();
app.get("/", (_,res)=>res.json({ok:true,bot:settings.botname,version:"2.0.0"}));
app.get("/health", (_,res)=>res.json({ok:true,uptime:Math.floor((Date.now()-startedAt)/1000)}));
app.listen(settings.port, ()=>console.log(`[HTTP] listening on ${settings.port}`));

const commands = buildCatalog();
const recent = new Map();

function getText(msg) {
  return msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption || "";
}
function senderJid(msg) {
  return msg.key.participant || msg.key.remoteJid || "";
}
function checkRate(jid) {
  const now=Date.now(), win=settings.rateLimit.windowMs;
  const arr=(recent.get(jid)||[]).filter(t=>now-t<win);
  arr.push(now); recent.set(jid,arr);
  return arr.length <= settings.rateLimit.maxCommands;
}

async function startBot() {
  await database.init();
  const {state,saveCreds}=await useMultiFileAuthState(authDir);
  const {version}=await fetchLatestBaileysVersion();
  const sock=makeWASocket({
    version,
    auth:state,
    logger:P({level:"silent"}),
    printQRInTerminal:false,
    browser:["Princetech-X Bot","Chrome","2.0.0"],
    markOnlineOnConnect:false,
    syncFullHistory:false
  });
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", ({connection,lastDisconnect,qr})=>{
    if(qr){ console.log("Scan this QR with WhatsApp Linked Devices:"); qrcode.generate(qr,{small:true}); }
    if(connection==="open") console.log(`✓ ${settings.botname} connected`);
    if(connection==="close"){
      const code=lastDisconnect?.error?.output?.statusCode;
      if(code!==DisconnectReason.loggedOut){
        console.log("Connection closed; reconnecting...");
        setTimeout(startBot,3000);
      } else console.log("Logged out. Delete auth_info and restart to pair again.");
    }
  });
  sock.ev.on("messages.upsert", async ({messages})=>{
    const msg=messages?.[0];
    if(!msg?.message || msg.key.fromMe) return;
    const jid=senderJid(msg);
    const text=getText(msg).trim();
    if(!jid || !text.startsWith(settings.prefix)) return;
    const parts=text.slice(settings.prefix.length).trim().split(/\s+/);
    const cmd=(parts.shift()||"").toLowerCase();
    if(!cmd) return;
    try {
      await database.touchUser(jid,msg.pushName||"");
      if(await database.isBlocked(jid)) return;
      if(!checkRate(jid)){
        await sock.sendMessage(msg.key.remoteJid,{text:"Rate limit reached. Please slow down and try again."});
        return;
      }
      await database.logCommand(jid,cmd);
      const handler=commands.get(cmd);
      if(handler) await handler({sock,msg,args:parts,startedAt});
      else await sock.sendMessage(msg.key.remoteJid,{text:`Unknown command: ${cmd}\\nUse ${settings.prefix}help`});
    } catch(e){ console.error("command error",e); }
  });
}

startBot().catch(e=>{console.error(e);process.exit(1);});
