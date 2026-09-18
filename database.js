const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "princetech-x.sqlite");
const db = new sqlite3.Database(dbPath);

function run(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err); else resolve(this);
    });
  });
}
function get(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err,row) => err ? reject(err) : resolve(row));
  });
}
function all(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err,rows) => err ? reject(err) : resolve(rows));
  });
}
async function init() {
  await run(`CREATE TABLE IF NOT EXISTS users(
    jid TEXT PRIMARY KEY,
    name TEXT,
    first_seen INTEGER NOT NULL,
    last_seen INTEGER NOT NULL,
    commands INTEGER NOT NULL DEFAULT 0
  )`);
  await run(`CREATE TABLE IF NOT EXISTS command_log(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jid TEXT NOT NULL,
    command TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`);
  await run(`CREATE TABLE IF NOT EXISTS blocked(
    jid TEXT PRIMARY KEY,
    reason TEXT,
    created_at INTEGER NOT NULL
  )`);
  await run(`CREATE TABLE IF NOT EXISTS settings(
    key TEXT PRIMARY KEY,
    value TEXT
  )`);
}
async function touchUser(jid,name) {
  const now=Date.now();
  await run(`INSERT INTO users(jid,name,first_seen,last_seen,commands)
    VALUES(?,?,?,?,0)
    ON CONFLICT(jid) DO UPDATE SET name=excluded.name,last_seen=excluded.last_seen`,
    [jid,name||"",now,now]);
}
async function logCommand(jid,cmd) {
  await run(`INSERT INTO command_log(jid,command,created_at) VALUES(?,?,?)`,
    [jid,cmd,Date.now()]);
  await run(`UPDATE users SET commands=commands+1,last_seen=? WHERE jid=?`,
    [Date.now(),jid]);
}
async function recentCount(jid,windowMs) {
  const row=await get(`SELECT COUNT(*) AS n FROM command_log WHERE jid=? AND created_at>=?`,
    [jid,Date.now()-windowMs]);
  return row?.n || 0;
}
async function isBlocked(jid) {
  return !!(await get(`SELECT jid FROM blocked WHERE jid=?`,[jid]));
}
async function block(jid,reason="") {
  await run(`INSERT OR REPLACE INTO blocked(jid,reason,created_at) VALUES(?,?,?)`,
    [jid,reason,Date.now()]);
}
async function unblock(jid) { await run(`DELETE FROM blocked WHERE jid=?`,[jid]); }
async function stats() {
  return {
    users:(await get(`SELECT COUNT(*) n FROM users`))?.n||0,
    commands:(await get(`SELECT COUNT(*) n FROM command_log`))?.n||0,
    blocked:(await get(`SELECT COUNT(*) n FROM blocked`))?.n||0
  };
}
module.exports={db,init,touchUser,logCommand,recentCount,isBlocked,block,unblock,stats};
