/**
 * Configuration file for Student CV Template
 */

const CV_CONFIG = {
	// Platform URL - Update this to your deployed Learning Games Platform URL
	PLATFORM_URL: 'https://AlexViking.github.io/game-platform',

	// Debug mode settings
	DEBUG: {
		ENABLED_BY_DEFAULT: false,
		KEYBOARD_SHORTCUT: true,
		LOG_TO_CONSOLE: true
	},

	// Skills configuration
	SKILLS: {
		DEFAULT_SKILLS: {
			"internet": {
				name: "Internet Basics",
				category: "backend",
				points: 0,
				level: 0,
				maxPoints: 100,
				color: "#3b82f6"
			},
			"html": {
				name: "HTML",
				category: "frontend",
				points: 0,
				level: 0,
				maxPoints: 100,
				color: "#e34c26"
			},
			"css": {
				name: "CSS",
				category: "frontend",
				points: 0,
				level: 0,
				maxPoints: 100,
				color: "#264de4"
			},
			"js": {
				name: "JavaScript",
				category: "frontend",
				points: 0,
				level: 0,
				maxPoints: 150,
				color: "#f7df1e"
			},
			"networking": {
				name: "Network Basics",
				category: "backend",
				points: 0,
				level: 0,
				maxPoints: 80,
				color: "#10b981"
			},
			"problem-solving": {
				name: "Problem Solving",
				category: "soft",
				points: 0,
				level: 0,
				maxPoints: 120,
				color: "#8b5cf6"
			},
			"web-standards": {
				name: "Web Standards",
				category: "industry",
				points: 0,
				level: 0,
				maxPoints: 70,
				color: "#f59e0b"
			}
		},
		LEVEL_THRESHOLDS: {
			1: 10,
			2: 25,
			3: 50,
			4: 100,
			5: 200
		}
	},

	// Game mapping
	GAMES: {
		'internet-basics': {
			title: 'Internet Basics',
			icon: '🌐',
			prerequisites: []
		},
		'html-fundamentals': {
			title: 'HTML Fundamentals',
			icon: '📄',
			prerequisites: ['internet-basics']
		},
		'css-styling': {
			title: 'CSS Styling',
			icon: '🎨',
			prerequisites: ['internet-basics', 'html-fundamentals']
		},
		'javascript-basics': {
			title: 'JavaScript Basics',
			icon: '📜',
			prerequisites: ['html-fundamentals']
		}
	},

	// Achievement icons
	ACHIEVEMENT_ICONS: {
		'internet': '🌐',
		'html': '📄',
		'css': '🎨',
		'js': '📜',
		'networking': '📡',
		'problem-solving': '🧩',
		'web-standards': '📋',
		'default': '🏆'
	},

	// UI Configuration
	UI: {
		ANIMATION_DURATION: 1000,
		NOTIFICATION_DURATION: 3000,
		SHOW_DEBUG_BUTTON: true
	},

	// Storage keys
	STORAGE_KEYS: {
		APP_INITIALIZED: 'appInitialized',
		PERSONAL_INFO: 'personalInfo',
		ACHIEVEMENTS: 'achievements',
		VERIFIED_KEYS: 'verifiedKeys',
		SKILLS: 'skills',
		GAME_ATTEMPTS: 'keyAttempts'
	}
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = CV_CONFIG;
}