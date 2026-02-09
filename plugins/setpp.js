module.exports = {
    name: 'setpp',
    alias: ['setfullpp'],
    async execute(sock, m, { quoted, isOwner }) {
        const from = m.key.remoteJid;

        // 1. Owner check
        if (!isOwner) {
            return await sock.sendMessage(from, { text: "🚫 *ACCESS DENIED* \nThis is only for my Master! 🌹" }, { quoted: m });
        }

        // 2. Image check
        if (!m.quoted || !m.quoted.message.imageMessage) {
            return await sock.sendMessage(from, { text: "🌹 *Please reply to an image!*" }, { quoted: m });
        }

        try {
            await sock.sendMessage(from, { react: { text: "📸", key: m.key } });
            
            // සරලව Image එක Download කරගන්නවා
            const buffer = await m.quoted.download();

            // WhatsApp Query එක කෙලින්ම යවනවා (අමතර ලයිබ්‍රරි අවශ්‍ය නැත)
            await sock.query({
                tag: 'iq',
                attrs: {
                    to: sock.user.id.split(':')[0] + '@s.whatsapp.net',
                    type: 'set',
                    xmlns: 'w:profile:picture'
                },
                content: [
                    {
                        tag: 'picture',
                        attrs: { type: 'image' },
                        content: buffer
                    }
                ]
            });

            await sock.sendMessage(from, { text: "🌹 *Master, your profile picture has been updated successfully!* ✅" }, { quoted: m });

        } catch (error) {
            console.error(error);
            await sock.sendMessage(from, { text: "❌ *Failed to update PP! Your server might be restricting this action.*" });
        }
    }
};