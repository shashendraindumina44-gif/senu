const axios = require('axios');

module.exports = {
    name: 'gagana',
    alias: ['news', 'puvath'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const newsImg = "https://i.postimg.cc/gjkQy2Kd/images-(9).jpg"; // අපේ Default Logo එක

        try {
            await sock.sendMessage(from, { react: { text: "📰", key: m.key } });

            // 1. Cyber Loading Animation
            let { key } = await sock.sendMessage(from, { 
                text: "📡 *CONNECTING TO GAGANA NEWS NODES...*" 
            }, { quoted: m });
            
            await new Promise(r => setTimeout(r, 800));
            await sock.sendMessage(from, { text: "📥 *FETCHING LATEST DATA PACKETS...*", edit: key });

            // 2. Fetching News Data
            const newsUrl = "https://saviya-kolla-api.koyeb.app/news/gagana";
            const response = await axios.get(newsUrl);
            const newsData = response.data;
            
            if (!newsData || !newsData.status || !newsData.result) {
                return await sock.sendMessage(from, { text: "❌ *ACCESS DENIED: No news found!*", edit: key });
            }
            
            const article = newsData.result;
            const imageUrl = article.image || newsImg;
            
            // 3. Bloody Rose Cyber UI
            let newsMessage = `🌹 *B L O O D Y  R O S E  I N T E L* 🌹\n\n`;
            newsMessage += `┏━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
            newsMessage += `┃ 📰 *TITLE:* ${article.title}\n`;
            newsMessage += `┃ 📅 *DATE:* ${article.date || "Just Now"}\n`;
            newsMessage += `┗━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
            
            newsMessage += `📝 *DESCRIPTION:*\n${article.desc || "No metadata available."}\n\n`;
            newsMessage += `🔗 *SOURCE:* ${article.url}\n\n`;
            newsMessage += `> *POWERED BY LORD INDUMINA* 🗣️`;

            // 4. Sending Final Output
            await sock.sendMessage(from, { delete: key });
            
            await sock.sendMessage(from, {
                image: { url: imageUrl },
                caption: newsMessage,
                contextInfo: {
                    externalAdReply: {
                        title: "G A G A N A  N E W S  F E E D",
                        body: "Bloody Rose Intelligence Agency",
                        mediaType: 1,
                        thumbnailUrl: imageUrl,
                        sourceUrl: article.url,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });

            await sock.sendMessage(from, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error("News API Error:", error.message);
            await sock.sendMessage(from, {
                text: "⚠️ *CRITICAL ERROR: Failed to breach news server!*"
            }, { quoted: m });
        }
    }
};