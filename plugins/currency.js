const axios = require('axios');

module.exports = {
    name: 'rate',
    alias: ['currency', 'crypto', 'price'],
    async execute(sock, m, args) {
        const from = m.key.remoteJid;
        const mainImgUrl = "https://i.ibb.co/1YZGxbZg/bitcoin-gold-cryptocurrency-trading-chart-smartphone-close-up-183385019.jpg";
        const botIconUrl = "https://i.postimg.cc/gjkQy2Kd/images-(9).jpg";

        try {
            // 1. Reaction & Animation Start
            await sock.sendMessage(from, { react: { text: "📈", key: m.key } });
            
            // Animation Steps (ලස්සනට පෙළ ගැසෙන මැසේජ් එක)
            const { key } = await sock.sendMessage(from, { text: "🌹 *BLOODY ROSE CORE:* Booting Intelligence..." });
            await new Promise(r => setTimeout(r, 800));
            await sock.sendMessage(from, { text: "🛰️ *SATELLITE SYNC:* Hacking Global Markets...", edit: key });
            await new Promise(r => setTimeout(r, 800));
            await sock.sendMessage(from, { text: "🧬 *DECRYPTING:* Finalizing Market Nodes...", edit: key });

            // 2. Data Fetching
            const exchangeRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
            const lkrRate = exchangeRes.data.rates.LKR;

            const cryptoRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
            const btc = cryptoRes.data.bitcoin.usd;
            const eth = cryptoRes.data.ethereum.usd;
            const sol = cryptoRes.data.solana.usd;

            // 3. UI Construction
            let rateMsg = `⚡ *B L O O D Y  R O S E  M A R K E T* ⚡\n\n`;
            
            rateMsg += `🌐 *CURRENCY NODES*\n`;
            rateMsg += `┌───────────────────────┈┄\n`;
            rateMsg += `│ 🇺🇸 *1 USD* ➜  🇱🇰 *${lkrRate.toFixed(2)} LKR*\n`;
            rateMsg += `└───────────────────────┈┄\n\n`;

            rateMsg += `🪙 *CRYPTO INTELLIGENCE*\n`;
            rateMsg += `┏━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
            rateMsg += `  ₿  *BTC* : $${btc.toLocaleString()}\n`;
            rateMsg += `  🔷  *ETH* : $${eth.toLocaleString()}\n`;
            rateMsg += `  ☀️  *SOL* : $${sol.toLocaleString()}\n`;
            rateMsg += `┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;

            rateMsg += `📡 *STATUS:* LIVE MARKET SYNC ✅\n`;
            rateMsg += `> 🌹 *STAY RICH. STAY BLOODY.*`;

            // 4. Main Image Buffer
            const response = await axios.get(mainImgUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'utf-8');

            // 5. Final Send & Delete Animation
            await sock.sendMessage(from, { delete: key });

            await sock.sendMessage(from, {
                image: buffer,
                caption: rateMsg,
                contextInfo: {
                    externalAdReply: {
                        title: "L I V E  M A R K E T  U P D A T E S",
                        body: "Cyber Core: Lord Indumina",
                        mediaType: 1,
                        thumbnailUrl: botIconUrl,
                        sourceUrl: "https://www.coingecko.com",
                        renderLargerThumbnail: false,
                        showAdAttribution: false
                    }
                }
            }, { quoted: m });

            await sock.sendMessage(from, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error("Rate Error:", error);
            await sock.sendMessage(from, { react: { text: "❌", key: m.key } });
            await sock.sendMessage(from, { text: "⚠️ *CRITICAL SYSTEM FAILURE: Node Blocked!*" });
        }
    }
};