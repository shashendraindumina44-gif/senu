module.exports = {
    name: 'info',
    alias: ['about', 'botinfo'],
    async execute(sock, m, { ownerName, botName }) {
        const from = m.chat;
        
        try {
            await m.react("ℹ️");

            const infoText = `╭━━〔 ℹ️ *BOT INFORMATION* 〕━━┈
┃
┃ 🎀 *Name:* ${botName}
┃ 🎀 *Version:* 2.0.0
┃ 🎀 *Developer:* ${ownerName}
┃ 🎀 *Platform:* WhatsApp MD
┃ 🎀 *Library:* Baileys
┃ 🎀 *Language:* JavaScript (Node.js)
┃ 🎀 *Features:* 40+ Commands
┃
╰━━━━━━━━━━━━━━━━━━┈

📋 *Key Features:*
✅ AI Girlfriend Mode (Senuri)
✅ Interactive Buttons
✅ Media Downloaders
✅ ChatGPT Integration
✅ News & Weather
✅ Admin Tools
✅ Anime & Fun Commands

> *Made with 💖 by ${ownerName}*`;

            const buttons = [
                { buttonId: '.menu', buttonText: { displayText: '📜 MENU' }, type: 1 },
                { buttonId: '.owner', buttonText: { displayText: '👤 OWNER' }, type: 1 },
                { buttonId: '.alive', buttonText: { displayText: '🎀 ALIVE' }, type: 1 }
            ];

            await sock.sendMessage(from, {
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' },
                caption: infoText,
                footer: 'Senuri Bot V2.0 - Enhanced Edition',
                buttons: buttons,
                headerType: 4,
                contextInfo: {
                    externalAdReply: {
                        title: "S E N U R I  I N F O",
                        body: "WhatsApp Bot by " + ownerName,
                        mediaType: 1,
                        thumbnailUrl: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg',
                        sourceUrl: "https://github.com/Indumina",
                        showAdAttribution: true
                    }
                }
            }, { quoted: m });

        } catch (error) {
            console.error("Info Error:", error);
            await m.reply("❌ තොරතුරු ගැනීමේදී දෝෂයක් සිදුවිය!");
        }
    }
};
