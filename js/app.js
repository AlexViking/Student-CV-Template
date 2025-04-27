/**
 * Main application functionality - Enhanced for circular flow
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

	// Check if returning from a game with a key
	checkForNewKey();
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
        <button id="go-to-platform" class="pixel-btn">Go to Game Platform</button>
    `;

	mainElement.appendChild(platformSection);

	// Add click handler for game platform navigation
	document.getElementById('go-to-platform').addEventListener('click', navigateToGamePlatform);
}

/**
 * Navigate to game platform with current user data
 */
function navigateToGamePlatform() {
	// Get current user progress
	const skills = KeyManager.getSkills();
	const achievements = KeyManager.getAchievements();
	const githubUsername = getGitHubUsername();

	// Calculate completed games
	const completedGames = getCompletedGames(achievements);

	// Build URL with user data
	const platformUrl = new URL('https://AlexViking.github.io/game-platform');
	platformUrl.searchParams.append('student', githubUsername || 'unknown');
	platformUrl.searchParams.append('completed', JSON.stringify(completedGames));
	platformUrl.searchParams.append('return_url', window.location.href);

	// Navigate in same tab
	window.location.href = platformUrl.toString();
}

/**
 * Get list of completed games from achievements
 */
function getCompletedGames(achievements) {
	const gameMap = {
		'internet-basics': 'Internet Basics',
		'html-fundamentals': 'HTML Fundamentals',
		'css-styling': 'CSS Styling',
		'javascript-basics': 'JavaScript Basics'
	};

	const completedGames = [];

	achievements.forEach(achievement => {
		// Extract game ID from achievement
		for (const [gameId, gameName] of Object.entries(gameMap)) {
			if (achievement.title.includes(gameName) || achievement.description.includes(gameName)) {
				if (!completedGames.includes(gameId)) {
					completedGames.push(gameId);
				}
			}
		}
	});

	return completedGames;
}

/**
 * Check if returning from a game with a new key
 */
function checkForNewKey() {
	const urlParams = new URLSearchParams(window.location.search);
	const newKey = urlParams.get('key');

	if (newKey) {
		// Automatically add the key
		const result = KeyManager.process(newKey);

		if (result.success) {
			// Update skills visualization
			updateSkillsVisualization(result.updatedSkills);

			// Update achievements
			updateAchievementsDisplay(result.newAchievements, true);

			// Show success message
			showNotification('Achievement key added successfully!', 'success');

			// Show permanent save instructions
			const instructionsDiv = document.getElementById('permanent-save-instructions');
			if (instructionsDiv) {
				instructionsDiv.innerHTML = KeyManager.generatePermanentSaveInstructions(newKey);
				instructionsDiv.style.display = 'block';
			}
		} else {
			showNotification('Failed to process achievement key: ' + result.message, 'error');
		}

		// Clean up URL
		window.history.replaceState({}, document.title, window.location.pathname);
	}
}

/**
 * Show notification message
 */
function showNotification(message, type) {
	const notification = document.createElement('div');
	notification.className = `notification ${type}`;
	notification.textContent = message;
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		padding: 15px 25px;
		border-radius: 5px;
		color: white;
		background-color: ${type === 'success' ? '#10b981' : '#f43f5e'};
		z-index: 1000;
		animation: slideIn 0.5s ease-out;
	`;

	document.body.appendChild(notification);

	setTimeout(() => {
		notification.style.animation = 'slideOut 0.5s ease-out';
		setTimeout(() => {
			document.body.removeChild(notification);
		}, 500);
	}, 3000);
}

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
	@keyframes slideIn {
		from { transform: translateX(100%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}
	@keyframes slideOut {
		from { transform: translateX(0); opacity: 1; }
		to { transform: translateX(100%); opacity: 0; }
	}
`;
document.head.appendChild(style);