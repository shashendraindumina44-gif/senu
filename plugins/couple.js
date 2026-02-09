module.exports = {
    name: 'couple',
    async execute(sock, m, { isGroup, participants }) {
        if (!isGroup) return m.reply("🌹 *This is a Group Command!*");

        const member1 = participants[Math.floor(Math.random() * participants.length)];
        const member2 = participants[Math.floor(Math.random() * participants.length)];

        const coupleMsg = `🌹 *B L O O D Y  R O S E  C O U P L E*

┌──────────────┈
│ 💘 *Partner 1:* @${member1.id.split('@')[0]}
│ 💘 *Partner 2:* @${member2.id.split('@')[0]}
└──────────────┈

> *Matching Success! 🩸*`;

        await sock.sendMessage(m.key.remoteJid, { 
            text: coupleMsg, 
            mentions: [member1.id, member2.id] 
        }, { quoted: m });
    }
};