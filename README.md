# Student-CV-Template

Interactive CV template for students learning web development through the gamified learning platform.

## 🚀 Getting Started

### How to Use This Template

1. **Fork this Repository**
   - Click the "Fork" button at the top right of this GitHub repository
   - This creates your own copy of the repository under your GitHub account

2. **Enable GitHub Pages**
   - Go to your forked repository's "Settings" tab
   - Scroll down to the "GitHub Pages" section
   - In the "Source" dropdown, select "main" branch
   - Click "Save"
   - GitHub will generate a public URL for your CV (typically `https://[your-username].github.io/Student-CV-Template/`)
   - Wait a few minutes for your site to be published

3. **Customize Your CV**
   - You can edit your CV in three ways:
     - Edit directly on GitHub (easiest but limited)
     - Clone the repository and edit locally using VSCode or another editor
     - Use GitHub Codespaces (browser-based development environment)

### Personalizing Your CV

#### Option 1: Manual Editing
Edit the following files to personalize your CV:

1. **Edit index.html** to change:
   - Title tag (line 9): `<title>Your Name - Web Developer</title>`

2. **Edit js/app.js** to modify personal information:
   - Find the `initializeApp` function around line 28
   - Update the `defaultInfo` object with your information:
   ```javascript
   const defaultInfo = {
     name: 'Your Full Name',
     title: 'Your Title/Position',
     about: 'Your personal description goes here...'
   };
   ```

3. **Edit css/main.css** or **css/skills.css** if you want to change styling

#### Option 2: Using the Browser Interface
The CV has local storage functionality. When you first load your CV page:

1. The default information is loaded
2. You can update this information using browser dev tools (instructions below)

## 🎮 Adding Achievement Keys

When you complete learning games on the platform, you'll receive achievement keys. Here's how to add them:

### Method 1: Using the CV Interface (Temporary, Browser-Only)
1. Navigate to your CV page
2. Find the "Add Achievement Key" section
3. Paste your achievement key into the input field
4. Click "Submit Key"

**Important Note:** This method saves your achievements only in your browser's local storage. This means:
- Your achievements will only be visible on YOUR device and browser
- Other people viewing your CV online (like teachers or parents) WON'T see these achievements
- If you clear your browser data, you'll lose your achievements

### Method 2: Permanent Storage (Recommended for Sharing)
For achievements that anyone can see when visiting your CV:

1. After adding keys using Method 1, click the "Export Achievements" button at the bottom of the Achievements section
2. This will download a file called `my-achievements.json`
3. In your GitHub repository:
   - Click "Add file" > "Upload files"
   - Upload the `my-achievements.json` file
   - Write a commit message like "Add my achievements"
   - Click "Commit changes"
4. Wait a few minutes for GitHub Pages to update

Now your achievements will be permanently stored in your repository and visible to anyone who views your CV online!

### Method 3: Manual Editing (For Advanced Users)
If you prefer direct editing:

1. Create a file named `my-achievements.json` in your repository
2. Add your achievements in this format:
```json
{
  "verifiedKeys": [
    "base64EncodedKey1",
    "base64EncodedKey2"
  ],
  "skills": {
    "html": { "name": "HTML", "category": "frontend", "points": 25, "level": 2, "maxPoints": 100 },
    "css": { "name": "CSS", "category": "frontend", "points": 10, "level": 1, "maxPoints": 100 }
  },
  "achievements": [
    {
      "skillId": "html",
      "title": "HTML Level 2",
      "description": "Completed HTML Fundamentals",
      "date": "2025-04-26",
      "icon": "📄"
    }
  ]
}

## 🔧 Advanced Customization

### Modifying Skills
The template comes with predefined skills. To add or modify skills:

1. Edit `js/key-manager.js`
2. Find the `loadSkills` function (around line 12)
3. Add or modify skills in the default skills object

Example:
```javascript
return {
  "html": { name: "HTML", category: "frontend", points: 10, level: 1, maxPoints: 100 },
  "new-skill": { name: "New Skill", category: "frontend", points: 0, level: 0, maxPoints: 100 }
};
```

### Manually Adding Achievements
You can manually add achievements for skills you already have:

1. Open browser dev tools and access Local Storage
2. Find the `achievements` item
3. Add new achievement objects following this format:
```json
[
  {
    "skillId": "html",
    "title": "HTML Level 2",
    "description": "Completed HTML Fundamentals",
    "date": "2025-04-26",
    "icon": "📄"
  }
]
```

## 📚 Technical Notes

- This template uses browser local storage to maintain your CV data
- Your achievements and skills are stored in your browser
- If you switch browsers or clear browser data, you'll need to re-add your keys

## 🤝 Contributing

If you have suggestions for improving this template:

1. Fork the repository
2. Create a new branch for your features
3. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Help & Support

If you encounter any issues, please submit them in the repository's Issues section.