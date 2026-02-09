const axios = require('axios');

module.exports = {
    name: 'apk',
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const appName = args.join(" ");
        if (!appName) return m.reply("🌹 *Please provide an app name!*");

        try {
            await sock.sendMessage(from, { react: { text: "📦", key: m.key } });
            let { key } = await sock.sendMessage(from, { text: "🌹 *Searching APK Servers...*" });

            const res = await axios.get(`https://api.lolhuman.xyz/api/apksearch?apikey=643331db494f4757659b8670&query=${appName}`);
            const app = res.data.result[0];

            const apkMsg = `🌹 *B L O O D Y  R O S E  A P K*

┌──────────────┈
│ 📛 *Name:* ${app.name}
│ 📦 *Package:* ${app.id}
└──────────────┈

🚀 *Direct Link:*
${app.link}

> *Power By Lord Indumina 🩸*`;

            await sock.sendMessage(from, { text: apkMsg, edit: key });

        } catch (e) {
            m.reply("❌ *App not found!*");
        }
    }
};