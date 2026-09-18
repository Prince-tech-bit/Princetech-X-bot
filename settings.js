// Princetech-X Bot settings
module.exports = {
  botname: process.env.BOT_NAME || "PRINCETECH-X BOT",
  ownername: process.env.OWNER_NAME || "Princetech",
  owner: (process.env.OWNER_NUMBER || "").replace(/\D/g, ""),
  prefix: process.env.PREFIX || ".",
  groupLink: "https://chat.whatsapp.com/FmFVTjGTf1hB0GXpyG0KQL",
  port: Number(process.env.PORT || 3000),
  // Safety defaults: conservative limits to reduce spam-like behavior.
  rateLimit: {
    windowMs: 60_000,
    maxCommands: 20
  }
};
