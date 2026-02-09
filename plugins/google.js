const axios = require('axios');

module.exports = {
    name: 'google',
    alias: ['g', 'search'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const text = args.join(" ");
        const defaultImg = "https://i.postimg.cc/gjkQy2Kd/images-(9).jpg"; // බොට් ලෝගෝ එක
        const apiKey = "67b769f945d2c940c65387a432437ca242fd4eda1dcf8722572e9640d687722a"; // ඔයාගේ SerpApi Key එක

        if (!text) return await sock.sendMessage(from, { text: "🌹 *Master, what should I search on Google?*" }, { quoted: m });

        try {
            // 1. Reaction
            await sock.sendMessage(from, { react: { text: "🔍", key: m.key } });

            // 2. මුලින්ම පින්තූරය සහිත Loading මැසේජ් එක යවනවා
            let { key } = await sock.sendMessage(from, { 
                image: { url: defaultImg }, 
                caption: "🌀 *Searching Intelligence Nodes...*" 
            }, { quoted: m });

            // 3. SerpApi එකෙන් දත්ත ලබා ගැනීම
            const url = `https://serpapi.com/search.json?q=${encodeURIComponent(text)}&hl=en&gl=us&api_key=${apiKey}`;
            const response = await axios.get(url);
            const results = response.data.organic_results;

            if (!results || results.length === 0) {
                return await sock.sendMessage(from, { text: "❌ *No information found!*", edit: key });
            }

            // 4. රිසල්ට් එකතු කිරීම
            let finalMsg = `🌐 *G O O G L E  S E A R C H  R E S U L T S*\n\n`;
            for (let i = 0; i < Math.min(results.length, 3); i++) {
                const res = results[i];
                finalMsg += `*0${i + 1}. ${res.title}*\n`;
                finalMsg += `📝 ${res.snippet || "No info available."}\n`;
                finalMsg += `🔗 ${res.link}\n\n`;
            }
            finalMsg += `> *B L O O D Y  R O S E  S U P R E M E 💉🌹*`;

            // 5. සර්ච් රිසල්ට් එකේ පින්තූරය තිබේ නම් එය ලබා ගැනීම
            const mainImg = results[0].thumbnail || defaultImg;

            // 6. කලින් යවපු පින්තූරය සහිත මැසේජ් එක Edit කිරීම
            // සටහන: පින්තූරය Edit කරන්න බැරි නිසා, අපි Caption එක විතරක් Edit කරලා රිසල්ට් එක පෙන්වමු.
            // වඩාත් ලස්සන ක්‍රමය වෙන්නේ රිසල්ට් එක ලැබුණාම අලුත් පින්තූරයක් සමඟ මැසේජ් එක යැවීමයි.
            
            await sock.sendMessage(from, { delete: key }); // පැරණි පින්තූරය මකනවා

            await sock.sendMessage(from, {
                image: { url: mainImg },
                caption: finalMsg,
                contextInfo: {
                    externalAdReply: {
                        title: results[0].title,
                        body: "Supreme Search Results",
                        mediaType: 1,
                        thumbnailUrl: mainImg,
                        sourceUrl: results[0].link,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });

            await sock.sendMessage(from, { react: { text: "✅", key: m.key } });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: "⚠️ *Search Node Error!*" });
        }
    }
};