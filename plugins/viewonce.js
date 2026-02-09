module.exports = {
    name: 'vo',
    alias: ['viewonce', 'vv'],
    async execute(sock, m, { quoted }) {
        const from = m.key.remoteJid;

        try {
            // 1. View Once මැසේජ් එකක්ද කියලා පරීක්ෂා කිරීම
            if (!m.quoted || !m.quoted.viewOnceMessageV2) {
                return await sock.sendMessage(from, { text: "🌹 *Please reply to a View Once message!*" }, { quoted: m });
            }

            // 2. Reaction
            await sock.sendMessage(from, { react: { text: "👁️‍🗨️", key: m.key } });

            // 3. Cyber Loading Animation
            let { key } = await sock.sendMessage(from, { text: "🌹 *B L O O D Y  R O S E  V I E W*" }, { quoted: m });
            
            const frames = [
                "🌹 *Bypassing View-Once Lock...* 🔓",
                "🌹 *Downloading Media Buffer...* 📥",
                "🌹 *Decoding Cyber Encryption...* 🧬",
                "🌹 *SUCCESS! Media Retrieved.* ✅"
            ];

            for (let frame of frames) {
                await new Promise(res => setTimeout(res, 400));
                await sock.sendMessage(from, { text: frame, edit: key });
            }

            // 4. Media එක Download කරගැනීම
            const buffer = await m.quoted.download();
            const type = Object.keys(m.quoted.message)[0]; // imageMessage හෝ videoMessage

            const voMsg = `🌹 *B L O O D Y  R O S E  V I E W*

┌──────────────┈
│ 👤 *From:* @${m.quoted.sender.split('@')[0]}
│ 📦 *Type:* ${type === 'imageMessage' ? 'Photo' : 'Video'}
│ 🛡️ *Status:* Decrypted
└──────────────┈

> *Power By Lord Indumina 🩸*`;

            // 5. Loading එක මකා Media එක යැවීම
            await sock.sendMessage(from, { delete: key });

            if (type === 'imageMessage') {
                await sock.sendMessage(from, { 
                    image: buffer, 
                    caption: voMsg, 
                    mentions: [m.quoted.sender] 
                }, { quoted: m });
            } else if (type === 'videoMessage') {
                await sock.sendMessage(from, { 
                    video: buffer, 
                    caption: voMsg, 
                    mentions: [m.quoted.sender] 
                }, { quoted: m });
            }

        } catch (error) {
            console.error("ViewOnce Error:", error);
            await sock.sendMessage(from, { text: "❌ *Failed to retrieve media!*" });
        }
    }
};