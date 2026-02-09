const axios = require('axios');

module.exports = {
    name: 'menu',
    alias: ['help', 'list'],
    async execute(sock, m, { ownerName, botName }) {
        const from = m.key.remoteJid;
        const pushname = m.pushName || "User";

        try {
            // 1. Reaction (ප්‍රතිචාරය)
            await sock.sendMessage(from, { react: { text: "🌹", key: m.key } });

            // 2. Loading Animation (ඇනිමේෂන් එක)
            let { key } = await sock.sendMessage(from, { text: "🌹 *BLOODY ROSE: SYSTEM INITIALIZING...*" });
            
            const loadingBars = [
                "🌹 [▒▒▒▒▒▒▒▒▒▒] 10%",
                "🌹 [███▒▒▒▒▒▒▒] 40%",
                "🌹 [██████▒▒▒▒] 70%",
                "🌹 [██████████] 100%",
                "✨ *SUPREME MENU READY MASTER!*"
            ];

            for (let bar of loadingBars) {
                await new Promise(res => setTimeout(res, 400)); // වේගය මදක් අඩු කළා පැහැදිලි වීමට
                await sock.sendMessage(from, { text: bar, edit: key });
            }

            // පරණ මැසේජ් එක මකා දැමීම (Delete loading message)
            await sock.sendMessage(from, { delete: key });

            // 3. මෙනු එකේ පෙළ (Help Text)
            const helpText = `👋 *Greetings, ${pushname}*

🌹 *B L O O D Y  R O S E  V 1.5* 🌹
*Supreme Multi-Device System*

┏━━━━━━━━━━━━━━━━┓
┃  🧬 *CORE SYSTEM*
┃
┃ 🌹 .alive - Check status
┃ 🌹 .ping - System speed
┃ 🌹 .uptime - Runtime info
┃ 🌹 .system - OS details
┃ 🌹 .owner - Contact Lord Indumina
┃ 🌹 .menu - Show this list
┗━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━┓
┃  🎵 *DOWNLOADERS*
┃
┃ 🌹 .song - Download Music
┃ 🌹 .play - Audio player
┃ 🌹 .video - Download Video
┃ 🌹 .ytdl_local - Local downloader
┃ 🌹 .apk - Download Apps
┃ 🌹 .tiktok - TikTok Downloader
┗━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━┓
┃  🧠 *AI & INTELLIGENCE*
┃
┃ 🌹 .ai - ChatGPT Intelligence
┃ 🌹 .wiki - Wikipedia search
┃ 🌹 .google - Search engine
┃ 🌹 .googleimg - Image search
┃ 🌹 .define - Dictionary
┗━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━┓
┃  📰 *NEWS & UPDATES*
┃
┃ 🌹 .news - Latest SL news
┃ 🌹 .gagana - Gagana news
┃ 🌹 .weather - Weather report
┗━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━┓
┃  🛠️ *UTILITY TOOLS*
┃
┃ 🌹 .ss - Web Screenshot
┃ 🌹 .trt - Text Translate
┃ 🌹 .currency - Exchange rates
┃ 🌹 .sticker - Photo to sticker
┃ 🌹 .imgbb - Image host link
┃ 🌹 .viewonce - Viewonce fix
┗━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━┓
┃  🛡️ *ADMIN & OWNER*
┃
┃ 🌹 .antilink - Link protection
┃ 🌹 .block - Block user
┃ 🌹 .blocklist - Show blocked
┃ 🌹 .setpp - Change Bot DP
┃ 🌹 .delete - Remove message
┃ 🌹 .glink - Group link
┃ 🌹 .hi - Greeting test
┗━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━┓
┃  💞 *FUN & ANIME*
┃
┃ 🌹 .animu - Anime Reactions
┃ 🌹 .couple - Couple match
┃ 🌹 .senuri - Special cmd
┗━━━━━━━━━━━━━━━━┛

> *Created by Lord Indumina 🩸*`;

            // 4. පින්තූරය සමඟ මෙනු එක යැවීම
            await sock.sendMessage(from, { 
                image: { url: 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg' }, 
                caption: helpText,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "B L O O D Y  R O S E  S U P R E M E",
                        body: `Owner: Lord Indumina 👑`,
                        mediaType: 1,
                        thumbnailUrl: 'https://i.ibb.co/qMfHRCgy/images-8.jpg', 
                        sourceUrl: "https://github.com/Indumina",
                        renderLargerThumbnail: true, // මෙය true කළ විට ලොකු පින්තූරයක් පෙන්වයි
                        showAdAttribution: true 
                    }
                }
            }, { quoted: m });

        } catch (e) {
            console.error("Menu Error: ", e);
            sock.sendMessage(from, { text: "❌ මෙනු එක සකස් කිරීමේදී දෝෂයක් සිදුවිය!" }, { quoted: m });
        }
    }
};