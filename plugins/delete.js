module.exports = {
    name: 'del',
    alias: ['delete', 'unsend'],
    async execute(sock, m, { quoted }) {
        const from = m.key.remoteJid;
        
        try {
            // 1. Reply එකක් තියෙනවද බලමු
            if (!m.quoted) {
                return await sock.sendMessage(from, { text: "🌹 *Please reply to the message you want to delete!*" }, { quoted: m });
            }

            // 2. Reaction
            await sock.sendMessage(from, { react: { text: "🗑️", key: m.key } });

            // 3. Cyber Animation
            let { key } = await sock.sendMessage(from, { text: "🌹 *Targeting Message...*" }, { quoted: m });
            
            await new Promise(res => setTimeout(res, 400));
            await sock.sendMessage(from, { text: "🌹 *Erasing from Database...* 🧹", edit: key });

            // 4. මැසේජ් එක මැකීම (Delete for Everyone)
            await sock.sendMessage(from, { 
                delete: { 
                    remoteJid: from, 
                    fromMe: m.quoted.fromMe, 
                    id: m.quoted.id, 
                    participant: m.quoted.sender 
                } 
            });

            // 5. Loading මැසේජ් එක ඉවත් කිරීම
            await sock.sendMessage(from, { delete: key });

        } catch (error) {
            console.error("Delete Error:", error);
            await sock.sendMessage(from, { text: "❌ *Failed to delete message!* \n(Make sure I am an admin if deleting someone else's message)" });
        }
    }
};