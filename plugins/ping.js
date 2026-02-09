module.exports = {
    name: 'ping',
    async execute(sock, m, { quoted }) {
        const from = m.key.remoteJid;
        try {
            // 1. Reaction
            await sock.sendMessage(from, { react: { text: "⚡", key: m.key } });

            // 2. New Loading Animation
            let { key } = await sock.sendMessage(from, { text: "🌹 *B L O O D Y  R O S E  P I N G*" }, { quoted: quoted });
            
            const pings = [
                "🌹 *S Y S T E M  C H E C K . . .* 📶",
                "🌹 *D A T A  S C A N N I N G . . .* 🚀",
                "🌹 *P I N G  C O M P L E T E D !* ✨"
            ];

            const start = Date.now();
            for (let p of pings) {
                await new Promise(res => setTimeout(res, 400));
                await sock.sendMessage(from, { text: p, edit: key });
            }
            const end = Date.now();
            const pingTime = end - start;

            // 3. සැකසූ අවසාන මැසේජ් එක (Fixed Border)
            const pingMsg = `🌹 *B L O O D Y  R O S E  P I N G*

┌──────────────┈
│ ⚡ *Latency:* ${pingTime}ms
│ 💠 *Status:* Excellence
│ 🚀 *Speed:* Blazing Fast
└──────────────┈

> *Power By Lord Indumina 🩸*`;

            // 4. Loading එක මකා Image එක සමඟ යැවීම
            await sock.sendMessage(from, { delete: key });

            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: pingMsg 
            }, { quoted: quoted });

        } catch (error) {
            console.error("Ping Error:", error);
        }
    }
};