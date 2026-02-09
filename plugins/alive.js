const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'alive',
    async execute(sock, m, { ownerName, botName, quoted }) {
        const from = m.key.remoteJid;
        
        // 1. වීඩියෝ 3ක ලැයිස්තුව
        const videoFiles = ['./alive1.mp4', './alive2.mp4', './alive3.mp4'];
        
        // තිබෙන වීඩියෝ පමණක් තෝරා ගැනීම
        const availableVideos = videoFiles.filter(v => fs.existsSync(v));
        
        // Random ලෙස එකක් තෝරා ගැනීම
        const randomVideo = availableVideos.length > 0 
            ? availableVideos[Math.floor(Math.random() * availableVideos.length)] 
            : null;

        const imageUrl = 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg';

        // 2. Reaction (💉)
        await sock.sendMessage(from, { react: { text: "💉", key: m.key } });

        // 3. Loading Animation
        let { key } = await sock.sendMessage(from, { text: "🌹 *Bloody Rose System Loading...*" }, { quoted: m });

        const loadingBars = [
            "🌹 [▒▒▒▒▒▒▒▒▒▒] 0%",
            "🌹 [███▒▒▒▒▒▒▒] 40%",
            "🌹 [██████▒▒▒▒] 70%",
            "🌹 [██████████] 100%",
            "⚡ *System Injected Successfully!*"
        ];

        for (let bar of loadingBars) {
            await new Promise(res => setTimeout(res, 400));
            await sock.sendMessage(from, { text: bar, edit: key });
        }
        await sock.sendMessage(from, { delete: key });

        // 4. Send Random Video Note (PTV)
        if (randomVideo) {
            await sock.sendMessage(from, { 
                video: fs.readFileSync(randomVideo), 
                mimetype: 'video/mp4', 
                ptv: true 
            });
        } else {
            console.log("Error: alive1.mp4, alive2.mp4 or alive3.mp4 not found in main folder!");
        }

        // 5. Send Final Alive Image Message
        const finalMsg = `🌹 *BLOODY ROSE SUPREME IS ACTIVE* 🌹

✨ *Bot Name:* ${botName}
👤 *Owner:* ${ownerName}
⚙️ *Status:* Online & Secure

🌡️ *Engine:* v${require('@whiskeysockets/baileys/package.json').version}

> "The only way to escape the maze is to destroy it."`;

        await sock.sendMessage(from, { 
            image: { url: imageUrl },
            caption: finalMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "B L O O D Y  R O S E  S U P R E M E",
                    body: "Created by Indumina 💉",
                    mediaType: 1,
                    thumbnailUrl: imageUrl, 
                    sourceUrl: "https://github.com/Indumina",
                    showAdAttribution: false 
                }
            }
        }, { quoted: m });
    }
};