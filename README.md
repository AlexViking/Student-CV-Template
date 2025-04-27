# Student CV Template

A gamified CV template that showcases your learning achievements and skills progression through interactive learning games.

## 🚀 Quick Start

### 1. Fork the Repository

1. Click the **Fork** button at the top-right of this repository
2. This creates a copy in your own GitHub account
3. Keep the repository name as `Student-CV-Template` for automatic username detection

### 2. Enable GitHub Pages

1. Go to your forked repository
2. Click **Settings** > **Pages** (in the left sidebar)
3. Under "Source", select the `main` branch
4. Click **Save**
5. Wait a few minutes... your CV will be live at:
   `https://YOUR-USERNAME.github.io/Student-CV-Template`

### 3. Configuration

1. Update the `config/cv-config.js` file:
   - Set `PLATFORM_URL` to the Learning Games Platform URL
   - Customize other settings as needed

## 🎮 Features

### Achievement System
- Automatically tracks and displays your learning progress
- Visual skill progression bars
- Achievement badges with pixel-themed design
- Dynamic updates when new keys are earned

### Debug Mode
- Press `Ctrl+D` to toggle debug panel
- View real-time data flow
- Monitor navigation history
- Inspect storage and achievement keys
- Track errors and logs

### Circular Flow
1. Navigate to Learning Games Platform
2. Complete learning games
3. Earn achievement keys
4. Return to CV with automatic updates

## 📂 Project Structure

```
Student-CV-Template/
├── index.html              # Main CV page
├── config/
│   └── cv-config.js       # Configuration settings
├── css/
│   ├── main.css           # Main styles
│   ├── skills.css         # Skills visualization
│   └── debug.css          # Debug mode styles
├── js/
│   ├── app.js             # Main application logic
│   ├── debug.js           # Debug system
│   ├── key-manager.js     # Key processing
│   ├── skills.js          # Skills visualization
│   └── keys.js            # Your achievement keys
└── README.md              # This file
```

## 🔧 Debug Mode

Debug mode provides detailed insights into:
- Application flow status
- Storage data (localStorage/sessionStorage)
- Navigation history
- Achievement key verification
- Error logging

To enable debug mode:
- Click the "Debug" button in the footer
- Press `Ctrl+D` keyboard shortcut
- Add `?debug=true` to the URL

## 💡 Best Practices

1. **Regular Updates**: Commit your `keys.js` file regularly
2. **Test Keys**: Use the UI to test keys before permanent storage
3. **Debug Issues**: Use debug mode to troubleshoot problems
4. **Keep Current**: Pull updates from the main repository

## 🎯 Adding Achievement Keys

1. Earn keys from learning games
2. Use the key entry form on your CV
3. Follow the permanent save instructions
4. Commit changes to your repository

### Manual Key Addition

Add keys to `js/keys.js`:
```javascript
const achievementKeys = [
    "eyJnYW1lSWQiOiJodG1sLWJhc2ljcy0xIi...",
    // Add new keys here
];
```

## 🔗 Related Projects

- [Learning Games Platform](https://github.com/AlexViking/Learning-Games-Platform)
- [Individual Game Repositories](https://github.com/AlexViking?tab=repositories&q=game-)

## ❓ Troubleshooting

### CV not updating?
1. Clear browser cache
2. Check if commits were successful
3. Use debug mode to inspect key processing

### Key not working?
1. Check for extra spaces or line breaks
2. Ensure key is from official game platform
3. Verify in debug mode

### GitHub Pages not working?
1. Ensure GitHub Pages is enabled in settings
2. Wait 1-2 minutes for deployment
3. Check repository visibility settings

## 📝 License

This project is part of the gamified learning platform and is available for educational use.