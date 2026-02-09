const axios = require('axios');

module.exports = {
    name: 'trt',
    alias: ['translate', 'trans'],
    async execute(sock, m, { quoted, args }) {
        const from = m.key.remoteJid;
        
        // Reply කරපු text එක හෝ command එකත් එක්ක ගහපු text එක ගමු
        let text = m.quoted ? m.quoted.text : args.join(" ");
        let lang = args[0] ? args[0] : 'si'; // Default සිංහලට (si) පරිවර්තනය කරයි

        if (!text) return sock.sendMessage(from, { text: "🌹 *Please reply to a message or type text to translate!*" }, { quoted: m });

        try {
            // 1. Reaction
            await sock.sendMessage(from, { react: { text: "🔠", key: m.key } });

            // 2. Cyber Loading Animation
            let { key } = await sock.sendMessage(from, { text: "🌹 *Connecting to Google Translate...*" }, { quoted: m });
            
            const frames = [
                "🌹 *Analyzing Input Text...* 🔍",
                "🌹 *Detecting Language...* 🌐",
                "🌹 *Translating Data Stream...* ⚡",
                "🌹 *Finalizing Translation...* ✨"
            ];

            for (let frame of frames) {
                await new Promise(res => setTimeout(res, 400));
                await sock.sendMessage(from, { text: frame, edit: key });
            }

            // 3. API එකෙන් පරිවර්තනය ලබා ගැනීම
            const res = await axios.get(`https://api.lolhuman.xyz/api/translate/google?apikey=643331db494f4757659b8670&text=${encodeURIComponent(text)}&target=${lang}`);
            const translation = res.data.result;

            const transMsg = `🌹 *B L O O D Y  R O S E  T R A N S*

┌──────────────┈
│ 📥 *Input:* ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}
│ 📤 *Result:* ${translation}
│ 🌐 *Target Lang:* ${lang.toUpperCase()}
└──────────────┈

> *Power By Lord Indumina 🩸*`;

            // 4. Loading එක මකා අවසාන මැසේජ් එක යැවීම
            await sock.sendMessage(from, { delete: key });

            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: transMsg 
            }, { quoted: m });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: "❌ *Translation Failed! API might be down.*" });
        }
    }
};