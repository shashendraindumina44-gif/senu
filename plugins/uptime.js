module.exports = {
    name: 'uptime',
    async execute(sock, m, { quoted }) {
        const from = m.chat;
        try {
            await m.react("⏳");

            let { key } = await sock.sendMessage(from, { text: "🎀 *Fetching Runtime...*" }, { quoted: m });
            
            const runtime = process.uptime();
            const days = Math.floor(runtime / 86400);
            const hours = Math.floor((runtime % 86400) / 3600);
            const mins = Math.floor((runtime % 3600) / 60);

            const uptimeMsg = `🎀 *S E N U R I  U P T I M E*

┌──────────────┈
│ 💠 *Days:* ${days}d
│ 💠 *Hours:* ${hours}h
│ 💠 *Minutes:* ${mins}m
│ 💠 *Status:* Online ⭕
└──────────────┈

> *Powered By Indumina 💖*`;

            await new Promise(res => setTimeout(res, 600));
            await sock.sendMessage(from, { delete: key });
            
            const buttons = [
                { buttonId: '.system', buttonText: { displayText: '⚙️ SYSTEM' }, type: 1 },
                { buttonId: '.menu', buttonText: { displayText: '📜 MENU' }, type: 1 }
            ];

            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: uptimeMsg,
                footer: 'Senuri Bot V2.0',
                buttons: buttons,
                headerType: 4
            }, { quoted: m });

        } catch (e) { 
            console.log(e);
            await m.reply("❌ Uptime තොරතුරු ගැනීමේදී දෝෂයක් සිදුවිය!");
        }
    }
};