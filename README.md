# 🎀 SENURI BOT - RENDER DEPLOYMENT GUIDE

## 🚀 Render වල Deploy කරන විදිය

### Step 1: GitHub Repository එකක් හදන්න

1. GitHub වල sign in වෙන්න
2. New Repository හදන්න (Public හෝ Private)
3. මේ සියලු files upload කරන්න:
   ```
   server.js
   package.json
   config.js
   .gitignore
   plugins/ (folder)
   ```

### Step 2: Render වල Deploy කරන්න

1. **Render.com** වල sign up කරන්න (free)
2. **"New +"** > **"Web Service"** click කරන්න
3. GitHub repository එක connect කරන්න
4. Settings:
   - **Name**: senuri-bot (හෝ ඕනෑම නමක්)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **"Create Web Service"** click කරන්න

### Step 3: Deployment ඉවර වෙන්න බලන්න

- Logs එකේ පෙන්වයි:
  ```
  🌐 Server running on port 10000
  🎀 Senuri Bot V2.0 Starting...
  ✅ Loaded X command hooks.
  --- SENURI IS ONLINE! 🎀 ---
  ```

### Step 4: ඔබගේ Render URL එක copy කරන්න

- URL එක වෙන්නේ: `https://senuri-bot.onrender.com`
- මේ URL එක **web interface එකේ** යොදන්න

---

## 🌐 Web Pairing Interface Setup (Netlify)

### Step 1: index.html file එක edit කරන්න

`index.html` file එකේ **line 233** වෙනස් කරන්න:

```javascript
// වෙනස් කරන්න BEFORE:
const API_URL = 'https://your-render-app.onrender.com/pair';

// වෙනස් කරන්න AFTER:
const API_URL = 'https://senuri-bot.onrender.com/pair';
```

### Step 2: Netlify වල Deploy කරන්න

#### Method 1: Drag & Drop (ලේසිම)
1. **Netlify.com** වල sign up කරන්න
2. **"Sites"** > **"Add new site"** > **"Deploy manually"**
3. `index.html` file එක drag කරලා drop කරන්න
4. Done! URL එක ලැබෙයි: `https://your-site.netlify.app`

#### Method 2: GitHub (Recommended)
1. New GitHub repo එකක් හදන්න
2. `index.html` upload කරන්න
3. Netlify වල **"Import from Git"** click කරන්න
4. Repository එක select කරන්න
5. Deploy!

---

## 📱 භාවිතා කරන විදිය

### Users සඳහා:

1. **Web Interface** එක open කරන්න: `https://your-site.netlify.app`
2. Phone number එක type කරන්න (94XXXXXXXXX)
3. **"Get Pairing Code"** click කරන්න
4. Code එක copy කරන්න
5. WhatsApp > Settings > Linked Devices > Link with phone number
6. Paste කරන්න!

---

## 🔧 API Endpoints

### 1. Health Check
```
GET https://senuri-bot.onrender.com/
```
Response:
```json
{
  "status": "online",
  "bot": "Senuri Bot V2.0",
  "message": "Bot is running successfully! 🎀"
}
```

### 2. Get Pairing Code
```
GET https://senuri-bot.onrender.com/pair?number=94712345678
```
Response:
```json
{
  "success": true,
  "code": "ABCD-EFGH",
  "number": "94712345678",
  "message": "Pairing code generated successfully!"
}
```

---

## ⚠️ Important Notes

### Render Free Tier Limitations:
- 🕐 **Sleep after 15 min inactivity** - Bot එක active තියාගන්න free tier එකේ අමාරුයි
- 💾 **512MB RAM** - සමහර විට memory issues ඇති වෙන්න පුළුවන්
- 🔄 **Auto-restart** - Bot එක crash වුණාම auto restart වෙනවා

### Solutions:
1. **UptimeRobot** හරහා bot එක awake තියාගන්න:
   - uptimerobot.com වල account එකක් හදාගන්න
   - Monitor එකක් add කරන්න: `https://senuri-bot.onrender.com`
   - 5 minute interval එකක් දාන්න

2. **Paid Plan** (Recommended for 24/7):
   - Render Starter: $7/month
   - Always online, more RAM

### Session Management:
- First pairing code එක generate කරන විට session එක save වෙනවා
- Render එක restart වුණත් session එක තියෙනවා
- Re-pair කරන්න ඕනෑ නැහැ

---

## 🐛 Troubleshooting

### Bot connect නොවේ නම්:
1. Render logs බලන්න errors තියෙනවද
2. Session folder එක properly save වෙනවද බලන්න
3. Phone number format එක හරි ද (94XXXXXXXXX)

### Web interface වැඩ නොකරන්නේ නම්:
1. Render URL එක හරියටද `index.html` එකේ
2. CORS enabled ද (already done in server.js)
3. Browser console එකේ errors බලන්න

### Commands වැඩ නොකරන්නේ නම්:
1. Prefix එක හරි ද (`.` default)
2. Plugins properly load වෙනවද logs බලන්න
3. Bot එක online ද health check කරන්න

---

## 📊 Monitoring

### Render Dashboard වලින්:
- CPU/RAM usage බලන්න
- Logs real-time බලන්න
- Restart කරන්න පුළුවන්

### Logs access කරන්න:
```bash
# Render dashboard > Logs tab
```

---

## 🔐 Security

### API Key Protection:
- Groq API key හැඟී server.js එකේ තියෙනවා
- Production එකේ දැම්මොත් **Environment Variables** භාවිතා කරන්න:
  1. Render Dashboard > Environment
  2. Add: `GROQ_API_KEY=your_key_here`
  3. server.js එකේ: `process.env.GROQ_API_KEY`

### Owner Number:
- `config.js` හෝ `server.js` එකේ owner number එක update කරන්න

---

## 📈 Scaling

### More Users:
- Free tier එකේ limited
- Paid plan එකක් ගන්න වැඩි traffic එකක් තිබ්බොත්

### Multiple Bots:
- එක Render instance එකක එක bot එකක් පමණයි
- Multiple bots = multiple repositories

---

## 💡 Tips

1. **Keep Bot Alive**: UptimeRobot use කරන්න
2. **Monitor Logs**: Render dashboard එක regular check කරන්න
3. **Update Dependencies**: `npm update` කරන්න occasionally
4. **Backup Session**: Session folder එක download කරලා backup එකක් තියාගන්න

---

## 📞 Support

Issues තිබේ නම්:
1. Render logs check කරන්න
2. GitHub Issues create කරන්න
3. WhatsApp: wa.me/94768867146

---

**Made with 💖 by Indumina**
**Senuri Bot V2.0 - Cloud Deployment Edition** 🎀
