module.exports = {
    name: 'owner',
    async execute(sock, m, { ownerName, quoted }) {
        try {
            const from = m.key.remoteJid;

            // 1. Reaction
            await sock.sendMessage(from, { react: { text: "👑", key: m.key } });

            // 2. Loading Animation
            let { key } = await sock.sendMessage(from, { text: "🌹 *Fetching Owner Details...*" }, { quoted: quoted });
            
            const loadingBars = [
                "🌹 [▒▒▒▒▒] 20%",
                "🌹 [██▒▒▒] 50%",
                "🌹 [█████] 100%",
                "👑 *OWNER FOUND!*"
            ];

            for (let bar of loadingBars) {
                await new Promise(res => setTimeout(res, 400));
                await sock.sendMessage(from, { text: bar, edit: key });
            }

            await sock.sendMessage(from, { delete: key });

            // 3. Contact Card (vCard) එක සැකසීම
            const vcard = 'BEGIN:VCARD\n' // vCard පටන් ගැනීම
                + 'VERSION:3.0\n' 
                + `FN:${ownerName}\n` // ඔයාගේ නම
                + 'ORG:Bloody Rose Supreme;\n' // බොට්ගේ නම
                + 'TEL;type=CELL;type=VOICE;waid=94768867146:+94 76 886 7146\n' // ඔයාගේ අංකය
                + 'END:VCARD';

            // 4. Contact Card එක මුලින් යැවීම
            await sock.sendMessage(from, { 
                contacts: { 
                    displayName: ownerName, 
                    contacts: [{ vcard }] 
                }
            }, { quoted: quoted });

            // 5. අවසාන Owner Message එක
            const ownerMsg = `
╭━━〔 👑 *O W N E R  I N F O* 〕━━┈
┃
┃ 🌹 *Name:* ${ownerName}
┃ 🌹 *Role:* Developer / Creator
┃ 🌹 *Contact:* wa.me/94768867146
┃ 🌹 *Project:* Bloody Rose Supreme
┃
╰━━━━━━━━━━━━━━━━━━┈

*Stay Connected for Updates!*
*Power By Lord Indumina 🩸*`;

            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: ownerMsg,
                contextInfo: {
                    externalAdReply: {
                        title: "B L O O D Y  R O S E  O W N E R",
                        body: `Developer: ${ownerName}`,
                        mediaType: 1,
                        thumbnailUrl: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg', 
                        sourceUrl: "https://wa.me/94768867146",
                        showAdAttribution: true 
                    }
                }
            }, { quoted: quoted });

        } catch (error) {
            console.error("Owner Error:", error);
        }
    }
};