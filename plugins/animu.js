const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const webp = require('node-webpmux');
const crypto = require('crypto');

const ANIMU_BASE = 'https://api.some-random-api.com/animu';

module.exports = {
    name: 'animu',
    alias: ['anime', 'react'],
    async execute(sock, m, { args }) {
        const from = m.key.remoteJid;
        const subArg = args && args[0] ? args[0] : '';
        
        const supported = ['nom', 'poke', 'cry', 'kiss', 'pat', 'hug', 'wink', 'face-palm', 'quote'];
        const type = subArg.toLowerCase() === 'facepalm' ? 'face-palm' : subArg.toLowerCase();

        // 1. Random Image Selection
        const menuImages = [
            'https://i.ibb.co/W4q0FwhJ/7e8640326e2e.jpg',
            'https://i.ibb.co/hFKYqwhZ/51d8e263cd7f.jpg',
            'https://i.ibb.co/Wvg6qBbd/00b9bca6ff1a.jpg'
        ];
        const randomMenuImg = menuImages[Math.floor(Math.random() * menuImages.length)];
        const botLogo = 'https://i.postimg.cc/gjkQy2Kd/images-(9).jpg';

        // 2. Initial Reaction and Loading Animation (for both help message and sticker generation)
        await sock.sendMessage(from, { react: { text: "🌸", key: m.key } }); // Anime-style reaction

        let loadingMsgKey;
        if (!type || !supported.includes(type)) {
            // Only show loading if displaying the menu
            let { key } = await sock.sendMessage(from, { text: "🌹 *UNLEASHING OTAKU POWER...*" }, { quoted: m });
            loadingMsgKey = key;
        } else {
             let { key } = await sock.sendMessage(from, { text: "✨ *GENERATING ANIME MAGIC...*" }, { quoted: m });
             loadingMsgKey = key;
        }

        const loadingBars = [
            "🌸 [▒▒▒▒▒▒▒▒▒▒] *10%* - _Summoning Spirits..._",
            "🌸 [███▒▒▒▒▒▒▒] *40%* - _Drawing Frame by Frame..._",
            "🌸 [██████▒▒▒▒] *70%* - _Adding Detail to Characters..._",
            "🌸 [██████████] *100%* - _Anime Magic Complete!_",
            "✨ *BLOODY ROSE ANIME IS READY MASTER!*"
        ];

        for (let bar of loadingBars) {
            await new Promise(res => setTimeout(res, 400)); // Animation speed adjusted
            await sock.sendMessage(from, { text: bar, edit: loadingMsgKey });
        }
        await sock.sendMessage(from, { delete: loadingMsgKey }); // Loading message delete

        // 3. Stylish Help Message (If no type specified)
        if (!type || !supported.includes(type)) {
            const helpMsg = `🌹 *B L O O D Y  R O S E  A N I M E* 🌹\n\n` +
                `*Unleash the Otaku Power!* 🎌\n\n` +
                `┌──⊷ *COMMANDS TYPES*\n` +
                `${supported.map(t => `┆ ✨ .animu ${t}`).join('\n')}\n` +
                `└───────────────⊷\n\n` +
                `> *Created by Lord Indumina* 🩸`;

            try {
                const response = await axios.get(randomMenuImg, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(response.data, 'utf-8');

                return await sock.sendMessage(from, { 
                    image: imageBuffer,
                    caption: helpMsg,
                    contextInfo: {
                        externalAdReply: {
                            title: "B L O O D Y  R O S E  A N I M E",
                            body: "Select a reaction type, Master!",
                            mediaType: 1,
                            thumbnailUrl: botLogo,
                            sourceUrl: "https://github.com/LordIndumina",
                            renderLargerThumbnail: false,
                            showAdAttribution: false // Ad එක නොපෙන්වීමට
                        }
                    }
                }, { quoted: m });
            } catch (imgError) {
                // Image fail වුණොත් Text එකක් විදියට යැවීම
                return await sock.sendMessage(from, { text: helpMsg }, { quoted: m });
            }
        }

        // 4. Sticker Generation (After loading animation)
        try {
            const endpoint = `${ANIMU_BASE}/${type}`;
            const res = await axios.get(endpoint);
            const data = res.data;

            if (data.quote) {
                return await sock.sendMessage(from, { text: `🌹 *ANIME QUOTE:*\n\n"${data.quote}"` }, { quoted: m });
            }

            if (data.link) {
                const tmpDir = path.join(process.cwd(), 'tmp');
                if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

                const inputPath = path.join(tmpDir, `animu_${Date.now()}.gif`);
                const outputPath = path.join(tmpDir, `animu_${Date.now()}.webp`);

                const resp = await axios.get(data.link, { responseType: 'arraybuffer' });
                fs.writeFileSync(inputPath, Buffer.from(resp.data));

                const ffmpegCmd = `ffmpeg -y -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,fps=15" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 50 "${outputPath}"`;

                exec(ffmpegCmd, async (err) => {
                    if (err) return await sock.sendMessage(from, { text: "⚠️ Sticker conversion failed!" });

                    let webpBuffer = fs.readFileSync(outputPath);
                    const img = new webp.Image();
                    await img.load(webpBuffer);

                    const json = {
                        'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
                        'sticker-pack-name': 'Bloody Rose Anime',
                        'sticker-pack-publisher': 'Lord Indumina'
                    };
                    
                    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
                    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
                    const exif = Buffer.concat([exifAttr, jsonBuffer]);
                    exif.writeUIntLE(jsonBuffer.length, 14, 4);
                    img.exif = exif;

                    const finalBuffer = await img.save(null);
                    await sock.sendMessage(from, { sticker: finalBuffer }, { quoted: m });

                    try { fs.unlinkSync(inputPath); fs.unlinkSync(outputPath); } catch (e) {}
                });
            }
        } catch (error) {
            await sock.sendMessage(from, { text: "⚠️ Archive connection lost. Try again!" }, { quoted: m });
        }
    }
};