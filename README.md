# Student CV Template

A gamified CV template that showcases your learning achievements and skills progression. This CV automatically displays your skills and achievements based on keys earned from the learning game platform.

## 🚀 Quick Start

### 1. Fork the Repository

1. Click the **Fork** button at the top-right of this repository
2. This creates a copy in your own GitHub account
3. Leave the repository name as `Student-CV-Template` for automatic username detection

### 2. Enable GitHub Pages

1. Go to your forked repository
2. Click **Settings** > **Pages** (in the left sidebar)
3. Under "Source", select the `main` branch
4. Click **Save**
5. Wait a few minutes... your CV will be live at:
   `https://YOUR-USERNAME.github.io/Student-CV-Template`

### 3. Automatic Personalization

Your CV automatically detects your GitHub username from the URL - no manual configuration needed!

## 🎮 Adding Achievement Keys

When you earn achievement keys from the learning games, follow this workflow:

### Step 1: UI Key Entry (Immediate Visual Feedback)

1. Visit your CV page
2. Scroll to "Add Achievement Key" section
3. Paste your achievement key
4. Click "Submit Key"
5. See your skills and achievements update instantly
6. Success! You'll now see instructions for permanent storage

### Step 2: Permanent Key Storage

After successful key entry, you'll see three options to make your achievement permanent:

**Option 1: GitHub Web Interface (Easiest)**
- Click the provided link to your `js/keys.js` file
- Click the pencil icon to edit
- Copy and paste the suggested key line
- Commit changes

**Option 2: Command Line (For advanced users)**
- Use the provided Git commands
- Automatically adds key to your `keys.js` file
- Commits and pushes changes

**Option 3: VS Code**
- Open your project
- Edit `js/keys.js`
- Add the suggested key line
- Commit and push changes

## 🔧 How It Works

1. **UI Key Entry**: Provides immediate visual feedback and updates your CV instantly (stored in browser storage)
2. **Permanent Storage**: Saves keys to `js/keys.js` for persistence across sessions and devices
3. **Automatic Loading**: On page load, keys from both browser storage and `js/keys.js` are processed
4. **GitHub Username Detection**: CV automatically personalizes using your GitHub username from the URL

## 📂 Project Structure

```
Student-CV-Template/
├── index.html          # Main CV page with key entry UI
├── css/
│   ├── main.css       # Main styles
│   └── skills.css     # Skills and key UI styles
├── js/
│   ├── app.js         # Main application logic
│   ├── key-manager.js # Key processing and UI handling
│   ├── skills.js      # Skills visualization
│   └── keys.js        # Your permanent achievement keys
└── README.md          # This file
```

## 💡 Best Practices

1. **Test Keys in UI First**: Always use the UI to test keys before permanent storage
2. **Follow Instructions**: The UI provides step-by-step guidance for permanent storage
3. **Copy Carefully**: Use the "Copy Key" button to avoid errors
4. **Format Correctly**: Ensure proper formatting in `keys.js` (commas, quotes)
5. **Commit Regularly**: Save your progress by committing changes

## 🎯 Tips for Success

1. **Immediate Feedback**: UI shows success/error messages instantly
2. **Visual Progress**: Skills bars update as you add keys
3. **Achievement Badges**: New achievements display with animations
4. **Multiple Methods**: Choose the save method that works best for you
5. **Backup**: Keys are stored both locally and in your repository

## 🔗 Game Platform

Earn achievement keys by completing learning games:
[Game Platform](https://AlexViking.github.io/game-platform)

## ❓ Troubleshooting

**Key not working in UI?**
- Check for extra spaces or line breaks
- Ensure the key is complete (long Base64 string)
- Verify it's from the official game platform

**CV not updating after GitHub commit?**
- Wait 1-2 minutes for GitHub Pages to refresh
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check if your commit was successful

**Skills not showing correctly?**
- Ensure `keys.js` has proper JavaScript syntax
- Check browser console for error messages
- Verify all keys are properly quoted

**Instructions not appearing?**
- Key must be valid and successfully processed
- Check if success message appears
- Refresh page if needed

## 📜 Key Format Example

Your `js/keys.js` file should look like this:
```javascript
// Achievement Keys Storage
const achievementKeys = [
    "eyJnYW1lSWQiOiJodG1sLWJhc2ljcy0xIi...",
    "eyJnYW1lSWQiOiJjc3Mtc3R5bGluZy0xIi...",
    // Add more keys as you earn them
];
```

## 🚀 Quick Reference

1. **Earn key** from learning game
2. **Enter key** in CV UI for instant update
3. **Save permanently** using provided instructions
4. **Share CV** at: `https://YOUR-USERNAME.github.io/Student-CV-Template`

## 📝 License

This project is part of the gamified learning platform and is available for educational use.