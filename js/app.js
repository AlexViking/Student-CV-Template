/**
 * Main application functionality with improved structure and debug mode
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
	// Check if debug mode is enabled via URL parameter
	if (window.location.search.includes('debug=true')) {
		window.debug.enable();
	}

	// Initialize the application
	initializeApp();

	// Load and process achievement keys from keys.js
	loadAndProcessKeys();

	// Setup navigation handlers
	setupNavigationHandlers();

	// Update personal info UI with GitHub username
	updatePersonalInfo();

	// Check if returning from a game with a key
	checkForNewKey();

	// Initialize debug mode if configured
	window.debug.init();
});

/**
 * Initialize the application with default data
 */
function initializeApp() {
	window.debug.log('Initializing application', 'info');

	// Check if this is the first time launching the app
	if (!localStorage.getItem('appInitialized')) {
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
			window.debug.log('Default personal info set', 'info');
		}

		// Initialize empty achievements array
		if (!localStorage.getItem('achievements')) {
			localStorage.setItem('achievements', JSON.stringify([]));
		}

		// Initialize empty verified keys array
		if (!localStorage.getItem('verifiedKeys')) {
			localStorage.setItem('verifiedKeys', JSON.stringify([]));
		}

		window.debug.log('Application initialized with username: ' + githubUsername, 'success');
	}
}

/**
 * Extract GitHub username from URL
 * @returns {string|null} GitHub username or null if not found
 */
function getGitHubUsername() {
	const url = window.location.href;
	const match = url.match(/https?:\/\/([^.]+)\.github\.io/i);

	if (match && match[1]) {
		window.debug.log('GitHub username extracted: ' + match[1], 'info');
		return match[1];
	}

	window.debug.log('Could not extract GitHub username from URL', 'warning');
	return null;
}

/**
 * Update personal information in the UI
 */
function updatePersonalInfo() {
	const personalInfo = JSON.parse(localStorage.getItem('personalInfo') || '{}');

	// Update DOM elements
	document.getElementById('student-name').textContent = personalInfo.name || 'Student Name';
	document.getElementById('student-title').textContent = personalInfo.title || 'Web Development Student';
	document.getElementById('about-text').textContent = personalInfo.about || 'I am a student learning web development through an innovative gamified learning platform.';

	window.debug.log('Personal info updated in UI', 'info');
}

/**
 * Load and process achievement keys from keys.js
 */
function loadAndProcessKeys() {
	// Check if achievementKeys is defined (from keys.js)
	if (typeof achievementKeys !== 'undefined' && Array.isArray(achievementKeys)) {
		window.debug.log(`Found ${achievementKeys.length} achievement keys to process`, 'info');

		// Process each key
		achievementKeys.forEach(key => {
			if (key && key.trim()) {
				const result = KeyManager.process(key.trim());

				if (result.success) {
					window.debug.log('Successfully processed key from keys.js', 'success');
				} else {
					window.debug.log('Failed to process key from keys.js: ' + result.message, 'error');
				}
			}
		});

		// Refresh the UI to show updated skills and achievements
		const skills = KeyManager.getSkills();
		updateSkillsVisualization(skills);

		const achievements = KeyManager.getAchievements();
		updateAchievementsDisplay(achievements);
	} else {
		window.debug.log('No achievement keys found in keys.js', 'warning');
	}
}

/**
 * Setup navigation handlers
 */
function setupNavigationHandlers() {
	// Add click handler for game platform navigation
	document.getElementById('go-to-platform').addEventListener('click', navigateToGamePlatform);

	// Add debug mode toggle handler
	document.getElementById('debug-mode-toggle').addEventListener('click', function () {
		window.debug.toggle();
	});
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
	const platformUrl = new URL(CV_CONFIG.PLATFORM_URL);
	platformUrl.searchParams.append('student', githubUsername || 'unknown');
	platformUrl.searchParams.append('completed', JSON.stringify(completedGames));
	platformUrl.searchParams.append('return_url', window.location.href);

	window.debug.log('Navigating to game platform', 'info');
	window.debug.trackNavigation('Student CV', 'Game Platform', {
		student: githubUsername,
		completedGames: completedGames
	});

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
		window.debug.log('Returned from game with new key', 'info');

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