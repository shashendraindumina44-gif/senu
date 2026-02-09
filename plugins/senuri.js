module.exports = {
    name: 'senuri',
    alias: ['senuri', 'senuli'],
    async execute(sock, m, { quoted }) {
        const from = m.key.remoteJid;

        try {
            // 1. Reaction එකක් දාමු
            const reacts = ["❤️", "🌹", "✨", "🩸", "🍃"];
            const randomReact = reacts[Math.floor(Math.random() * reacts.length)];
            await sock.sendMessage(from, { react: { text: randomReact, key: m.key } });

            // 2. Typing Animation (Anti-Ban)
            let { key } = await sock.sendMessage(from, { text: "🌹 *Accessing Master's Database...*" }, { quoted: m });
            
            await sock.sendPresenceUpdate('composing', from);
            await new Promise(res => setTimeout(res, 2000)); // තත්පර 2ක් ටයිප් කරයි

            // 3. උත්තර 100ක ලිස්ට් එකෙන් අහඹු ලෙස එකක් තෝරා ගැනීම
            const responses = [
                "Master ගේ පණ වගේ ආදරේ කරන කෙනෙක් තමයි සෙනුරි.. ❤️",
                "ඔයා සෙනූ ගැනද දැනගන්න ආවේ? එයා Master ගේ ලෝකේ.. 🌹",
                "Senuri is Indumina's Special One! ✨",
                "සෙනුරි ගැන විස්තර කියන්න මට Master ගෙන් අවසර නෑ. 🩸",
                "Master ගේ හිතේ ඉන්න ලස්සනම රෝස මල සෙනුරි.. 🌹",
                "Hi! සෙනුරි ගැන අහන්න එපා, ඒක Master ගේ රහසක්! 🧿",
                "Masterge heart eke inna queen thamai Senuri.. 👑",
                "Senuri gana kiyanna giyoth meka iwara wenne na! ❤️",
                "Aduwa nathi Masterge adare thama Senuri... ✨",
                "Oya Senuri genada ahuwe? Master kiyai oitath wada hodata! 🌹"
            ];

            const randomReply = responses[Math.floor(Math.random() * responses.length)];

            // 4. අවසාන පණිවිඩය Animation එක Edit කර යැවීම
            const finalMsg = `🌹 *B L O O D Y  R O S E  S E N U R I*

┌──────────────┈
│ 👑 *Info:*
│ ${randomReply}
└──────────────┈

> *Power By Lord Indumina 🩸*`;

            await sock.sendMessage(from, { text: finalMsg, edit: key });
            await sock.sendPresenceUpdate('paused', from);

        } catch (e) {
            console.log("Senuri Cmd Error: ", e);
        }
    }
};