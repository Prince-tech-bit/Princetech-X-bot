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
app.get("/", (_,res)=>res.json({ok:true,bot:settings.botname,version:"2.2.0",pairing:"/pair",health:"/health"}));
app.get("/pair", (_,res)=>res.type("html").send(pairingPage()));
app.get("/logo.jpg", (_,res)=>res.sendFile(path.join(__dirname,"assets","logo.jpg")));
app.get("/health", (_,res)=>res.json({ok:true,uptime:Math.floor((Date.now()-startedAt)/1000),whatsapp:!!sockRef}));

app.post("/api/pair", async (req,res)=>{
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
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
  }finally{ pairingInProgress=false; }
});
app.listen(settings.port, ()=>console.log(`[HTTP] listening on ${settings.port}`));

const commands = buildCatalog();
const recent = new Map();
const pairAttempts = new Map();
let sockRef = null;
let pairingInProgress = false;
let authRegistered = false;

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

function pairingPage() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#07111f">
<title>PRINCETECH-X BOT • Pairing</title>
<style>
:root{--bg:#050b14;--panel:#0b1727;--panel2:#0f2136;--line:#1d3855;--text:#f5f8fc;--muted:#91a4ba;--blue:#1677ff;--blue2:#55a3ff;--green:#35d07f;--danger:#ff6b7a}
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 50% -10%,#12345b 0,#07111f 38%,#03070d 100%);color:var(--text);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;display:flex;justify-content:center;padding:22px 14px 40px}.wrap{width:min(100%,520px)}
.top{display:flex;justify-content:space-between;align-items:center;padding:8px 4px 18px}.brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.2px}.brand img{width:38px;height:38px;border-radius:11px;object-fit:cover;border:1px solid #31547d}.pill{font-size:12px;color:#bfe8d2;border:1px solid #1c6b48;background:#0a2a1c;border-radius:999px;padding:7px 10px}
.card{background:linear-gradient(180deg,rgba(15,33,54,.96),rgba(8,19,33,.98));border:1px solid var(--line);border-radius:26px;padding:26px;box-shadow:0 25px 80px #0009}.hero{text-align:center}.hero img{width:105px;height:105px;border-radius:24px;object-fit:cover;border:1px solid #355a7f;box-shadow:0 12px 35px #0008}.hero h1{margin:17px 0 7px;font-size:29px}.hero p{margin:0;color:var(--muted);line-height:1.55}.section{margin-top:25px}.label{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#d7e3ef;margin:0 0 8px}.input{width:100%;border:1px solid #294766;background:#050e19;color:#fff;border-radius:14px;padding:15px 14px;font-size:16px;outline:none}.input:focus{border-color:var(--blue2);box-shadow:0 0 0 3px #1677ff22}.hint{font-size:12px;color:var(--muted);margin-top:8px;line-height:1.45}.btn{width:100%;border:0;border-radius:14px;padding:15px;margin-top:15px;background:linear-gradient(135deg,var(--blue),#2f91ff);color:#fff;font-size:16px;font-weight:800;cursor:pointer;box-shadow:0 10px 28px #1677ff30}.btn:disabled{opacity:.55;cursor:not-allowed}.result{display:none;margin-top:15px;border:1px solid #244766;background:#06111e;border-radius:16px;padding:18px;text-align:center}.result.ok{display:block}.result.err{display:block;border-color:#6a2630}.code{font-size:31px;letter-spacing:7px;font-weight:900;margin:10px 0;color:#fff}.oktxt{color:#86efb2;font-weight:700}.errtxt{color:#ff9ba6}.steps{margin-top:24px;border-top:1px solid #1a334e;padding-top:20px}.steps h2{font-size:15px;margin:0 0 14px}.step{display:flex;gap:12px;margin:12px 0;color:#c9d7e6;font-size:13px;line-height:1.45}.num{min-width:25px;height:25px;border-radius:50%;background:#12355a;color:#8fc4ff;display:grid;place-items:center;font-weight:800}.foot{text-align:center;color:#657c94;font-size:11px;margin-top:17px}.links{display:flex;justify-content:center;gap:14px;margin-top:9px}.links a{color:#7ebcff;text-decoration:none}.warning{margin-top:16px;padding:11px 12px;border-radius:12px;background:#201a0a;border:1px solid #4b3a14;color:#cdbd8c;font-size:11px;line-height:1.45}
</style></head>
<body><div class="wrap">
<header class="top"><div class="brand"><img src="/logo.jpg" alt="">PRINCETECH-X BOT</div><div class="pill">● Server Online</div></header>
<main class="card">
<section class="hero"><img src="/logo.jpg" alt="PRINCETECH-X BOT"><h1>Generate Your Pairing Code</h1><p>Connect your WhatsApp account to your PRINCETECH-X BOT instance securely.</p></section>
<section class="section"><div class="label"><span>WhatsApp Number</span><span>8–15 digits</span></div><input class="input" id="phone" inputmode="numeric" autocomplete="tel" placeholder="237677097064"><div class="hint">Use the full international number without <b>+</b>, spaces, or dashes.</div><button class="btn" id="btn">Generate Pairing Code</button><div id="result" class="result"></div></section>
<section class="steps"><h2>How to pair</h2><div class="step"><span class="num">1</span><span>Open <b>WhatsApp</b> on the phone you want to connect.</span></div><div class="step"><span class="num">2</span><span>Go to <b>Linked Devices</b> → <b>Link a device</b>.</span></div><div class="step"><span class="num">3</span><span>Select <b>Link with phone number instead</b>.</span></div><div class="step"><span class="num">4</span><span>Enter the pairing code shown here.</span></div></section>
<div class="warning">Never share a pairing code with another person. Only pair an account you own or are authorized to manage.</div>
</main><div class="foot">© 2026 PRINCETECH-X BOT<div class="links"><a href="/health">Server status</a><a href="/">API</a></div></div></div>
<script>
const btn=document.getElementById('btn'),phone=document.getElementById('phone'),result=document.getElementById('result');
function clean(v){return v.replace(/\D/g,'')}
phone.addEventListener('input',()=>phone.value=clean(phone.value));
btn.onclick=async()=>{const n=clean(phone.value);if(n.length<8||n.length>15){result.className='result err';result.innerHTML='<div class="errtxt">Enter a valid international WhatsApp number.</div>';return}result.className='result ok';result.innerHTML='Generating secure pairing code…';btn.disabled=true;try{const r=await fetch('/api/pair',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:n})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Request failed');result.innerHTML='<div class="oktxt">Your pairing code</div><div class="code">'+String(d.code).replace(/[^A-Z0-9]/g,'')+'</div><div>Enter this code in WhatsApp under Link with phone number instead.</div>'}catch(e){result.className='result err';result.innerHTML='<div class="errtxt">'+e.message+'</div>'}finally{btn.disabled=false}};
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
  await database.init();
  const {state,saveCreds}=await useMultiFileAuthState(authDir);
  authRegistered = !!state.creds.registered;
  const {version}=await fetchLatestBaileysVersion();
  const sock=makeWASocket({
    version,
    auth:state,
    logger:P({level:"silent"}),
    printQRInTerminal:false,
    browser:["Princetech-X Bot","Chrome","2.2.0"],
    markOnlineOnConnect:false,
    syncFullHistory:false
  });
  sockRef = sock;
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
