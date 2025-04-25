/**
 * Enhanced Key Manager Module
 * Secure handling of achievement key validation, processing, and skills updating
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
			"internet": { name: "Internet Basics", category: "backend", points: 0, level: 0, maxPoints: 100 },
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

	// Get student information
	const getStudentInfo = function () {
		const personalInfo = JSON.parse(localStorage.getItem('personalInfo') || '{}');
		return {
			id: personalInfo.githubUsername || localStorage.getItem('studentId') || 'unknown',
			name: personalInfo.name || 'Student'
		};
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

	// Verify key authenticity
	const verifyKey = function (keyData) {
		// Check if the key has the required fields
		if (!keyData || !keyData.gameId || !keyData.timestamp ||
			!Array.isArray(keyData.achievements) || !keyData.signature) {
			return false;
		}

		// Check if the key is expired (keys valid for 30 days)
		const currentTime = Math.floor(Date.now() / 1000);
		const keyAge = currentTime - keyData.timestamp;
		const maxKeyAge = 30 * 24 * 60 * 60; // 30 days in seconds

		if (keyAge > maxKeyAge) {
			console.error('Key has expired');
			return false;
		}

		// Verify student ID if present
		const student = getStudentInfo();
		if (keyData.studentId && keyData.studentId !== student.id) {
			console.error('Key was generated for a different student');
			return false;
		}

		// Verify signature
		const originalSignature = keyData.signature;

		// Create a copy for signature verification
		const dataForVerification = { ...keyData };
		delete dataForVerification.signature;

		// Recalculate signature
		const calculatedSignature = generateHMAC(dataForVerification);

		// Compare signatures
		return originalSignature === calculatedSignature;
	};

	// Generate HMAC for verification
	const generateHMAC = function (data) {
		// In a real implementation, this would be a proper HMAC function
		// identical to the one used in key generation

		// Convert to a string
		const dataString = JSON.stringify(data);

		// Combine with the same "secret key" used in key generation
		const secretKey = "CV_PLATFORM_SECRET_KEY_2025";

		// Create a hash of the combined string
		const combinedString = secretKey + dataString + secretKey;
		return hashString(combinedString);
	};

	// Simple hash function (same as in key-generator.js)
	const hashString = function (str) {
		let hash = 0;

		if (str.length === 0) return hash.toString(16);

		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32bit integer
		}

		return hash.toString(16).replace('-', 'n');
	};

	// Check for prerequisites
	const checkPrerequisites = function (gameId) {
		// Game prerequisites mapping
		const prerequisites = {
			'html-fundamentals': ['internet-basics'],
			'css-styling': ['internet-basics', 'html-fundamentals'],
			'javascript-basics': ['html-fundamentals']
			// Add more as needed
		};

		// If no prerequisites or game not in the list, return true
		if (!prerequisites[gameId]) {
			return true;
		}

		// Get current skills
		const skills = loadSkills();

		// Check if all prerequisites have at least level 1
		for (const prereq of prerequisites[gameId]) {
			// Convert prerequisite to skill ID (e.g., 'internet-basics' -> 'internet')
			const skillId = prereq.split('-')[0];

			if (!skills[skillId] || skills[skillId].level < 1) {
				return false;
			}
		}

		return true;
	};

	// Update skills based on key data
	const updateSkills = function (keyData) {
		// Load current skills
		const currentSkills = loadSkills();
		const newAchievements = [];

		// Check prerequisites for this game
		if (!checkPrerequisites(keyData.gameId)) {
			return {
				updatedSkills: currentSkills,
				newAchievements: [],
				error: 'Prerequisites not met for this achievement. Complete required courses first.'
			};
		}

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
					icon: getSkillIcon(skillId)
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
			newAchievements,
			error: null
		};
	};

	// Get an appropriate icon for a skill
	const getSkillIcon = function (skillId) {
		const icons = {
			'internet': '🌐',
			'html': '📄',
			'css': '🎨',
			'js': '📜',
			'networking': '📡',
			'problem-solving': '🧩',
			'web-standards': '📋'
		};

		return icons[skillId] || '🏆';
	};

	// Log key verification attempt for security
	const logVerificationAttempt = function (key, success, reason) {
		const attempts = JSON.parse(localStorage.getItem('keyAttempts') || '[]');

		attempts.push({
			timestamp: new Date().toISOString(),
			keyFragment: key.substring(0, 10) + '...',
			success,
			reason
		});

		// Keep only the last 50 attempts
		if (attempts.length > 50) {
			attempts.shift();
		}

		localStorage.setItem('keyAttempts', JSON.stringify(attempts));
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

		// Initialize key attempt log if it doesn't exist
		if (!localStorage.getItem('keyAttempts')) {
			localStorage.setItem('keyAttempts', JSON.stringify([]));
		}
	};

	// Public API
	return {
		init,

		validate: function (key) {
			const keyData = decodeKey(key);
			const isValid = verifyKey(keyData);

			// Log the verification attempt
			logVerificationAttempt(key, isValid, isValid ? 'Valid key' : 'Invalid signature or format');

			return isValid;
		},

		process: function (key) {
			// Check if key was already processed
			if (verifiedKeys.includes(key)) {
				logVerificationAttempt(key, false, 'Key already used');
				return { success: false, message: 'Key already used' };
			}

			// Decode and verify
			const keyData = decodeKey(key);
			if (!keyData) {
				logVerificationAttempt(key, false, 'Invalid key format');
				return { success: false, message: 'Invalid key format' };
			}

			if (!verifyKey(keyData)) {
				logVerificationAttempt(key, false, 'Invalid key signature');
				return { success: false, message: 'Invalid key' };
			}

			// Update skills
			const { updatedSkills, newAchievements, error } = updateSkills(keyData);

			if (error) {
				logVerificationAttempt(key, false, error);
				return { success: false, message: error };
			}

			// Add to verified keys
			verifiedKeys.push(key);
			saveKeys(verifiedKeys);

			logVerificationAttempt(key, true, 'Successfully processed');

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
		},

		getVerificationLog: function () {
			return JSON.parse(localStorage.getItem('keyAttempts') || '[]');
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