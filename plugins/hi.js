module.exports = {
    name: 'hi',
    async execute(sock, m, { ownerName, quoted }) {
        const from = m.key.remoteJid;
        await sock.sendMessage(from, { 
            text: `Hi Boss ${ownerName}! How can I help you? 💉` 
        }, { quoted: quoted });
    }
};