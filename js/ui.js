/*
 * [F3V3R DR34M] - UI H4NDL3R
 * CR4CK3D BY: Z4R1G4T4
 * 1F U C4N R34D TH1S U R 1337!
 */

class UI {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.currentRoom = 'lobby';
        this.customizationActive = false;
    }

    initializeElements() {
        // Navigation
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.chatTabs = document.querySelectorAll('.chat-tab');
        this.customizeBtn = document.getElementById('customize-btn');
        this.customizationPanel = document.getElementById('customization-panel');
        this.emoteButton = document.getElementById('emote-button');
        
        // Color pickers
        this.primaryColorPicker = document.getElementById('primary-color');
        this.secondaryColorPicker = document.getElementById('secondary-color');
    }

    setupEventListeners() {
        // Navigation buttons
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => this.changeRoom(btn.dataset.room));
        });

        // Chat tabs
        this.chatTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchChatTab(tab.dataset.tab));
        });

        // Customization
        this.customizeBtn.addEventListener('click', () => this.toggleCustomization());
        
        // Color pickers
        this.primaryColorPicker.addEventListener('change', (e) => this.updateColors('primary', e.target.value));
        this.secondaryColorPicker.addEventListener('change', (e) => this.updateColors('secondary', e.target.value));

        // Emote button
        this.emoteButton.addEventListener('click', () => this.showEmotePanel());
    }

    changeRoom(roomName) {
        this.currentRoom = roomName;
        this.navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.room === roomName);
        });
        // Trigger room change in game
        if (window.game) {
            window.game.changeRoom(roomName);
        }
    }

    switchChatTab(tabName) {
        this.chatTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        // Update chat display based on selected tab
        this.updateChatDisplay(tabName);
    }

    updateChatDisplay(tabName) {
        const chatMessages = document.getElementById('chat-messages');
        // Filter messages based on tab
        // Implementation depends on how messages are stored
    }

    toggleCustomization() {
        this.customizationActive = !this.customizationActive;
        this.customizationPanel.classList.toggle('active', this.customizationActive);
    }

    updateColors(type, color) {
        if (window.game && window.game.currentPlayer) {
            if (type === 'primary') {
                window.game.currentPlayer.setPrimaryColor(color);
            } else {
                window.game.currentPlayer.setSecondaryColor(color);
            }
        }
    }

    showEmotePanel() {
        const emotes = ['😊', '😂', '😍', '🎉', '👋', '❤️', '🎮', '🌟'];
        const panel = document.createElement('div');
        panel.className = 'emote-panel';
        panel.style.cssText = `
            position: absolute;
            bottom: 60px;
            left: 10px;
            background: rgba(26, 26, 46, 0.95);
            border: 2px solid var(--primary-color);
            border-radius: 10px;
            padding: 10px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
        `;

        emotes.forEach(emote => {
            const btn = document.createElement('button');
            btn.textContent = emote;
            btn.style.cssText = `
                padding: 5px;
                font-size: 20px;
                background: none;
                border: none;
                cursor: pointer;
                transition: transform 0.2s;
            `;
            btn.addEventListener('mouseover', () => btn.style.transform = 'scale(1.2)');
            btn.addEventListener('mouseout', () => btn.style.transform = 'scale(1)');
            btn.addEventListener('click', () => {
                const chatInput = document.getElementById('chat-input');
                chatInput.value += emote;
                panel.remove();
            });
            panel.appendChild(btn);
        });

        document.body.appendChild(panel);
        
        // Close panel when clicking outside
        const closePanel = (e) => {
            if (!panel.contains(e.target) && e.target !== this.emoteButton) {
                panel.remove();
                document.removeEventListener('click', closePanel);
            }
        };
        setTimeout(() => document.addEventListener('click', closePanel), 0);
    }

    addChatMessage(message, type = 'all') {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${type}`;
        messageElement.innerHTML = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    updateCredits(amount) {
        const creditsElement = document.getElementById('credits');
        creditsElement.textContent = `Credits: ${amount}`;
    }
}
