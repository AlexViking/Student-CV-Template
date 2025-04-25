/**
 * Key Manager Module
 * Handles achievement key validation, processing, and skills updating
 */
const KeyManager = (function () {
	// Private variables
	const verifiedKeys = [];

	// Load existing skills from localStorage
	const loadSkills = function () {
		const storedSkills = localStorage.getItem('skills');
		if (storedSkills) {
			return JSON.parse(storedSkills);
		}
		return {
			// Default initial skills with zero progress
			"html": { name: "HTML", category: "frontend", points: 0, level: 0, maxPoints: 100 },
			"css": { name: "CSS", category: "frontend", points: 0, level: 0, maxPoints: 100 },
			"js": { name: "JavaScript", category: "frontend", points: 0, level: 0, maxPoints: 150 },
			"networking": { name: "Network Basics", category: "backend", points: 0, level: 0, maxPoints: 80 },
			"problem-solving": { name: "Problem Solving", category: "soft", points: 0, level: 0, maxPoints: 120 },
			"web-standards": { name: "Web Standards", category: "industry", points: 0, level: 0, maxPoints: 70 }
		};
	};

	// Load verified keys from storage
	const loadKeys = function () {
		const storedKeys = localStorage.getItem('verifiedKeys');
		if (storedKeys) {
			return JSON.parse(storedKeys);
		}
		return [];
	};

	// Save verified keys to storage
	const saveKeys = function (keys) {
		localStorage.setItem('verifiedKeys', JSON.stringify(keys));
	};

	// Save skills to storage
	const saveSkills = function (skills) {
		localStorage.setItem('skills', JSON.stringify(skills));
	};

	// Decode base64 key to JSON
	const decodeKey = function (key) {
		try {
			const decodedString = atob(key);
			return JSON.parse(decodedString);
		} catch (e) {
			console.error('Invalid key format', e);
			return null;
		}
	};

	// Calculate level based on points
	const calculateLevel = function (points) {
		if (points >= 200) return 5;
		if (points >= 100) return 4;
		if (points >= 50) return 3;
		if (points >= 25) return 2;
		if (points >= 10) return 1;
		return 0;
	};

	// Verify key authenticity (simplified for demo)
	const verifyKey = function (keyData) {
		// In a real implementation, this would verify the signature
		// For the demo, we'll just check the structure
		return keyData &&
			keyData.gameId &&
			keyData.timestamp &&
			Array.isArray(keyData.achievements) &&
			keyData.signature;
	};

	// Update skills based on key data
	const updateSkills = function (keyData) {
		// Load current skills
		const currentSkills = loadSkills();
		const newAchievements = [];

		// Process each achievement
		keyData.achievements.forEach(achievement => {
			const { skillId, points, description } = achievement;

			// Skip if skill doesn't exist in our tracking
			if (!currentSkills[skillId]) return;

			// Add points
			currentSkills[skillId].points += points;

			// Update level based on points
			const newLevel = calculateLevel(currentSkills[skillId].points);
			if (newLevel > currentSkills[skillId].level) {
				currentSkills[skillId].level = newLevel;

				// Store achievement for display
				newAchievements.push({
					skillId,
					title: `${currentSkills[skillId].name} Level ${newLevel}`,
					description,
					date: new Date().toISOString().split('T')[0],
					icon: '🏆'
				});
			}
		});

		// Save updated skills
		saveSkills(currentSkills);

		// Store new achievements
		const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
		achievements.push(...newAchievements);
		localStorage.setItem('achievements', JSON.stringify(achievements));

		return {
			updatedSkills: currentSkills,
			newAchievements
		};
	};

	// Initialize from localStorage
	const init = function () {
		// Load verified keys
		const storedKeys = loadKeys();
		if (storedKeys.length > 0) {
			verifiedKeys.push(...storedKeys);
		}

		// Initialize skills if they don't exist
		if (!localStorage.getItem('skills')) {
			const initialSkills = loadSkills();
			saveSkills(initialSkills);
		}

		// Initialize achievements array if it doesn't exist
		if (!localStorage.getItem('achievements')) {
			localStorage.setItem('achievements', JSON.stringify([]));
		}
	};

	// Public API
	return {
		init,

		validate: function (key) {
			const keyData = decodeKey(key);
			return verifyKey(keyData);
		},

		process: function (key) {
			// Check if key was already processed
			if (verifiedKeys.includes(key)) {
				return { success: false, message: 'Key already used' };
			}

			// Decode and verify
			const keyData = decodeKey(key);
			if (!keyData) {
				return { success: false, message: 'Invalid key format' };
			}

			if (!verifyKey(keyData)) {
				return { success: false, message: 'Invalid key' };
			}

			// Update skills
			const { updatedSkills, newAchievements } = updateSkills(keyData);

			// Add to verified keys
			verifiedKeys.push(key);
			saveKeys(verifiedKeys);

			return {
				success: true,
				message: 'Skills updated successfully',
				updatedSkills,
				newAchievements
			};
		},

		getSkills: function () {
			return loadSkills();
		},

		getAchievements: function () {
			return JSON.parse(localStorage.getItem('achievements') || '[]');
		}
	};
})();

// Initialize the KeyManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
	KeyManager.init();

	// Handle key submission form
	document.getElementById('key-form').addEventListener('submit', function (e) {
		e.preventDefault();
		const keyInput = document.getElementById('achievement-key');
		const resultDiv = document.getElementById('key-result');

		const result = KeyManager.process(keyInput.value);

		resultDiv.className = result.success ? 'result-success' : 'result-error';
		resultDiv.textContent = result.message;
		resultDiv.style.display = 'block';

		if (result.success) {
			// Update skills visualization
			updateSkillsVisualization(result.updatedSkills);

			// Update achievements
			updateAchievementsDisplay(result.newAchievements, true);

			// Clear input
			keyInput.value = '';
		}

		// Hide result message after 5 seconds
		setTimeout(() => {
			resultDiv.style.display = 'none';
		}, 5000);
	});
});