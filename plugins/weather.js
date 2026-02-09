const axios = require('axios');

module.exports = {
    name: 'weather',
    alias: ['temp', 'kalguna'],
    async execute(sock, m, { quoted, args }) {
        const from = m.key.remoteJid;
        const city = args.join(" ");

        if (!city) return sock.sendMessage(from, { text: "🌹 *Please provide a city name!* \nExample: `.weather Colombo`" }, { quoted: m });

        try {
            // 1. Reaction
            await sock.sendMessage(from, { react: { text: "☁️", key: m.key } });

            // 2. Cyber Scanning Animation
            let { key } = await sock.sendMessage(from, { text: "🌹 *Locating Satellite Connection...*" }, { quoted: m });
            
            const frames = [
                "🌹 *Scanning Atmospheric Pressure...* 🌡️",
                "🌹 *Analyzing Humidity Levels...* 💧",
                "🌹 *Fetching Real-time Data...* 📡",
                "🌹 *Weather Report Finalized!* ✨"
            ];

            for (let frame of frames) {
                await new Promise(res => setTimeout(res, 400));
                await sock.sendMessage(from, { text: frame, edit: key });
            }

            // 3. API එකෙන් දත්ත ලබා ගැනීම
            const res = await axios.get(`https://api.lolhuman.xyz/api/weather/${encodeURIComponent(city)}?apikey=643331db494f4757659b8670`);
            const d = res.data.result;

            if (!d) throw new Error("City not found");

            const weatherMsg = `🌹 *B L O O D Y  R O S E  W E A T H E R*

┌──────────────┈
│ 🏙️ *City:* ${d.name}, ${d.country}
│ 🌡️ *Temp:* ${d.temp}°C
│ ☁️ *Condition:* ${d.weather}
│ 💨 *Wind:* ${d.wind} km/h
│ 💧 *Humidity:* ${d.humidity}%
└──────────────┈

> *Power By Lord Indumina 🩸*`;

            // 4. Loading මැසේජ් එක මකා අවසාන පණිවිඩය යැවීම
            await sock.sendMessage(from, { delete: key });

            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: weatherMsg 
            }, { quoted: m });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: "❌ *Could not find weather data for this city!*" });
        }
    }
};