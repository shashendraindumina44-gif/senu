const axios = require('axios');

module.exports = {
    name: 'insta',
    alias: ['ig', 'igsearch'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const query = args.join(' '); 
        const myPhoto = "https://i.postimg.cc/gjkQy2Kd/images-(9).jpg"; 

        if (!query) return sock.sendMessage(from, { text: "⚠️ *කරුණාකර Instagram Username එකක් ලබා දෙන්න!*" });

        // Loading message එකක් යැවීම
        const { key } = await sock.sendMessage(from, { text: `[▒▒▒▒▒▒▒▒▒▒] 0% 💉🌹` }, { quoted: m });

        try {
            await sock.sendMessage(from, { react: { text: "📸", key: m.key } });

            const options = {
                method: 'GET', // Profile info සඳහා බොහෝ විට GET භාවිතා වේ
                url: 'https://instagram120.p.rapidapi.com/api/instagram/user/info', // Endpoint එක පරීක්ෂා කරන්න
                params: { username: query.trim().replace('@', '') },
                headers: {
                    'x-rapidapi-host': 'instagram120.p.rapidapi.com',
                    'x-rapidapi-key': 'ඔබේ_API_KEY_එක' 
                }
            };

            const response = await axios.request(options);
            const user = response.data.result.user; // මෙය ඔබේ API structure එක අනුව වෙනස් විය හැක

            if (user) {
                let msg = `✨ *I N S T A  P R O F I L E* ✨\n\n`;
                msg += `👑 *OWNER:* LORD INDUMINA\n`;
                msg += `👤 *NAME:* ${user.full_name || 'Instagram User'}\n`;
                msg += `🔗 *USER:* @${user.username}\n`;
                msg += `──────────────────────\n\n`;
                msg += `📊 *STATS:*\n`;
                msg += `┃ 👥 *Followers:* ${Number(user.follower_count || 0).toLocaleString()}\n`;
                msg += `┃ 👤 *Following:* ${Number(user.following_count || 0).toLocaleString()}\n`;
                msg += `┃ 📝 *Posts:* ${user.media_count || 0}\n`;
                msg += `┗━━━━━━━━━━━━━━━━━━━\n\n`;
                msg += `> *Lord Indumina 💉*`;

                // Loading එක update කිරීම (Baileys message editing style)
                await sock.sendMessage(from, { text: `[██████████] 100% 💉🌹`, edit: key });

                await sock.sendMessage(from, { 
                    image: { url: user.profile_pic_url_hd || user.profile_pic_url || myPhoto }, 
                    caption: msg
                }, { quoted: m });

                await sock.sendMessage(from, { react: { text: "✅", key: m.key } });
            } else {
                await sock.sendMessage(from, { text: "❌ *ප්‍රතිඵල හමු නොවීය.*", edit: key });
            }

        } catch (error) {
            console.error('Insta Error:', error);
            await sock.sendMessage(from, { text: "⚠️ *API Error හෝ Username එක වැරදියි!*", edit: key });
        }
    }
};