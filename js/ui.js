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
        this.avatar = new Avatar();
        this.setupAvatarPreview();
    }

    initializeElements() {
        // Navigation
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.chatTabs = document.querySelectorAll('.chat-tab');
        this.customizeBtn = document.getElementById('customize-btn');
        this.customizationPanel = document.getElementById('customization-panel');
        this.emoteButton = document.getElementById('emote-button');
        
        // Avatar customization
        this.styleButtons = document.querySelectorAll('.style-btn');
        this.colorInputs = {
            body: document.getElementById('body-color'),
            hair: document.getElementById('hair-color'),
            eyes: document.getElementById('eye-color'),
            outfitTop: document.getElementById('outfit-top-color'),
            outfitBottom: document.getElementById('outfit-bottom-color')
        };
        
        // Preview elements
        this.avatarPreviewLogin = document.getElementById('avatar-preview-login');
        this.avatarPreviewTop = document.getElementById('avatar-preview');
        this.avatarPreviewCustomization = document.querySelector('.avatar-preview-large');
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
        
        // Style buttons
        this.styleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const part = btn.dataset.part;
                const style = btn.dataset.style;
                const subpart = btn.dataset.subpart;
                
                if (subpart) {
                    this.avatar.setPartType(part, style, subpart);
                } else {
                    this.avatar.setPartType(part, style);
                }
                
                this.updateAvatarPreviews();
            });
        });

        // Color inputs
        this.colorInputs.body.addEventListener('change', (e) => {
            this.avatar.setPartColor('body', e.target.value);
            this.updateAvatarPreviews();
        });

        this.colorInputs.hair.addEventListener('change', (e) => {
            this.avatar.setPartColor('hair', e.target.value);
            this.updateAvatarPreviews();
        });

        this.colorInputs.eyes.addEventListener('change', (e) => {
            this.avatar.setPartColor('eyes', e.target.value);
            this.updateAvatarPreviews();
        });

        this.colorInputs.outfitTop.addEventListener('change', (e) => {
            this.avatar.setPartColor('outfit', e.target.value, 'top');
            this.updateAvatarPreviews();
        });

        this.colorInputs.outfitBottom.addEventListener('change', (e) => {
            this.avatar.setPartColor('outfit', e.target.value, 'bottom');
            this.updateAvatarPreviews();
        });

        // Emote button
        this.emoteButton.addEventListener('click', () => this.showEmotePanel());
    }

    setupAvatarPreview() {
        // Setup login preview
        const loginPreviewCtx = this.avatarPreviewLogin.getContext('2d');
        this.avatarPreviewLogin.width = 200;
        this.avatarPreviewLogin.height = 300;

        // Setup top bar preview
        const topPreviewCtx = this.avatarPreviewTop.getContext('2d');
        this.avatarPreviewTop.width = 40;
        this.avatarPreviewTop.height = 40;

        // Setup customization preview
        const customizationPreviewCtx = this.avatarPreviewCustomization.getContext('2d');
        this.avatarPreviewCustomization.width = 300;
        this.avatarPreviewCustomization.height = 400;

        this.updateAvatarPreviews();
    }

    updateAvatarPreviews() {
        // Update login preview
        const loginCanvas = this.avatar.drawAvatar(50, 50, 1.5);
        const loginPreviewCtx = this.avatarPreviewLogin.getContext('2d');
        loginPreviewCtx.clearRect(0, 0, this.avatarPreviewLogin.width, this.avatarPreviewLogin.height);
        loginPreviewCtx.drawImage(loginCanvas, 0, 0);

        // Update top bar preview
        const topCanvas = this.avatar.drawAvatar(0, 0, 0.3);
        const topPreviewCtx = this.avatarPreviewTop.getContext('2d');
        topPreviewCtx.clearRect(0, 0, this.avatarPreviewTop.width, this.avatarPreviewTop.height);
        topPreviewCtx.drawImage(topCanvas, 0, 0);

        // Update customization preview
        const customizationCanvas = this.avatar.drawAvatar(75, 50, 2);
        const customizationPreviewCtx = this.avatarPreviewCustomization.getContext('2d');
        customizationPreviewCtx.clearRect(0, 0, this.avatarPreviewCustomization.width, this.avatarPreviewCustomization.height);
        customizationPreviewCtx.drawImage(customizationCanvas, 0, 0);
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
        this.updateChatDisplay(tabName);
    }

    updateChatDisplay(tabName) {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.querySelectorAll('.chat-message').forEach(msg => {
            if (tabName === 'all') {
                msg.style.display = 'block';
            } else {
                msg.style.display = msg.classList.contains(tabName) ? 'block' : 'none';
            }
        });
    }

    toggleCustomization() {
        this.customizationActive = !this.customizationActive;
        this.customizationPanel.classList.toggle('active', this.customizationActive);
        if (this.customizationActive) {
            this.updateAvatarPreviews();
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
            z-index: 1000;
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

    getAvatarConfig() {
        return this.avatar.exportConfig();
    }

    setAvatarConfig(config) {
        this.avatar.importConfig(config);
        this.updateAvatarPreviews();
    }
}
