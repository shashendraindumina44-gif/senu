const axios = require('axios');

module.exports = {
    name: 'news',
    alias: ['intel', 'breaking'],
    async execute(sock, m, args) {
        const from = m.key.remoteJid;
        const apiKey = "pub_446bbd4f70d74039915161557e0fe311"; // ඔයාගේ API Key එක
        const botImg = "https://i.postimg.cc/gjkQy2Kd/images-(9).jpg"; // ඔයාගේ පින්තූරය

        try {
            // 1. Cyber Loading Animation
            const { key } = await sock.sendMessage(from, { text: "🌹 *INFILTRATING LATEST INTELLIGENCE NODES...*" });
            await new Promise(r => setTimeout(r, 800));

            // 2. Fetch News (Sri Lanka - Latest 1)
            const newsUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=srilanka&language=en`;
            const response = await axios.get(newsUrl);
            
            if (!response.data || response.data.results.length === 0) {
                return await sock.sendMessage(from, { text: "❌ *DATABASE EMPTY: No recent news found!*", edit: key });
            }
            
            // අලුත්ම පුවත පමණක් තෝරා ගැනීම
            const article = response.data.results[0]; 
            
            // 3. Cyber UI Construction
            let newsMessage = `⚡ *B L O O D Y  R O S E  L A T E S T* ⚡\n\n`;
            newsMessage += `┏━━━━━━━━━━━━━━━━━━━━┓\n`;
            newsMessage += `  🔴 *BREAKING:* ${article.title.toUpperCase()}\n`;
            newsMessage += `┗━━━━━━━━━━━━━━━━━━━━┛\n\n`;
            
            newsMessage += `📝 *BRIEF:* \n${article.description || "Details are currently encrypted."}\n\n`;
            newsMessage += `📅 *SOURCE:* ${article.source_id.toUpperCase()}\n`;
            newsMessage += `🔗 *FULL STORY:* ${article.link}\n\n`;
            newsMessage += `> 🌹 *STAY ALERT. STAY BLOODY.*`;

            // 4. Send Message with Large Thumbnail & Ad Reply
            await sock.sendMessage(from, { delete: key });
            
            await sock.sendMessage(from, {
                image: { url: article.image_url || botImg },
                caption: newsMessage,
                contextInfo: {
                    externalAdReply: {
                        title: "L A T E S T  I N T E L  F E E D",
                        body: "Cyber Core: Lord Indumina",
                        mediaType: 1,
                        thumbnailUrl: botImg, 
                        sourceUrl: article.link,
                        renderLargerThumbnail: true, // මේකෙන් තමයි Spotify එකේ වගේ ලොකුවට පින්තූරය පේන්නේ
                        showAdAttribution: false
                    }
                }
            }, { quoted: m });

        } catch (error) {
            console.error("News Error:", error);
            await sock.sendMessage(from, { text: "⚠️ *CRITICAL SYSTEM FAILURE: Feed Blocked!*" });
        }
    }
};