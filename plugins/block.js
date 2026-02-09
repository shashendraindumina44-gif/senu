module.exports = {
    name: 'block',
    async execute(sock, m, { quoted }) {
        const from = m.key.remoteJid;
        
        try {
            // 1. බ්ලොක් කළ යුතු පුද්ගලයා කවුදැයි තෝරා ගැනීම
            let user = m.quoted ? m.quoted.sender : m.mentionedJid[0] ? m.mentionedJid[0] : false;
            
            if (!user) {
                return await sock.sendMessage(from, { text: "🌹 *Please reply to a user or tag them to block!*" }, { quoted: m });
            }

            // 2. Reaction
            await sock.sendMessage(from, { react: { text: "🚫", key: m.key } });

            // 3. Cyber Loading Animation
            let { key } = await sock.sendMessage(from, { text: "🌹 *Initializing Block Protocol...*" }, { quoted: m });
            
            const frames = [
                "🌹 *Accessing Firewall...* 🛡️",
                "🌹 *Terminating Connection...* ⚡",
                "🌹 *User Blacklisted Successfully!* 💀"
            ];

            for (let frame of frames) {
                await new Promise(res => setTimeout(res, 500));
                await sock.sendMessage(from, { text: frame, edit: key });
            }

            // 4. ඇත්තටම Block කිරීම
            await sock.updateBlockStatus(user, "block");

            const blockMsg = `🌹 *B L O O D Y  R O S E  B L O C K*

┌──────────────┈
│ 👤 *User:* @${user.split('@')[0]}
│ 🛡️ *Status:* Restricted
│ 🚫 *Action:* Permanent Block
└──────────────┈

> *Power By Lord Indumina 🩸*`;

            // 5. Loading එක මකා අවසාන පණිවිඩය යැවීම
            await sock.sendMessage(from, { delete: key });

            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: blockMsg,
                mentions: [user]
            }, { quoted: m });

        } catch (error) {
            console.error("Block Error:", error);
            await sock.sendMessage(from, { text: "❌ *Failed to block the user!*" });
        }
    }
};