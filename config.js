// Optional local configuration.
// Prefer environment variables in production.
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "",
  ownername: process.env.OWNER_NAME || "Princetech",
  botname: process.env.BOT_NAME || "PRINCETECH-X BOT",
  prefa: [process.env.PREFIX || "."],
  owner: process.env.OWNER_NUMBER ? [process.env.OWNER_NUMBER.replace(/\D/g, "")] : []
};
