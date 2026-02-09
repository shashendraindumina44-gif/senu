const axios = require('axios');

module.exports = {
    name: 'ai',
    alias: ['chat', 'rose', 'ask'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const text = args.join(' ');
        const apiKey = "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";

        if (!text) {
            return await sock.sendMessage(from, { 
                text: "🌹 *B L O O D Y  R O S E  A I*\n\n_Master, I am online. How can I assist you today?_" 
            }, { quoted: m });
        }

        try {
            await sock.sendMessage(from, { react: { text: "🧠", key: m.key } });

            // 1. Loading UI
            let { key } = await sock.sendMessage(from, { 
                text: "🌹 *BLOODY ROSE IS THINKING...*" 
            }, { quoted: m });

            // 2. Groq API Request (Updated to latest Llama 3.1 model)
            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    messages: [
                        { role: "system", content: "You are Bloody Rose, a helpful and stylish WhatsApp AI bot created by Lord Indumina. Keep your answers concise and cool." },
                        { role: "user", content: text }
                    ],
                    model: "llama-3.1-8b-instant", // මෙතන තමයි අලුත් model එක දැම්මේ
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const aiResponse = response.data.choices[0].message.content;

            // 3. Final UI Output
            let replyMsg = `🌹 *B L O O D Y  R O S E  A I* 🌹\n\n`;
            replyMsg += `${aiResponse}\n\n`;
            replyMsg += `> *POWERED BY GROQ & LORD INDUMINA*`;

            await sock.sendMessage(from, { text: replyMsg, edit: key });
            await sock.sendMessage(from, { react: { text: "🌹", key: m.key } });

        } catch (error) {
            console.error("AI Error:", error.response ? error.response.data : error.message);
            await sock.sendMessage(from, { 
                text: "⚠️ *SYSTEM OVERLOAD:* Groq API rejected the request. Please check if the model is still valid or if the API key has expired!" 
            }, { quoted: m });
        }
    }
};