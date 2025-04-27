/**
 * Debug system for Student CV Template
 * Provides pixel-themed debug visualization
 */

class CVDebugger {
	constructor() {
		this.panel = null;
		this.isVisible = false;
		this.enabled = true;
		this.logs = [];
		this.navigationHistory = [];
		this.flowStates = {
			cv: { status: 'active', data: null },
			platform: { status: 'pending', data: null },
			game: { status: 'pending', data: null },
			achievement: { status: 'pending', data: null }
		};
	}

	init() {
		if (this.enabled) {
			this.createDebugPanel();
			this.setupEventListeners();
			this.setupKeyboardShortcuts();
			this.log('Debug mode initialized', 'success');
		}
	}

	enable() {
		this.enabled = true;
		this.init();
	}

	disable() {
		this.enabled = false;
		if (this.panel) {
			this.panel.remove();
			this.panel = null;
		}
	}

	toggle() {
		if (!this.enabled) {
			this.enable();
		} else {
			this.isVisible = !this.isVisible;
			if (this.panel) {
				this.panel.classList.toggle('hidden', !this.isVisible);
			}
		}
	}

	createDebugPanel() {
		this.panel = document.createElement('div');
		this.panel.id = 'debug-panel';
		this.panel.className = 'debug-panel hidden';
		this.panel.innerHTML = `
            <div class="debug-header">
                <h3 class="pixel-text">CV DEBUG CONSOLE</h3>
                <button id="debug-close" class="pixel-btn-small">×</button>
            </div>
            <div class="debug-tabs">
                <button class="debug-tab active" data-tab="flow">Flow</button>
                <button class="debug-tab" data-tab="storage">Storage</button>
                <button class="debug-tab" data-tab="navigation">Navigation</button>
                <button class="debug-tab" data-tab="keys">Keys</button>
                <button class="debug-tab" data-tab="logs">Logs</button>
            </div>
            <div class="debug-content">
                <div id="debug-flow" class="debug-tab-content active">
                    <div class="flow-visualization"></div>
                </div>
                <div id="debug-storage" class="debug-tab-content">
                    <pre id="storage-view"></pre>
                </div>
                <div id="debug-navigation" class="debug-tab-content">
                    <div id="nav-history"></div>
                </div>
                <div id="debug-keys" class="debug-tab-content">
                    <div id="key-list"></div>
                </div>
                <div id="debug-logs" class="debug-tab-content">
                    <div id="log-entries"></div>
                </div>
            </div>
        `;

		document.body.appendChild(this.panel);
	}

	setupEventListeners() {
		// Close button
		document.getElementById('debug-close').addEventListener('click', () => {
			this.toggle();
		});

		// Tab switching
		this.panel.querySelectorAll('.debug-tab').forEach(tab => {
			tab.addEventListener('click', (e) => {
				this.switchTab(e.target.dataset.tab);
			});
		});
	}

	setupKeyboardShortcuts() {
		document.addEventListener('keydown', (e) => {
			// Ctrl + D to toggle debug panel
			if (e.ctrlKey && e.key === 'd') {
				e.preventDefault();
				this.toggle();
			}
		});
	}

	switchTab(tabName) {
		// Update active tab
		this.panel.querySelectorAll('.debug-tab').forEach(tab => {
			tab.classList.toggle('active', tab.dataset.tab === tabName);
		});

		// Show corresponding content
		this.panel.querySelectorAll('.debug-tab-content').forEach(content => {
			content.classList.toggle('active', content.id === `debug-${tabName}`);
		});

		// Refresh tab content
		this.refreshTabContent(tabName);
	}

	refreshTabContent(tabName) {
		switch (tabName) {
			case 'flow':
				this.updateFlowVisualization();
				break;
			case 'storage':
				this.updateStorageView();
				break;
			case 'navigation':
				this.updateNavHistory();
				break;
			case 'keys':
				this.updateKeyList();
				break;
			case 'logs':
				this.updateLogEntries();
				break;
		}
	}

	updateFlowVisualization() {
		const flowContainer = this.panel.querySelector('.flow-visualization');
		const githubUsername = this.getGitHubUsername();

		const flowSteps = [
			{
				id: 'cv',
				title: 'Student CV',
				data: `Username: ${githubUsername || 'Unknown'}`,
				status: this.flowStates.cv.status
			},
			{
				id: 'platform',
				title: 'Game Platform',
				data: this.flowStates.platform.data || 'Not visited yet',
				status: this.flowStates.platform.status
			},
			{
				id: 'game',
				title: 'Game Level',
				data: this.flowStates.game.data || 'No game started',
				status: this.flowStates.game.status
			},
			{
				id: 'achievement',
				title: 'Achievement',
				data: this.flowStates.achievement.data || 'No achievements yet',
				status: this.flowStates.achievement.status
			}
		];

		flowContainer.innerHTML = flowSteps.map((step, index) => `
            <div class="flow-step ${step.status}">
                <span class="flow-number">${index + 1}</span>
                <div class="flow-content">
                    <div class="flow-title">${step.title}</div>
                    <div class="flow-data">${step.data}</div>
                </div>
                ${index < flowSteps.length - 1 ? '<div class="flow-arrow"></div>' : ''}
            </div>
        `).join('');
	}

	updateStorageView() {
		const storageView = document.getElementById('storage-view');
		const storageData = {
			localStorage: {},
			sessionStorage: {}
		};

		// Collect localStorage data
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			try {
				storageData.localStorage[key] = JSON.parse(localStorage.getItem(key));
			} catch {
				storageData.localStorage[key] = localStorage.getItem(key);
			}
		}

		// Collect sessionStorage data
		for (let i = 0; i < sessionStorage.length; i++) {
			const key = sessionStorage.key(i);
			try {
				storageData.sessionStorage[key] = JSON.parse(sessionStorage.getItem(key));
			} catch {
				storageData.sessionStorage[key] = sessionStorage.getItem(key);
			}
		}

		storageView.textContent = JSON.stringify(storageData, null, 2);
	}

	updateNavHistory() {
		const navHistory = document.getElementById('nav-history');

		navHistory.innerHTML = this.navigationHistory.map((entry, index) => `
            <div class="nav-entry">
                <span class="nav-time">${entry.time}</span>
                <span class="nav-from">${entry.from}</span>
                <span class="nav-arrow">→</span>
                <span class="nav-to">${entry.to}</span>
                <div class="nav-data">${JSON.stringify(entry.data || {})}</div>
            </div>
        `).join('');
	}

	updateKeyList() {
		const keyList = document.getElementById('key-list');
		const keys = this.getAchievementKeys();

		keyList.innerHTML = keys.map(key => `
            <div class="key-entry">
                <div class="key-game">${key.gameId}</div>
                <div class="key-status">${key.status}</div>
                <div class="key-preview">${key.key.substring(0, 30)}...</div>
                <div class="key-timestamp">Added: ${new Date(key.timestamp * 1000).toLocaleString()}</div>
            </div>
        `).join('');
	}

	updateLogEntries() {
		const logContainer = document.getElementById('log-entries');
		logContainer.innerHTML = this.logs.map(log => `
            <div class="log-entry ${log.type}">
                <span class="log-time">[${log.time}]</span>
                <span class="log-message">${log.message}</span>
            </div>
        `).join('');
		logContainer.scrollTop = logContainer.scrollHeight;
	}

	// Public API methods
	log(message, type = 'info') {
		if (!this.enabled) return;

		const time = new Date().toLocaleTimeString();
		this.logs.push({ time, message, type });

		if (this.isVisible) {
			this.updateLogEntries();
		}

		// Also log to console with styling
		const consoleStyles = {
			info: 'color: #3b82f6',
			success: 'color: #10b981',
			warning: 'color: #f59e0b',
			error: 'color: #f43f5e'
		};

		console.log(`%c[CV Debug] ${message}`, consoleStyles[type] || '');
	}

	trackNavigation(from, to, data = {}) {
		if (!this.enabled) return;

		this.navigationHistory.push({
			time: new Date().toLocaleTimeString(),
			from,
			to,
			data
		});

		// Update flow states
		if (from === 'Student CV' && to === 'Game Platform') {
			this.flowStates.cv.status = 'completed';
			this.flowStates.platform.status = 'active';
			this.flowStates.platform.data = `Selected games: ${data.completedGames?.join(', ') || 'none'}`;
		}

		if (this.isVisible) {
			this.updateNavHistory();
			this.updateFlowVisualization();
		}
	}

	updateFlowState(step, status, data = null) {
		if (!this.enabled) return;

		if (this.flowStates[step]) {
			this.flowStates[step].status = status;
			if (data) {
				this.flowStates[step].data = data;
			}

			if (this.isVisible) {
				this.updateFlowVisualization();
			}
		}
	}

	// Helper methods
	getGitHubUsername() {
		const url = window.location.href;
		const match = url.match(/https?:\/\/([^.]+)\.github\.io/i);
		return match ? match[1] : null;
	}

	getAchievementKeys() {
		try {
			const keys = JSON.parse(localStorage.getItem('verifiedKeys') || '[]');
			return keys.map(key => {
				try {
					const decodedKey = JSON.parse(atob(key));
					return {
						gameId: decodedKey.gameId,
						status: 'Verified',
						key: key,
						timestamp: decodedKey.timestamp
					};
				} catch {
					return {
						gameId: 'Unknown',
						status: 'Invalid',
						key: key,
						timestamp: null
					};
				}
			});
		} catch {
			return [];
		}
	}
}

// Initialize debug system
window.debug = new CVDebugger();