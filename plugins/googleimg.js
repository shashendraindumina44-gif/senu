const axios = require('axios');

module.exports = {
    name: 'gimage',
    alias: ['img', 'image'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const text = args.join(" ");
        const apiKey = "67b769f945d2c940c65387a432437ca242fd4eda1dcf8722572e9640d687722a"; // ඔයාගේ SerpApi Key එක මෙතනට දාන්න

        if (!text) return await sock.sendMessage(from, { text: "🌹 *Master, what image should I search for?*" }, { quoted: m });

        try {
            // 1. Reaction
            await sock.sendMessage(from, { react: { text: "🖼️", key: m.key } });

            // 2. Animated Loading
            let { key } = await sock.sendMessage(from, { text: "🌀 *Searching for Images...*" }, { quoted: m });
            
            const frames = ["⌛", "⏳", "⌛", "⏳"];
            const loader = setInterval(async () => {
                const frame = frames[Math.floor(Math.random() * frames.length)];
                await sock.sendMessage(from, { text: `${frame} *Extracting Visual Data...*`, edit: key });
            }, 800);

            // 3. SerpApi Image Search Request
            const url = `https://serpapi.com/search.json?q=${encodeURIComponent(text)}&tbm=isch&api_key=${apiKey}`;
            const response = await axios.get(url);
            
            clearInterval(loader);
            const results = response.data.images_results;

            if (!results || results.length === 0) {
                return await sock.sendMessage(from, { text: "❌ *No images found for this query!*", edit: key });
            }

            // Loading මැසේජ් එක මකනවා
            await sock.sendMessage(from, { delete: key });

            // 4. මුල් පින්තූර 5ක් යැවීම (වැඩිපුර යැව්වොත් Spam වෙන්න පුළුවන්)
            for (let i = 0; i < Math.min(results.length, 10); i++) {
                const imgUrl = results[i].original; // High quality image link

                await sock.sendMessage(from, { 
                    image: { url: imgUrl },
                    caption: `🖼️ *Result:* ${i + 1}\n🔍 *Query:* ${text}\n> *B L O O D Y  R O S E 💉🌹*`
                }, { quoted: m });

                // පින්තූර එකපාර වැටෙන්නේ නැතිව පිළිවෙළට එන්න පොඩි විරාමයක්
                await new Promise(r => setTimeout(r, 1000));
            }

            await sock.sendMessage(from, { react: { text: "✅", key: m.key } });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: "⚠️ *Image search failed! Check API key.*" });
        }
    }
};