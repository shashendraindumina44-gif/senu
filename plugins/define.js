const axios = require('axios');

module.exports = {
    name: 'define',
    alias: ['meaning', 'dict'],
    async execute(sock, m, { quoted, args }) {
        const from = m.key.remoteJid;
        const word = args[0];

        if (!word) return sock.sendMessage(from, { text: "🌹 *Provide a word to define!*" }, { quoted: m });

        try {
            await sock.sendMessage(from, { react: { text: "📖", key: m.key } });
            
            const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = res.data[0];
            const definition = data.meanings[0].definitions[0].definition;

            const dictMsg = `🌹 *B L O O D Y  R O S E  D I C T*

┌──────────────┈
│ 📚 *Word:* ${word}
│ 📖 *Meaning:* ${definition}
└──────────────┈

> *Power By Lord Indumina 🩸*`;

            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: dictMsg 
            }, { quoted: m });

        } catch (e) {
            await sock.sendMessage(from, { text: "❌ *Word not found!*" });
        }
    }
};