const axios = require('axios');

module.exports = {
    name: 'ss',
    alias: ['screenshot', 'webss'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const url = args[0];
        const botImg = "https://i.postimg.cc/gjkQy2Kd/images-(9).jpg"; // අපේ බොට්ගේ පින්තූරය

        if (!url) {
            return await sock.sendMessage(from, { 
                text: "🌹 *B L O O D Y  R O S E  S Y S T E M*\n\n_Master, please provide a web address._\n`Example: .ss https://google.com`" 
            }, { quoted: m });
        }

        try {
            await sock.sendMessage(from, { react: { text: "🔍", key: m.key } });

            // 1. Cyber Animation (Step-by-Step Loading)
            let { key } = await sock.sendMessage(from, { 
                text: "🌹 *INITIATING WEB INFILTRATION...*\n\n`Status:` ▒▒▒▒▒▒▒▒▒▒ 0%" 
            }, { quoted: m });

            await new Promise(r => setTimeout(r, 600));
            await sock.sendMessage(from, { text: "🌹 *BYPASSING FIREWALLS...*\n\n`Status:` █████▒▒▒▒▒ 50%", edit: key });

            const ssUrl = `https://image.thum.io/get/width/1200/crop/800/fullpage/${url}`;

            await new Promise(r => setTimeout(r, 600));
            await sock.sendMessage(from, { text: "🌹 *SUCCESSFULLY BREACHED! CAPTURING DATA...*\n\n`Status:` ██████████ 100%", edit: key });

            // 2. Stylish UI Design
            let caption = `🌹 *B L O O D Y  R O S E  I N T E L* 🌹\n\n`;
            caption += `┌─⊷ *WEB REPORT* ⊷\n`;
            caption += `┆ 🌐 *SOURCE:* ${url}\n`;
            caption += `┆ ⏱️ *TIME:* ${new Date().toLocaleString()}\n`;
            caption += `┆ ✅ *STATUS:* Captured\n`;
            caption += `└───────────────⊷\n\n`;
            caption += `> *D E S I G N E D  B Y  L O R D  I N D U M I N A* 🗣️`;

            await sock.sendMessage(from, { delete: key });

            // 3. Final Output with Bot Image in Preview
            await sock.sendMessage(from, {
                image: { url: ssUrl },
                caption: caption,
                contextInfo: {
                    externalAdReply: {
                        title: "B L O O D Y  R O S E  W E B  V I E W",
                        body: "Intelligence Successfully Captured",
                        mediaType: 1,
                        thumbnailUrl: botImg, // මෙතනට බොට්ගේ පින්තූරය වැටෙනවා
                        sourceUrl: url,
                        renderLargerThumbnail: false,
                        showAdAttribution: false
                    }
                }
            }, { quoted: m });

            await sock.sendMessage(from, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error(error);
            await sock.sendMessage(from, { 
                text: "⚠️ *SYSTEM FAILURE:* Failed to capture the target. Check the URL!" 
            }, { quoted: m });
        }
    }
};