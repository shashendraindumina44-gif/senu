module.exports = {
    name: 'system',
    async execute(sock, m, { quoted }) {
        const from = m.chat;
        try {
            await m.react("⚙️");

            let { key } = await sock.sendMessage(from, { text: "🎀 *System Initializing...*" }, { quoted: m });
            
            const frames = ["🎀 *Scanning...*", "🎀 *Verifying Senuri...*"];
            for (let frame of frames) {
                await new Promise(res => setTimeout(res, 500));
                await sock.sendMessage(from, { text: frame, edit: key });
            }

            const runtime = process.uptime();
            const hrs = Math.floor(runtime / 3600);
            const mins = Math.floor((runtime % 3600) / 60);
            const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

            const systemMsg = `🎀 *S E N U R I  S Y S T E M*

┌──────────────┈
│ 💿 *RAM:* ${memory} MB
│ ⏳ *Uptime:* ${hrs}h ${mins}m
│ 🧬 *Platform:* ${process.platform}
│ ⚙️ *Engine:* Node.js ${process.version}
└──────────────┈

> *Powered By Indumina 💖*`;

            await sock.sendMessage(from, { delete: key });
            
            const buttons = [
                { buttonId: '.menu', buttonText: { displayText: '📜 MENU' }, type: 1 },
                { buttonId: '.ping', buttonText: { displayText: '⚡ PING' }, type: 1 }
            ];

            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: systemMsg,
                footer: 'Senuri Bot V2.0',
                buttons: buttons,
                headerType: 4
            }, { quoted: m });

        } catch (e) { 
            console.log(e);
            await m.reply("❌ System තොරතුරු ගැනීමේදී දෝෂයක් සිදුවිය!");
        }
    }
};