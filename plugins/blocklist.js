module.exports = {
    name: 'blocklist',
    async execute(sock, m, { quoted }) {
        const from = m.key.remoteJid;
        const sender = m.sender;
        
        // 1. Owner කවුදැයි පරීක්ෂා කිරීම (ඔයාගේ නම්බර් එක මෙතනට දාන්න)
        const ownerNumber = "94768867146@s.whatsapp.net"; 

        if (sender !== ownerNumber) {
            return await sock.sendMessage(from, { 
                text: "🌹 *Access Denied!* \nThis command is only for my *Owner*. 🛡️" 
            }, { quoted: m });
        }

        try {
            await sock.sendMessage(from, { react: { text: "📑", key: m.key } });

            // Loading...
            let { key } = await sock.sendMessage(from, { text: "🌹 *Accessing Restricted Database...*" }, { quoted: m });

            const blockedList = await sock.fetchBlocklist();

            if (blockedList.length === 0) {
                await sock.sendMessage(from, { delete: key });
                return await sock.sendMessage(from, { text: "🌹 *Blacklist is empty!*" }, { quoted: m });
            }

            let listTxt = `🌹 *B L O O D Y  R O S E  B L O C K L I S T*\n\n`;
            listTxt += `┌──────────────┈\n`;
            listTxt += `│ 🚫 *Total Blocked:* ${blockedList.length}\n`;
            listTxt += `└──────────────┈\n\n`;

            blockedList.map((user, i) => {
                listTxt += `  ${i + 1}. @${user.split('@')[0]}\n`;
            });

            listTxt += `\n> *Power By Lord Indumina 🩸*`;

            await sock.sendMessage(from, { delete: key });
            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: listTxt,
                mentions: blockedList
            }, { quoted: m });

        } catch (error) {
            console.error(error);
        }
    }
};