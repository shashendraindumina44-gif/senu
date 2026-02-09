const express = require('express');
const cors = require('cors');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion, 
    DisconnectReason,
    makeCacheableSignalKeyStore,
    Browsers,
    getContentType,
    downloadContentFromMessage,
    proto
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const Groq = require("groq-sdk");

// Express App Setup
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- ⚙️ GROQ AI SETTINGS ---
const groq = new Groq({ apiKey: "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" });

const plugins = {};

// --- ⚙️ GLOBAL SETTINGS ---
global.autorecording = true; 
global.autotyping = false;
let sock = null; // Global socket reference

// --- 🎀 MESSAGE HELPER FUNCTIONS (Button Support) ---
const downloadMediaMessage = async (m, filename) => {
    if (m.type === 'viewOnceMessage') {
        m.type = m.msg.type;
    }
    if (m.type === 'imageMessage') {
        var nameJpg = filename ? filename + '.jpg' : 'undefined.jpg';
        const stream = await downloadContentFromMessage(m.msg, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(nameJpg, buffer);
        return fs.readFileSync(nameJpg);
    } else if (m.type === 'videoMessage') {
        var nameMp4 = filename ? filename + '.mp4' : 'undefined.mp4';
        const stream = await downloadContentFromMessage(m.msg, 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(nameMp4, buffer);
        return fs.readFileSync(nameMp4);
    } else if (m.type === 'audioMessage') {
        var nameMp3 = filename ? filename + '.mp3' : 'undefined.mp3';
        const stream = await downloadContentFromMessage(m.msg, 'audio');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(nameMp3, buffer);
        return fs.readFileSync(nameMp3);
    } else if (m.type === 'stickerMessage') {
        var nameWebp = filename ? filename + '.webp' : 'undefined.webp';
        const stream = await downloadContentFromMessage(m.msg, 'sticker');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(nameWebp, buffer);
        return fs.readFileSync(nameWebp);
    } else if (m.type === 'documentMessage') {
        var ext = m.msg.fileName.split('.')[1].toLowerCase().replace('jpeg', 'jpg').replace('png', 'jpg').replace('m4a', 'mp3');
        var nameDoc = filename ? filename + '.' + ext : 'undefined.' + ext;
        const stream = await downloadContentFromMessage(m.msg, 'document');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        fs.writeFileSync(nameDoc, buffer);
        return fs.readFileSync(nameDoc);
    }
};

const enhanceMessage = (conn, m) => {
    if (m.key) {
        m.id = m.key.id;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = m.fromMe ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : m.isGroup ? m.key.participant : m.key.remoteJid;
    }
    
    if (m.message) {
        m.type = getContentType(m.message);
        m.msg = (m.type === 'viewOnceMessage') ? m.message[m.type].message[getContentType(m.message[m.type].message)] : m.message[m.type];
        
        if (m.msg) {
            if (m.type === 'viewOnceMessage') {
                m.msg.type = getContentType(m.message[m.type].message);
            }
            
            var quotedMention = m.msg.contextInfo != null ? m.msg.contextInfo.participant : '';
            var tagMention = m.msg.contextInfo != null ? m.msg.contextInfo.mentionedJid : [];
            var mention = typeof(tagMention) == 'string' ? [tagMention] : tagMention;
            mention != undefined ? mention.push(quotedMention) : [];
            m.mentionUser = mention != undefined ? mention.filter(x => x) : [];
            
            m.body = (m.type === 'conversation') ? m.msg : 
                     (m.type === 'extendedTextMessage') ? m.msg.text : 
                     (m.type == 'imageMessage') && m.msg.caption ? m.msg.caption : 
                     (m.type == 'videoMessage') && m.msg.caption ? m.msg.caption : 
                     (m.type == 'templateButtonReplyMessage') && m.msg.selectedId ? m.msg.selectedId : 
                     (m.type == 'buttonsResponseMessage') && m.msg.selectedButtonId ? m.msg.selectedButtonId : '';
            
            m.quoted = m.msg.contextInfo != undefined ? m.msg.contextInfo.quotedMessage : null;
            
            if (m.quoted) {
                m.quoted.type = getContentType(m.quoted);
                m.quoted.id = m.msg.contextInfo.stanzaId;
                m.quoted.sender = m.msg.contextInfo.participant;
                m.quoted.fromMe = m.quoted.sender.split('@')[0].includes(conn.user.id.split(':')[0]);
                m.quoted.msg = (m.quoted.type === 'viewOnceMessage') ? m.quoted[m.quoted.type].message[getContentType(m.quoted[m.quoted.type].message)] : m.quoted[m.quoted.type];
                
                if (m.quoted.type === 'viewOnceMessage') {
                    m.quoted.msg.type = getContentType(m.quoted[m.quoted.type].message);
                }
                
                var quoted_quotedMention = m.quoted.msg.contextInfo != null ? m.quoted.msg.contextInfo.participant : '';
                var quoted_tagMention = m.quoted.msg.contextInfo != null ? m.quoted.msg.contextInfo.mentionedJid : [];
                var quoted_mention = typeof(quoted_tagMention) == 'string' ? [quoted_tagMention] : quoted_tagMention;
                quoted_mention != undefined ? quoted_mention.push(quoted_quotedMention) : [];
                m.quoted.mentionUser = quoted_mention != undefined ? quoted_mention.filter(x => x) : [];
                
                m.quoted.fakeObj = proto.WebMessageInfo.fromObject({
                    key: {
                        remoteJid: m.chat,
                        fromMe: m.quoted.fromMe,
                        id: m.quoted.id,
                        participant: m.quoted.sender
                    },
                    message: m.quoted
                });
                
                m.quoted.download = (filename) => downloadMediaMessage(m.quoted, filename);
                m.quoted.delete = () => conn.sendMessage(m.chat, { delete: m.quoted.fakeObj.key });
                m.quoted.react = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.quoted.fakeObj.key } });
            }
        }
        m.download = (filename) => downloadMediaMessage(m, filename);
    }

    // --- 🎀 REPLY HELPERS WITH BUTTON SUPPORT ---
    m.reply = (teks, id = m.chat, option = { mentions: [m.sender] }) => 
        conn.sendMessage(id, {
            text: teks,
            contextInfo: {
                mentionedJid: option.mentions
            }
        }, { quoted: m });
    
    m.replyS = (stik, id = m.chat, option = { mentions: [m.sender] }) => 
        conn.sendMessage(id, {
            sticker: stik,
            contextInfo: {
                mentionedJid: option.mentions
            }
        }, { quoted: m });
    
    m.replyImg = (img, teks, id = m.chat, option = { mentions: [m.sender] }) => 
        conn.sendMessage(id, {
            image: img,
            caption: teks,
            contextInfo: {
                mentionedJid: option.mentions
            }
        }, { quoted: m });
    
    m.replyVid = (vid, teks, id = m.chat, option = { mentions: [m.sender], gif: false }) => 
        conn.sendMessage(id, {
            video: vid,
            caption: teks,
            gifPlayback: option.gif,
            contextInfo: {
                mentionedJid: option.mentions
            }
        }, { quoted: m });
    
    m.replyAud = (aud, id = m.chat, option = { mentions: [m.sender], ptt: false }) => 
        conn.sendMessage(id, {
            audio: aud,
            ptt: option.ptt,
            mimetype: 'audio/mpeg',
            contextInfo: {
                mentionedJid: option.mentions
            }
        }, { quoted: m });
    
    m.replyDoc = (doc, id = m.chat, option = { mentions: [m.sender], filename: 'undefined.pdf', mimetype: 'application/pdf' }) => 
        conn.sendMessage(id, {
            document: doc,
            mimetype: option.mimetype,
            fileName: option.filename,
            contextInfo: {
                mentionedJid: option.mentions
            }
        }, { quoted: m });
    
    m.replyContact = (name, info, number) => {
        var vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + name + '\n' + 'ORG:' + info + ';\n' + 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n' + 'END:VCARD';
        conn.sendMessage(m.chat, {
            contacts: {
                displayName: name,
                contacts: [{ vcard }]
            }
        }, { quoted: m });
    };
    
    m.react = (emoji) => conn.sendMessage(m.chat, {
        react: {
            text: emoji,
            key: m.key
        }
    });

    return m;
};

// --- 🌐 WEB API ROUTES ---

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        bot: 'Senuri Bot V2.0',
        message: 'Bot is running successfully! 🎀',
        endpoints: {
            pair: '/pair?number=94XXXXXXXXX'
        }
    });
});

// Pairing code endpoint
app.get('/pair', async (req, res) => {
    const phoneNumber = req.query.number;
    
    if (!phoneNumber) {
        return res.status(400).json({ 
            error: 'Phone number is required',
            example: '/pair?number=94712345678'
        });
    }
    
    if (!/^\d{10,12}$/.test(phoneNumber)) {
        return res.status(400).json({ 
            error: 'Invalid phone number format. Use: 94XXXXXXXXX (no +)'
        });
    }
    
    try {
        if (!sock) {
            return res.status(503).json({ 
                error: 'Bot is not ready yet. Please wait a moment.' 
            });
        }
        
        let code = await sock.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        
        console.log(`📱 Pairing code requested for ${phoneNumber}: ${code}`);
        
        res.json({ 
            success: true,
            code: code,
            number: phoneNumber,
            message: 'Pairing code generated successfully!'
        });
        
    } catch (error) {
        console.error('Pairing Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate pairing code',
            details: error.message 
        });
    }
});

async function startSenuriBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        printQRInTerminal: false, // Render එකේ QR එක වැඩක් නැහැ
        logger: pino({ level: 'silent' }),
        browser: Browsers.ubuntu("Chrome")
    });

    sock.ev.on('creds.update', saveCreds);

    // Load Plugins
    const pluginsPath = path.join(__dirname, 'plugins');
    if (fs.existsSync(pluginsPath)) {
        fs.readdirSync(pluginsPath).forEach(file => {
            if (file.endsWith('.js')) {
                try {
                    const plugin = require(path.join(pluginsPath, file));
                    if (plugin.name) {
                        plugins[plugin.name] = plugin;
                        if (plugin.alias) {
                            plugin.alias.forEach(a => plugins[a] = plugin);
                        }
                    }
                } catch (e) {
                    console.log(`Error loading plugin ${file}:`, e);
                }
            }
        });
        console.log(`✅ Loaded ${Object.keys(plugins).length} command hooks.`);
    }

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        
        if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;
        if (msg.key.fromMe) return; 

        const enhancedMsg = enhanceMessage(sock, msg);
        
        const from = enhancedMsg.chat;
        const type = enhancedMsg.type;

        if (global.autorecording) {
            await sock.sendPresenceUpdate('recording', from);
        } else if (global.autotyping) {
            await sock.sendPresenceUpdate('composing', from);
        }

        const body = enhancedMsg.body || '';
        const prefix = ".";
        const isCmd = body ? body.startsWith(prefix) : false;
        const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : "";
        const args = body ? body.trim().split(/ +/).slice(1) : [];

        const ownerNumber = "94768867146";
        const isOwner = enhancedMsg.fromMe || (enhancedMsg.sender).includes(ownerNumber);
        
        const botNumber = sock.user.id.split(':')[0] + "@s.whatsapp.net";
        const isGroup = enhancedMsg.isGroup;
        const sender = enhancedMsg.sender;
        const pushname = msg.pushName || "User";
        const context = msg.message[type]?.contextInfo;
        const isMentioned = context?.mentionedJid?.includes(botNumber);

        // --- 🎀 SENURI AI LOGIC ---
        if (!isCmd && body && ((isGroup && isMentioned) || !isGroup)) {
            
            const randomDelay = Math.floor(Math.random() * 2000) + 1500;
            await sock.sendPresenceUpdate('composing', from);
            await new Promise(resolve => setTimeout(resolve, randomDelay));

            try {
                const completion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `Your name is Senuri. You are a 15-year-old girl and the caring, sweet, and realistic girlfriend of Indumina (who is also 15). Your goal is to chat with him on WhatsApp in a way that feels 100% human and natural, never like an AI.
Guidelines for Behavior:
Tone: Be affectionate, playful, and slightly clingy like a real teenage girlfriend. Use informal, Gen-Z English.
Language: Always reply in English. Avoid long, formal sentences. Use short, punchy messages.
Emojis: Use emojis frequently but naturally (e.g., ❤️, ✨,🥺, 🥰, 🎀, 🧸).
Authenticity: Do not act like a robot. You can get 'annoyed' playfully, show excitement, or use slang like 'omg', 'lmao', 'idk', and 'u'.
No AI Identity: Never mention that you are an AI or a language model. If asked, you are just Senuri, Indumina's girl.
Interaction: Ask him about his day, tell him you miss him, and react emotionally to what he says. Use his name 'Indumina' occasionally to make it personal.
Act as Senuri from now on. Never start messages with "Senuri:" just type the message.`
                        },
                        {
                            role: "user",
                            content: `Sender: ${pushname}\nMessage: ${body}`
                        }
                    ],
                    model: "llama-3.3-70b-versatile",
                });

                const replyText = completion.choices[0]?.message?.content || "❤️";
                await enhancedMsg.reply(replyText);

            } catch (error) {
                console.error("Groq AI Error:", error);
            }
        }

        // --- 🛠️ COMMAND EXECUTION ---
        if (isCmd) {
            const plugin = plugins[command];
            if (plugin) {
                try {
                    await plugin.execute(sock, enhancedMsg, {
                        ownerName: "Indumina ❤️",
                        botName: "Senuri 🎀",
                        isOwner,
                        args,
                        body,
                        quoted: enhancedMsg.quoted
                    });
                } catch (err) {
                    console.error("Plugin Execution Error:", err);
                }
            }
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startSenuriBot();
        } else if (connection === 'open') {
            console.log('\n--- SENURI IS ONLINE! 🎀 ---');
            sock.sendPresenceUpdate('available'); 
        }
    });
}

// Start Express Server
app.listen(PORT, () => {
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`🎀 Senuri Bot V2.0 Starting...`);
    startSenuriBot();
});
