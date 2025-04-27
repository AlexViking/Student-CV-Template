/**
 * Main application functionality
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
	// Check if this is the first time launching the app
	if (!localStorage.getItem('appInitialized')) {
		initializeApp();
	}

	// Load and process achievement keys from keys.js
	loadAndProcessKeys();

	// Add button to navigate to Game Platform
	addGamePlatformButton();

	// Update personal info UI with GitHub username
	updatePersonalInfo();
});

/**
 * Initialize the application with default data
 */
function initializeApp() {
	// Set flag to prevent re-initialization
	localStorage.setItem('appInitialized', 'true');

	// Get GitHub username from URL
	const githubUsername = getGitHubUsername();

	// Set default personal info with GitHub username
	if (!localStorage.getItem('personalInfo')) {
		const defaultInfo = {
			name: githubUsername || 'Student Name',
			title: 'Web Development Student',
			about: 'I am a student learning web development through an innovative gamified learning platform.'
		};
		localStorage.setItem('personalInfo', JSON.stringify(defaultInfo));
	}

	// Initialize empty achievements array
	if (!localStorage.getItem('achievements')) {
		localStorage.setItem('achievements', JSON.stringify([]));
	}

	// Initialize empty verified keys array
	if (!localStorage.getItem('verifiedKeys')) {
		localStorage.setItem('verifiedKeys', JSON.stringify([]));
	}

	// Log initialization
	console.log('Application initialized with GitHub username:', githubUsername);
}

/**
 * Extract GitHub username from URL
 * @returns {string|null} GitHub username or null if not found
 */
function getGitHubUsername() {
	// Get current URL
	const url = window.location.href;

	// Extract username from GitHub Pages URL pattern
	// Example: https://username.github.io/Student-CV-Template/
	const match = url.match(/https?:\/\/([^.]+)\.github\.io/i);

	if (match && match[1]) {
		return match[1];
	}

	return null;
}

/**
 * Update personal information in the UI
 */
function updatePersonalInfo() {
	const personalInfo = JSON.parse(localStorage.getItem('personalInfo') || '{}');

	// Update DOM elements
	const nameElement = document.getElementById('student-name');
	const titleElement = document.getElementById('student-title');
	const aboutElement = document.getElementById('about-text');

	if (nameElement) {
		nameElement.textContent = personalInfo.name || 'Student Name';
	}

	if (titleElement) {
		titleElement.textContent = personalInfo.title || 'Web Development Student';
	}

	if (aboutElement) {
		aboutElement.textContent = personalInfo.about || 'I am a student learning web development through an innovative gamified learning platform.';
	}
}

/**
 * Load and process achievement keys from keys.js
 */
function loadAndProcessKeys() {
	// Check if achievementKeys is defined (from keys.js)
	if (typeof achievementKeys !== 'undefined' && Array.isArray(achievementKeys)) {
		console.log('Found', achievementKeys.length, 'achievement keys to process');

		// Process each key
		achievementKeys.forEach(key => {
			if (key && key.trim()) {
				const result = KeyManager.process(key.trim());

				if (result.success) {
					console.log('Successfully processed key from keys.js');
				} else {
					console.log('Failed to process key from keys.js:', result.message);
				}
			}
		});

		// Refresh the UI to show updated skills and achievements
		const skills = KeyManager.getSkills();
		updateSkillsVisualization(skills);

		const achievements = KeyManager.getAchievements();
		updateAchievementsDisplay(achievements);
	} else {
		console.log('No achievement keys found in keys.js');
	}
}

/**
 * Add a button to navigate to the Game Platform
 */
function addGamePlatformButton() {
	const mainElement = document.querySelector('main');

	const platformSection = document.createElement('section');
	platformSection.id = 'platform-link';

	platformSection.innerHTML = `
        <h2>Learning Games Platform</h2>
        <p>Ready to improve your skills? Visit our Game Platform to access interactive learning games and earn achievement keys.</p>
        <a href="https://AlexViking.github.io/game-platform" class="pixel-btn" target="_blank">Go to Game Platform</a>
    `;

	mainElement.appendChild(platformSection);
}