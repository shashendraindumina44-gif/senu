const { Sticker, StickerTypes } = require('wa-sticker-formatter');
module.exports = {
    name: 'sticker',
    alias: ['s'],
    async execute(sock, m, args) {
        try {
            const buffer = await m.download(); // දැන් මේක index.js නිසා අනිවාර්යයෙන්ම වැඩ කරනවා
            if (!buffer) return await sock.sendMessage(m.key.remoteJid, { text: "❌ Reply to an image!" });
            const sticker = new Sticker(buffer, {
                pack: 'B L O O D Y  R O S E',
                author: 'Lord Indumina',
                type: StickerTypes.FULL,
                quality: 70
            });
            await sock.sendMessage(m.key.remoteJid, { sticker: await sticker.toBuffer() }, { quoted: m });
        } catch (e) {
            console.log(e);
        }
    }
};