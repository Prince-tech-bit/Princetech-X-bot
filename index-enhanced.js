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
app.use(express.json({limit:"10kb"}));

// Health and info endpoints
app.get("/", (_,res)=>res.json({
  ok:true,
  bot:settings.botname,
  version:"2.1.0",
  pairing:"/pair",
  health:"/health",
  hijack:"/api/hijack"
}));

app.get("/pair", (_,res)=>res.type("html").send(pairingPage()));
app.get("/logo.jpg", (_,res)=>res.sendFile(path.join(__dirname,"assets","logo.jpg")));
app.get("/health", (_,res)=>res.json({
  ok:true,
  uptime:Math.floor((Date.now()-startedAt)/1000),
  whatsapp:!!sockRef,
  paired:authRegistered
}));

// Pairing endpoint
app.post("/api/pair", async (req,res)=>{
  const secret = String(process.env.PAIRING_SECRET || "");
  const supplied = String(req.body?.secret || "");
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  
  if(!secret || supplied !== secret) return res.status(401).json({error:"Invalid pairing key."});
  if(!pairingAllowed(ip)) return res.status(429).json({error:"Too many pairing attempts. Try again later."});
  
  const phone = cleanPhone(req.body?.phone);
  if(!validPhone(phone)) return res.status(400).json({error:"Enter a valid international WhatsApp number, digits only."});
  if(!sockRef) return res.status(503).json({error:"WhatsApp connection is still starting. Try again in a few seconds."});
  if(pairingInProgress) return res.status(409).json({error:"Another pairing request is in progress. Please wait."});
  
  try{
    pairingInProgress = true;
    if(authRegistered) return res.status(409).json({error:"This bot instance is already paired. Log out/delete its auth state before pairing another account."});
    const code = await sockRef.requestPairingCode(phone);
    return res.json({ok:true,code});
  }catch(e){
    console.error("pairing error:", e?.message || e);
    return res.status(500).json({error:"Could not generate a pairing code. Check the server logs."});
  }finally{ 
    pairingInProgress=false; 
  }
});

// Hijack protection/detection endpoint
app.post("/api/hijack", async (req,res)=>{
  const secret = String(process.env.HIJACK_SECRET || "");
  const supplied = String(req.body?.secret || "");
  const action = String(req.body?.action || "").toLowerCase();
  
  if(!secret || supplied !== secret) return res.status(401).json({error:"Invalid hijack secret."});
  
  try {
    if(action === "status") {
      return res.json({
        ok:true,
        protected:hijackProtectionEnabled,
        blockedTargets:Array.from(hijackBlocklist.keys()),
        attempts:hijackAttempts.size
      });
    }
    
    if(action === "block") {
      const target = String(req.body?.target || "").trim();
      if(!target) return res.status(400).json({error:"Target required."});
      hijackBlocklist.set(target, {blockedAt: new Date(), reason: req.body?.reason || "manual"});
      return res.json({ok:true, message:`${target} added to hijack blocklist`});
    }
    
    if(action === "unblock") {
      const target = String(req.body?.target || "").trim();
      if(!target) return res.status(400).json({error:"Target required."});
      const removed = hijackBlocklist.delete(target);
      return res.json({ok:true, removed, message:`${target} ${removed ? "removed from" : "not in"} hijack blocklist`});
    }
    
    if(action === "enable") {
      hijackProtectionEnabled = true;
      return res.json({ok:true, message:"Hijack protection enabled"});
    }
    
    if(action === "disable") {
      hijackProtectionEnabled = false;
      return res.json({ok:true, message:"Hijack protection disabled"});
    }
    
    return res.status(400).json({error:"Unknown hijack action."});
  } catch(e) {
    console.error("hijack api error:", e?.message || e);
    return res.status(500).json({error:"Hijack API error."});
  }
});

const PORT = process.env.PORT || settings.port || 3000;
app.listen(PORT, ()=>console.log(`[HTTP] listening on ${PORT}`));

const commands = buildCatalog();
const recent = new Map();
const pairAttempts = new Map();
const hijackBlocklist = new Map();
const hijackAttempts = new Map();

let sockRef = null;
let pairingInProgress = false;
let authRegistered = false;
let hijackProtectionEnabled = true;

function cleanPhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function validPhone(value) {
  // WhatsApp pairing expects an international number without + or spaces.
  return /^\d{8,15}$/.test(value);
}

function pairingAllowed(ip) {
  const now = Date.now();
  const windowMs = 10 * 60_000;
  const maxAttempts = 5;
  const arr = (pairAttempts.get(ip) || []).filter(t => now - t < windowMs);
  if (arr.length >= maxAttempts) return false;
  arr.push(now);
  pairAttempts.set(ip, arr);
  return true;
}

// Check for potential hijack attempts
function checkHijackAttempt(sender, content) {
  if(!hijackProtectionEnabled) return false;
  
  // Monitor for suspicious patterns
  const suspicious = [
    /unlink.*device/i,
    /logout.*device/i,
    /remove.*auth/i,
    /delete.*session/i
  ];
  
  if(hijackBlocklist.has(sender)) {
    return true;
  }
  
  for(const pattern of suspicious) {
    if(pattern.test(content)) {
      // Track attempt
      const attempts = hijackAttempts.get(sender) || 0;
      hijackAttempts.set(sender, attempts + 1);
      
      // Auto-block after 3 attempts
      if(attempts >= 2) {
        hijackBlocklist.set(sender, {blockedAt: new Date(), reason: "auto-blocked: suspicious activity"});
        return true;
      }
      
      return true;
    }
  }
  
  return false;
}

function pairingPage() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PRINCETECH-X BOT • Pair</title>
<style>
body{margin:0;background:#0b1f3a;color:#fff;font-family:Arial,sans-serif;display:grid;place-items:center;min-height:100vh}
.card{width:min(92%,430px);background:#102b50;border:1px solid #31547d;border-radius:20px;padding:28px;box-shadow:0 18px 60px #0007}
.logo{display:block;width:110px;height:110px;object-fit:cover;border-radius:18px;margin:0 auto 16px}
h1{text-align:center;margin:0 0 8px;font-size:26px}.sub{text-align:center;color:#b9c8da;margin-bottom:24px}
label{display:block;margin:12px 0 7px;font-size:14px;color:#d8e4f2}
input{width:100%;box-sizing:border-box;padding:13px;border-radius:10px;border:1px solid #42698f;background:#08182c;color:#fff;font-size:16px}
button{width:100%;margin-top:16px;padding:13px;border:0;border-radius:10px;background:#1976ff;color:#fff;font-size:16px;font-weight:700;cursor:pointer;transition:background 0.3s}
button:hover{background:#0d5bcd}
button:disabled{background:#555;cursor:not-allowed}
.note{font-size:12px;color:#aebfd2;line-height:1.5;margin-top:18px}
.result{margin-top:18px;padding:15px;border-radius:12px;background:#08182c;display:none;text-align:center}
.code{font-size:28px;letter-spacing:5px;font-weight:800;margin:8px 0}
.err{color:#ffb4b4}
.ok{color:#b9ffd2}
</style></head>
<body><main class="card">
<img class="logo" src="/logo.jpg" alt="PRINCETECH-X BOT">
<h1>PRINCETECH-X BOT</h1>
<div class="sub">Secure WhatsApp pairing</div>
<label for="phone">WhatsApp number</label>
<input id="phone" inputmode="numeric" autocomplete="tel" placeholder="237677097064">
<label for="secret">Pairing key</label>
<input id="secret" type="password" autocomplete="off" placeholder="Your PAIRING_SECRET">
<button id="btn">Generate Pairing Code</button>
<div id="result" class="result"></div>
<div class="note">Enter the full international number without +, spaces, or dashes. The pairing code links the WhatsApp account to this bot instance. Never share your pairing key or code.</div>
</main>
<script>
const btn=document.getElementById('btn'), phone=document.getElementById('phone'), secret=document.getElementById('secret'), result=document.getElementById('result');
btn.onclick=async()=>{
  result.style.display='block';
  result.className='result';
  result.textContent='Generating...';
  btn.disabled=true;
  try{
    const r=await fetch('/api/pair',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:phone.value,secret:secret.value})});
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||'Request failed');
    result.innerHTML='<div class="ok">Pairing code</div><div class="code">'+d.code+'</div><div>Open WhatsApp → Linked Devices → Link a device → Link with phone number instead.</div>';
  }catch(e){
    result.className='result err';
    result.textContent=e.message;
  }finally{
    btn.disabled=false;
  }
};
</script></body></html>`;
}

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
  try {
    await database.init();
    const {state,saveCreds}=await useMultiFileAuthState(authDir);
    authRegistered = !!state.creds.registered;
    const {version}=await fetchLatestBaileysVersion();
    
    const sock=makeWASocket({
      version,
      auth:state,
      logger:P({level:"silent"}),
      printQRInTerminal:false,
      browser:["Princetech-X Bot","Chrome","2.1.0"],
      markOnlineOnConnect:false,
      syncFullHistory:false
    });
    
    sockRef = sock;
    
    sock.ev.on("creds.update", saveCreds);
    
    sock.ev.on("connection.update", ({connection,lastDisconnect,qr})=>{
      if(qr){ 
        console.log("Scan this QR with WhatsApp Linked Devices:"); 
        qrcode.generate(qr,{small:true}); 
      }
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
      
      // Check for hijack attempts
      if(checkHijackAttempt(jid, text)) {
        console.log(`[HIJACK] Blocked attempt from ${jid}`);
        await sock.sendMessage(msg.key.remoteJid,{text:"⚠️ This action is blocked by hijack protection."});
        return;
      }
      
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
        
        // Built-in .hijack command
        if(cmd === "hijack") {
          const action = (parts[0]||"").toLowerCase();
          if(action === "status") {
            await sock.sendMessage(msg.key.remoteJid,{text:`🛡️ Hijack Protection Status\n\n✓ Enabled\n\nThis bot instance is protected against unauthorized access attempts.`});
          } else {
            await sock.sendMessage(msg.key.remoteJid,{text:`.hijack status - Show hijack protection status\n\nHijack protection is a defensive measure against unauthorized account takeover attempts.`});
          }
          return;
        }
        
        const handler=commands.get(cmd);
        if(handler) await handler({sock,msg,args:parts,startedAt});
        else await sock.sendMessage(msg.key.remoteJid,{text:`Unknown command: ${cmd}\nUse ${settings.prefix}help`});
      } catch(e){ 
        console.error("command error",e); 
      }
    });
  } catch(err) {
    console.error("Bot startup error:", err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[SHUTDOWN] Received SIGINT, closing gracefully...");
  if(sockRef) sockRef.logout().catch(()=>{}).finally(()=>process.exit(0));
  else process.exit(0);
});

startBot().catch(e=>{
  console.error("Fatal error:", e);
  process.exit(1);
});
