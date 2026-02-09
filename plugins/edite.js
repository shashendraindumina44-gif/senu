module.exports = {
    name: 'edit',
    async execute(sock, m, { quoted, args }) {
        const from = m.key.remoteJid;

        try {
            // 1. Reply එකක් තියෙනවද සහ ඒක බොට්ගේම මැසේජ් එකක්ද කියලා බලමු
            if (!m.quoted) {
                return await sock.sendMessage(from, { text: "🌹 *Please reply to a message sent by the bot to edit!*" }, { quoted: m });
            }
            
            if (!m.quoted.fromMe) {
                return await sock.sendMessage(from, { text: "🌹 *I can only edit my own messages!* ❌" }, { quoted: m });
            }

            // 2. අලුත් Text එක තියෙනවද බලමු
            const newText = args.join(" ");
            if (!newText) {
                return await sock.sendMessage(from, { text: "🌹 *Please provide the new text!* \nExample: `.edit New Message Content`" }, { quoted: m });
            }

            // 3. Reaction
            await sock.sendMessage(from, { react: { text: "📝", key: m.key } });

            // 4. Cyber Animation
            let { key } = await sock.sendMessage(from, { text: "🌹 *Modifying Data Stream...*" }, { quoted: m });
            
            const frames = [
                "🌹 *Injecting New Content...* 💉",
                "🌹 *Finalizing Edit...* ✨"
            ];

            for (let frame of frames) {
                await new Promise(res => setTimeout(res, 400));
                await sock.sendMessage(from, { text: frame, edit: key });
            }

            // 5. මැසේජ් එක Edit කිරීම
            await sock.sendMessage(from, { 
                text: newText, 
                edit: m.quoted.key 
            });

            // 6. Loading මැසේජ් එක මකා දැමීම
            await sock.sendMessage(from, { delete: key });

        } catch (error) {
            console.error("Edit Error:", error);
            await sock.sendMessage(from, { text: "❌ *Failed to edit the message!*" });
        }
    }
};