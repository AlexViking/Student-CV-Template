/**
 * Skills visualization and display functionality
 */

// Initialize the skills display when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
	// Initialize personal information from localStorage or defaults
	initializePersonalInfo();

	// Load and display skills
	const skills = KeyManager.getSkills();
	updateSkillsVisualization(skills);

	// Load and display achievements
	const achievements = KeyManager.getAchievements();
	updateAchievementsDisplay(achievements);
});

/**
 * Initialize personal information from localStorage or defaults
 */
function initializePersonalInfo() {
	// Try to load personal info from localStorage
	const personalInfo = JSON.parse(localStorage.getItem('personalInfo') || '{}');

	// Set default values if not present
	const name = personalInfo.name || 'Student Name';
	const title = personalInfo.title || 'Web Development Student';
	const about = personalInfo.about || 'I am a student learning web development through an innovative gamified learning platform.';

	// Update the DOM
	document.getElementById('student-name').textContent = name;
	document.getElementById('student-title').textContent = title;
	document.getElementById('about-text').textContent = about;
}

/**
 * Update the skills visualization with current data
 * @param {Object} skills - The skills data to visualize
 */
function updateSkillsVisualization(skills) {
	const skillsContainer = document.querySelector('.skills-container');

	// Clear existing skills display
	skillsContainer.innerHTML = '';

	// Create skill items for each skill
	Object.values(skills).forEach(skill => {
		const percentage = Math.min(100, Math.round((skill.points / skill.maxPoints) * 100));

		const skillItem = document.createElement('div');
		skillItem.className = 'skill-item';

		skillItem.innerHTML = `
            <div class="skill-header">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">Level ${skill.level}</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress ${skill.category}" style="width: ${percentage}%"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-top: 2px;">
                <span>${skill.points} points</span>
                <span>${percentage}%</span>
            </div>
        `;

		skillsContainer.appendChild(skillItem);
	});
}

/**
 * Update the achievements display
 * @param {Array} achievements - Achievements to display
 * @param {boolean} [highlightNew=false] - Whether to highlight new achievements
 */
function updateAchievementsDisplay(achievements, highlightNew = false) {
	const achievementsContainer = document.querySelector('.achievements-container');

	// If achievements is empty, show placeholder
	if (!achievements || achievements.length === 0) {
		achievementsContainer.innerHTML = '<p>Complete learning games to earn achievements!</p>';
		return;
	}

	// For just new achievements, add them without clearing
	if (highlightNew) {
		achievements.forEach(achievement => {
			const achievementCard = createAchievementCard(achievement, true);
			achievementsContainer.prepend(achievementCard);
		});
		return;
	}

	// Clear and rebuild all achievements
	achievementsContainer.innerHTML = '';

	// Sort achievements by date (newest first)
	const sortedAchievements = [...achievements].sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	});

	// Create achievement cards
	sortedAchievements.forEach(achievement => {
		const achievementCard = createAchievementCard(achievement);
		achievementsContainer.appendChild(achievementCard);
	});
}

/**
 * Create an achievement card element
 * @param {Object} achievement - The achievement data
 * @param {boolean} [isNew=false] - Whether this is a new achievement
 * @returns {HTMLElement} The achievement card element
 */
function createAchievementCard(achievement, isNew = false) {
	const achievementCard = document.createElement('div');
	achievementCard.className = 'achievement-card';

	if (isNew) {
		achievementCard.classList.add('achievement-new');
	}

	achievementCard.innerHTML = `
        <div class="achievement-icon">${achievement.icon || '🏆'}</div>
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-description">${achievement.description}</div>
        <div class="achievement-date">${achievement.date}</div>
    `;

	return achievementCard;
}