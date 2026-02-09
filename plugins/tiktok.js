const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'tiktok',
    alias: ['ttsearch', 'tiks'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const query = args.join(' ');
        const myPhoto = "https://i.postimg.cc/gjkQy2Kd/images-(9).jpg"; 

        if (!query) return sock.sendMessage(from, { text: "⚠️ *කරුණාකර නමක් ලබා දෙන්න!*" });

        try {
            // --- 🔎 මෙන්න මෙතනින් තමයි මුලින්ම React කරන්නේ ---
            await sock.sendMessage(from, { react: { text: "🔎", key: m.key } });

            // --- 💉🌹 SMOOTH LOADING ANIMATION ---
            const loadMsg = await sock.sendMessage(from, { text: `[▒▒▒▒▒▒▒▒▒▒] 0% 💉🌹` }, { quoted: m });

            const steps = [
                { bar: "[██▒▒▒▒▒▒▒▒] 20%", time: 500 },
                { bar: "[█████▒▒▒▒▒] 50%", time: 1000 },
                { bar: "[████████▒▒] 85%", time: 1500 },
                { bar: "[██████████] 100%", time: 2000 }
            ];

            for (const step of steps) {
                setTimeout(async () => {
                    await sock.sendMessage(from, { text: `${step.bar} 💉🌹`, edit: loadMsg.key });
                }, step.time);
            }

            const options = {
                method: 'GET',
                url: 'https://tiktok-api23.p.rapidapi.com/api/search/video', 
                params: { keyword: query, count: '10', cursor: '0' },
                headers: {
                    'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
                    'x-rapidapi-key': 'b3ed75dd4fmsh37bac3020dc7418p16c174jsnc0e38d8598c6'
                }
            };

            const response = await axios.request(options);
            const data = response.data;
            let posts = data.data || data.videos || data.items || data.item_list || data.aweme_list || data.result;

            if (!posts || !Array.isArray(posts) || posts.length === 0) {
                return sock.sendMessage(from, { text: `❌ *වීඩියෝ හමු නොවීය.*`, edit: loadMsg.key });
            }

            global.tiktokSearchResults = global.tiktokSearchResults || {};
            global.tiktokSearchResults[from] = posts.slice(0, 7);

            // --- 🌹 LUXURY & DETAILED LAYOUT ---
            let msg = `✨ *B L O O D Y  R O S E  V 4* ✨\n\n`;
            msg += `👑 *OWNER:* LORD INDUMINA\n`;
            msg += `🔎 *SEARCH:* \`${query.toUpperCase()}\`\n`;
            msg += `──────────────────────\n\n`;

            posts.slice(0, 7).forEach((v, i) => {
                const title = v.desc || v.title || 'TikTok Video';
                const author = v.author?.uniqueId || v.author?.nickname || 'User';
                const views = v.stats?.playCount || v.play_count || '0';
                const likes = v.stats?.diggCount || v.digg_count || '0';
                const duration = v.video?.duration || v.duration || '0';
                
                msg += `*${i + 1}* ┏ 🎬 ${title.slice(0, 35)}...\n`;
                msg += `    ┃ 👤 *CREATOR:* @${author}\n`;
                msg += `    ┃ ⏱️ *TIME:* ${duration}s | 👀 ${Number(views).toLocaleString()}\n`;
                msg += `    ┗ ❤️ *LIKES:* ${Number(likes).toLocaleString()}\n\n`;
            });

            msg += `──────────────────────\n`;
            msg += `📥 *බාගත කිරීමට අංකය REPLY කරන්න.*\n\n`;
            msg += `> *Created By Lord Indumina 💉🩸*`;

            setTimeout(async () => {
                await sock.sendMessage(from, { delete: loadMsg.key });
            }, 2300);

            const cover = posts[0].cover || (posts[0].video && posts[0].video.cover) || myPhoto;

            const sentMsg = await sock.sendMessage(from, { 
                image: { url: cover }, 
                caption: msg,
                contextInfo: {
                    externalAdReply: {
                        title: "L O R D  I N D U M I N A  💉",
                        body: "B L O O D Y  R O S E  T I K T O K",
                        thumbnailUrl: myPhoto, 
                        mediaType: 1,
                        renderLargerThumbnail: false,
                        sourceUrl: "https://github.com/Indumina-Lord"
                    }
                }
            }, { quoted: m });

            // --- DOWNLOAD LISTENER ---
            const listener = async (messageUpdate) => {
                const newMsg = messageUpdate.messages[0];
                if (!newMsg.message) return;

                const isReply = newMsg.message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;
                const text = newMsg.message.conversation || newMsg.message.extendedTextMessage?.text;

                if (isReply && text && /^\d+$/.test(text.trim())) {
                    const index = parseInt(text.trim()) - 1;
                    const savedResults = global.tiktokSearchResults[from];

                    if (savedResults && savedResults[index]) {
                        try {
                            await sock.sendMessage(from, { react: { text: "📥", key: newMsg.key } });
                            const video = savedResults[index];
                            const author = video.author?.uniqueId || 'User';
                            const tiktokUrl = `https://www.tiktok.com/@${author}/video/${video.id || video.aweme_id}`;

                            const tikwm = await axios.post('https://www.tikwm.com/api/', { url: tiktokUrl });
                            const videoUrl = tikwm.data?.data?.play;

                            if (videoUrl) {
                                await sock.sendMessage(from, {
                                    video: { url: videoUrl },
                                    caption: `🎬 *T I K T O K  D O W N L O A D*\n\n📝 ${video.desc || 'Success'}\n👤 *Creator:* @${author}\n\n> *Lord Indumina 💉*`,
                                    mimetype: 'video/mp4'
                                }, { quoted: newMsg });
                            }
                            sock.ev.off('messages.upsert', listener);
                        } catch (err) {
                            sock.ev.off('messages.upsert', listener);
                        }
                    }
                }
            };

            sock.ev.on('messages.upsert', listener);
            setTimeout(() => { sock.ev.off('messages.upsert', listener); }, 300000);

        } catch (error) {
            await sock.sendMessage(from, { text: "⚠️ *Error!*" });
        }
    }
};