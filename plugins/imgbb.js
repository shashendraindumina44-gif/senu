const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: 'tourl',
    alias: ['imgurl', 'imgbb', 'url'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const apiKey = "02378e3c1f780b873e5aabc8fa8f2609";

        try {
            // 1. Media Identification
            const buffer = await m.download(); 
            
            if (!buffer) {
                return await sock.sendMessage(from, { 
                    text: "✨ *B L O O D Y  R O S E  S Y S T E M*\n\n🌹 _Master, please reply to an image to generate a secure cloud link._" 
                }, { quoted: m });
            }

            await sock.sendMessage(from, { react: { text: "⏳", key: m.key } });

            // 2. Stylish Loading
            let { key } = await sock.sendMessage(from, { 
                text: "🌹 *BLOODY ROSE CLOUD IS PROCESSING...*\n\n`Status:` ▒▒▒▒▒▒▒▒▒▒ 0%" 
            }, { quoted: m });

            // Fake Progress (ලස්සනට පේන්න)
            await new Promise(r => setTimeout(r, 500));
            await sock.sendMessage(from, { text: "🌹 *GENERATING SECURE LINK...*\n\n`Status:` ██████▒▒▒▒ 60%", edit: key });

            // 3. ImgBB Upload
            const form = new FormData();
            form.append('image', buffer.toString('base64'));

            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form, {
                headers: { ...form.getHeaders() }
            });

            const data = response.data.data;
            const url = data.url;

            // 4. Ultra Stylish UI Design
            let msg = `🌹 *B L O O D Y  R O S E  I N T E L* 🌹\n\n`;
            msg += `┌─⊷ *IMAGE DATA* ⊷\n`;
            msg += `┆ 📦 *FILE:* ${data.title || "VIP_IMAGE"}\n`;
            msg += `┆ 📂 *TYPE:* ${data.image.extension.toUpperCase()}\n`;
            msg += `┆ 📊 *SIZE:* ${(data.size / 1024).toFixed(2)} KB\n`;
            msg += `└───────────────⊷\n\n`;
            msg += `🔗 *SECURE URL:*\n${url}\n\n`;
            msg += `> *D E S I G N E D  B Y  L O R D  I N D U M I N A* 🗣️`;

            await sock.sendMessage(from, { delete: key });
            
            // 5. Final Output with Large Thumbnail & Web Reply
            await sock.sendMessage(from, {
                image: { url: url },
                caption: msg,
                contextInfo: {
                    externalAdReply: {
                        title: "B L O O D Y  R O S E  C L O U D",
                        body: "SUCCESSFULLY UPLOADED TO MAIN CLOUD",
                        mediaType: 1,
                        thumbnailUrl: url,
                        sourceUrl: url, // ලින්ක් එක ක්ලික් කළ විට වෙබ් එකට යයි
                        renderLargerThumbnail: false,
                        showAdAttribution: false
                    }
                }
            }, { quoted: m });

            await sock.sendMessage(from, { react: { text: "💎", key: m.key } });

        } catch (error) {
            console.error(error);
            await sock.sendMessage(from, { 
                text: "⚠️ *SYSTEM OVERLOAD:* Failed to breach ImgBB server. Try again!" 
            }, { quoted: m });
        }
    }
};