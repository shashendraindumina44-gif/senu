const axios = require('axios');

module.exports = {
    name: 'jilhubdl',
    alias: ['jdl', 'jdown'],
    category: 'nsfw',
    async execute(sock, m, args) {
        const from = m.key.remoteJid;
        
        // Command එකෙන් හෝ Reply එකකින් URL එක ගන්නවා
        let url = args[0] || (m.quoted ? (m.quoted.text || m.quoted.caption) : "");
        const apikey = "Dew_MkZcn7NncvF4aJ3BiraU5dcLvCeAuU6Mv3JGUgXk";

        if (!url || !url.includes('jilhub.org')) {
            return sock.sendMessage(from, { text: "🌹 *BLOODY ROSE:* Master, කරුණාකර වලංගු JilHub ලින්ක් එකක් ලබා දෙන්න!" });
        }

        try {
            await sock.sendMessage(from, { react: { text: "📥", key: m.key } });
            const { key } = await sock.sendMessage(from, { text: "🚀 *JILHUB CORE:* වීඩියෝව සූදානම් කරමින් පවතී..." });

            // 🌐 පරණ Direct Download API Request එක
            const apiUrl = `https://api.srihub.store/nsfw/jilhubdl?url=${encodeURIComponent(url)}&apikey=${apikey}`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data.status && data.result) {
                await sock.sendMessage(from, { text: "🛰️ *SATELLITE SYNC:* වීඩියෝව අප්ලෝඩ් වෙමින් පවතී...", edit: key });

                await sock.sendMessage(from, {
                    video: { url: data.result },
                    caption: `✅ *JILHUB DOWNLOADER*\n\n📌 *TITLE:* ${data.title || 'Untitled'}\n\n> 🌹 *BLOODY ROSE CORE*`,
                    mimetype: 'video/mp4'
                }, { quoted: m });

                await sock.sendMessage(from, { delete: key });
                await sock.sendMessage(from, { react: { text: "✅", key: m.key } });
            } else {
                throw new Error("වීඩියෝව ලබා ගැනීමට නොහැකි විය.");
            }

        } catch (error) {
            await sock.sendMessage(from, { text: `❌ *ERROR:* ${error.message}` });
        }
    }
};