const os = require('os');

module.exports = {
    name: 'platform',
    alias: ['plat', 'serverinfo'],
    async execute(sock, m, { quoted }) {
        const from = m.key.remoteJid;

        try {
            // 1. Reaction
            await sock.sendMessage(from, { react: { text: "🧬", key: m.key } });

            // 2. Cyber Animation
            let { key } = await sock.sendMessage(from, { text: "🌹 *Scanning Server Hardware...*" }, { quoted: quoted });
            
            const frames = [
                "🌹 *Analyzing OS Kernel...* 🛡️",
                "🌹 *Fetching CPU Specs...* ⚙️",
                "🌹 *Bloody Rose System Report Ready!* ✨"
            ];

            for (let frame of frames) {
                await new Promise(res => setTimeout(res, 400));
                await sock.sendMessage(from, { text: frame, edit: key });
            }

            // 3. සර්වර් දත්ත ලබා ගැනීම
            const platform = os.platform(); // linux, win32 etc
            const arch = os.arch(); // x64, arm64
            const cpu = os.cpus()[0].model; // Processor name
            const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2); // Total RAM in GB
            const nodeVer = process.version; // Node.js version

            const platMsg = `🌹 *B L O O D Y  R O S E  P L A T F O R M*

┌──────────────┈
│ 🧬 *OS:* ${platform} (${arch})
│ ⚙️ *CPU:* ${cpu}
│ 💿 *Total RAM:* ${ramTotal} GB
│ 📦 *Node:* ${nodeVer}
│ 🛡️ *Status:* Operational
└──────────────┈

> *Power By Lord Indumina 🩸*`;

            // 4. Loading එක මකා අවසාන පණිවිඩය යැවීම
            await sock.sendMessage(from, { delete: key });

            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: platMsg 
            }, { quoted: quoted });

        } catch (error) {
            console.error(error);
            await sock.sendMessage(from, { text: "❌ *Failed to fetch platform info!*" });
        }
    }
};