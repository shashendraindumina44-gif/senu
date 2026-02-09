const axios = require('axios');
const yts = require('yt-search');

module.exports = {
    name: 'song',
    alias: ['audio', 'play'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const text = args.join(" ");

        if (!text) return await sock.sendMessage(from, { text: "🌹 *Master, give me a name!*" }, { quoted: m });

        try {
            await sock.sendMessage(from, { react: { text: "🔍", key: m.key } });

            const search = await yts(text);
            const video = search.videos[0];

            if (!video) return await sock.sendMessage(from, { text: "❌ *Not found!*" }, { quoted: m });

            await sock.sendMessage(from, { 
                image: { url: video.thumbnail }, 
                caption: `🎶 *Downloading:* ${video.title}\n\n> *B L O O D Y  R O S E  V8*` 
            }, { quoted: m });

            // Vercel එක block නිසා අපි කෙලින්ම download node එකකට යනවා
            const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp3?url=${encodeURIComponent(video.url)}`;
            const response = await axios.get(apiUrl);
            
            // API response structure එක අනුව මෙය වෙනස් විය හැක
            const dlLink = response.data.result.download_url;

            await sock.sendMessage(from, { 
                audio: { url: dlLink }, 
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`
            }, { quoted: m });

            await sock.sendMessage(from, { react: { text: "✅", key: m.key } });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: "⚠️ *Vercel API is blocked by Cloudflare. Please wait for the IP reset!*" }, { quoted: m });
        }
    }
};