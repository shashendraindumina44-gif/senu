module.exports = {
    name: 'glink',
    async execute(sock, m) {
        if (!m.key.remoteJid.endsWith('@g.us')) return m.reply("🌹 *Group only!*");
        
        let { key } = await sock.sendMessage(m.key.remoteJid, { text: "🌹 *Requesting Invite Data...*" });
        await new Promise(res => setTimeout(res, 600));
        await sock.sendMessage(m.key.remoteJid, { text: "🌹 *Decoding Encrypted Link...* 🔐", edit: key });

        try {
            const code = await sock.groupInviteCode(m.key.remoteJid);
            const response = `🌹 *G R O U P  L I N K  F O U N D*\n\nhttps://chat.whatsapp.com/${code}\n\n> *Power By Lord Indumina 🩸*`;
            await sock.sendMessage(m.key.remoteJid, { text: response, edit: key });
        } catch (e) {
            await sock.sendMessage(m.key.remoteJid, { text: "❌ *Failed! Bot is not an Admin.*", edit: key });
        }
    }
};