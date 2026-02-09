const axios = require('axios');

module.exports = {
    name: 'wiki',
    alias: ['wikipedia', 'search'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const query = args.join(' ');
        const botImg = "https://i.postimg.cc/gjkQy2Kd/images-(9).jpg";

        if (!query) {
            return await sock.sendMessage(from, { 
                text: "🌹 *B L O O D Y  R O S E  W I K I*\n\n_Master, what should I investigate?_\n`Example: .wiki Sri Lanka`" 
            }, { quoted: m });
        }

        try {
            await sock.sendMessage(from, { react: { text: "🔍", key: m.key } });

            // --- Fancy Loading Animation ---
            let { key } = await sock.sendMessage(from, { text: "🌹 *BLOODY ROSE: INITIALIZING...*" }, { quoted: m });
            
            await new Promise(resolve => setTimeout(resolve, 500));
            await sock.sendMessage(from, { text: "🌹 *SEARCHING ARCHIVES...*\n\n[████▒▒▒▒▒▒] 40%", edit: key });

            // Wikipedia එකෙන් හරියටම නම හොයාගන්න Search API එක පාවිච්චි කරනවා
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
            const searchRes = await axios.get(searchUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            if (!searchRes.data.query.search.length) {
                return await sock.sendMessage(from, { text: "⚠️ *ERROR:* No information found!", edit: key });
            }

            const title = searchRes.data.query.search[0].title;

            // 1. Fetching English Summary
            const enRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const enData = enRes.data;

            await sock.sendMessage(from, { text: "🌹 *PROCESSING DATA...*\n\n[████████▒▒] 80%", edit: key });

            // 2. Fetching Sinhala Summary (Title එක සිංහලෙන් සෙවීමට උත්සාහ කරයි)
            let siData = null;
            try {
                const siRes = await axios.get(`https://si.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`, {
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                siData = siRes.data;
            } catch (e) { siData = null; }

            await sock.sendMessage(from, { text: "🌹 *DECRYPTING COMPLETE!*", edit: key });
            await new Promise(resolve => setTimeout(resolve, 500));
            await sock.sendMessage(from, { delete: key });

            // --- Message 1: English ---
            let enMsg = `🌹 *B L O O D Y  R O S E  W I K I* (EN) 🌹\n\n`;
            enMsg += `┌─⊷ *TOPIC:* ${enData.title}\n`;
            enMsg += `┆\n`;
            enMsg += `┆ 📝 *SUMMARY:* \n${enData.extract}\n`;
            enMsg += `┆\n`;
            enMsg += `┆ 🔗 *READ MORE:* \n${enData.content_urls.mobile.page}\n`;
            enMsg += `└───────────────⊷`;

            const enImg = (enData.thumbnail && enData.thumbnail.source) ? enData.thumbnail.source : botImg;

            await sock.sendMessage(from, {
                image: { url: enImg },
                caption: enMsg,
                contextInfo: {
                    externalAdReply: {
                        title: "ENGLISH WIKIPEDIA",
                        body: enData.title,
                        mediaType: 1,
                        thumbnailUrl: botImg,
                        sourceUrl: enData.content_urls.mobile.page,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });

            // --- Message 2: Sinhala (වැඩ කරන්නේ සිංහල ලිපියක් තිබුණොත් පමණි) ---
            if (siData && siData.extract && siData.type !== 'no-extract') {
                let siMsg = `🌹 *B L O O D Y  R O S E  W I K I* (SI) 🌹\n\n`;
                siMsg += `┌─⊷ *මාතෘකාව:* ${siData.title}\n`;
                siMsg += `┆\n`;
                siMsg += `┆ 📝 *සාරාංශය:* \n${siData.extract}\n`;
                siMsg += `┆\n`;
                siMsg += `┆ 🔗 *වැඩිදුර කියවීමට:* \n${siData.content_urls.mobile.page}\n`;
                siMsg += `└───────────────⊷\n\n`;
                siMsg += `> *POWERED BY LORD INDUMINA* 🗣️`;

                const siImg = (siData.thumbnail && siData.thumbnail.source) ? siData.thumbnail.source : botImg;

                await sock.sendMessage(from, {
                    image: { url: siImg },
                    caption: siMsg,
                    contextInfo: {
                        externalAdReply: {
                            title: "සිංහල විකිපීඩියා",
                            body: siData.title,
                            mediaType: 1,
                            thumbnailUrl: botImg,
                            sourceUrl: siData.content_urls.mobile.page,
                            renderLargerThumbnail: false
                        }
                    }
                });
            } else {
                await sock.sendMessage(from, { text: "⚠️ *NOTE:* This topic does not have a Sinhala article." });
            }

            await sock.sendMessage(from, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error(error);
            await sock.sendMessage(from, { text: "⚠️ *CRITICAL ERROR:* Access Denied or Connection Timeout." }, { quoted: m });
        }
    }
};