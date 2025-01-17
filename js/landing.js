/*
 * [F3V3R DR34M] - L4ND1NG P4G3
 * CR4CK3D BY: Z4R1G4T4
 * 1337 C0D3 1NS1D3!
 */

class LandingPage {
    constructor() {
        this.dataServer = new DataServer();
        this.avatar = new Avatar();
        this.currentUsername = '';
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // Tab elements
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Login elements
        this.loginUsername = document.getElementById('login-username');
        this.loginPassword = document.getElementById('login-password');
        this.loginBtn = document.getElementById('login-btn');

        // Register elements
        this.registerUsername = document.getElementById('register-username');
        this.registerPassword = document.getElementById('register-password');
        this.registerPasswordConfirm = document.getElementById('register-password-confirm');
        this.registerBtn = document.getElementById('register-btn');
        this.customizeBtn = document.getElementById('customize-btn');

        // Modal elements
        this.customizationModal = document.getElementById('customization-modal');
        this.closeModalBtn = document.querySelector('.close-btn');
        this.saveAvatarBtn = document.getElementById('save-avatar');

        // Avatar preview controls
        this.rotateLeftBtn = document.getElementById('rotate-left');
        this.rotateRightBtn = document.getElementById('rotate-right');
        this.animateBtn = document.getElementById('animate');

        // Style buttons and color inputs
        this.styleButtons = document.querySelectorAll('.style-btn');
        this.colorInputs = {
            body: document.getElementById('body-color'),
            hair: document.getElementById('hair-color'),
            outfitTop: document.getElementById('outfit-top-color'),
            outfitBottom: document.getElementById('outfit-bottom-color')
        };
    }

    setupEventListeners() {
        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Login form
        this.loginBtn.addEventListener('click', () => this.handleLogin());

        // Register form
        this.registerUsername.addEventListener('input', () => this.validateRegisterForm());
        this.registerPassword.addEventListener('input', () => this.validateRegisterForm());
        this.registerPasswordConfirm.addEventListener('input', () => this.validateRegisterForm());
        this.registerBtn.addEventListener('click', () => this.handleRegister());

        // Customization
        this.customizeBtn.addEventListener('click', () => this.openCustomization());
        this.closeModalBtn.addEventListener('click', () => this.closeCustomization());
        this.saveAvatarBtn.addEventListener('click', () => this.saveAvatar());

        // Avatar controls
        this.rotateLeftBtn.addEventListener('click', () => this.rotateAvatar('left'));
        this.rotateRightBtn.addEventListener('click', () => this.rotateAvatar('right'));
        this.animateBtn.addEventListener('click', () => this.toggleAnimation());

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
                
                this.updateAvatarPreview();
            });
        });

        // Color inputs
        Object.entries(this.colorInputs).forEach(([part, input]) => {
            input.addEventListener('change', (e) => {
                const color = e.target.value;
                switch(part) {
                    case 'body':
                        this.avatar.setPartColor('body', color);
                        break;
                    case 'hair':
                        this.avatar.setPartColor('hair', color);
                        break;
                    case 'outfitTop':
                        this.avatar.setPartColor('outfit', color, 'top');
                        break;
                    case 'outfitBottom':
                        this.avatar.setPartColor('outfit', color, 'bottom');
                        break;
                }
                this.updateAvatarPreview();
            });
        });
    }

    switchTab(tabName) {
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        this.tabContents.forEach(content => {
            content.classList.toggle('hidden', content.id !== `${tabName}-tab`);
        });
    }

    validateRegisterForm() {
        const username = this.registerUsername.value.trim();
        const password = this.registerPassword.value;
        const confirmPassword = this.registerPasswordConfirm.value;

        const isValid = username.length >= 3 &&
                       password.length >= 6 &&
                       password === confirmPassword;

        this.registerBtn.disabled = !isValid;
        return isValid;
    }

    async handleLogin() {
        const username = this.loginUsername.value.trim();
        const password = this.loginPassword.value;

        const result = await this.dataServer.loginUser(username, password);
        
        if (result.success) {
            // Load avatar configuration
            if (result.userData.avatarConfig) {
                this.avatar.importConfig(result.userData.avatarConfig);
            }
            
            // Redirect to game
            window.location.href = 'game.html';
        } else {
            alert(result.message);
        }
    }

    async handleRegister() {
        if (!this.validateRegisterForm()) return;

        const username = this.registerUsername.value.trim();
        const password = this.registerPassword.value;
        const avatarConfig = this.avatar.exportConfig();

        const result = await this.dataServer.registerUser(username, password, avatarConfig);
        
        if (result.success) {
            this.currentUsername = username;
            alert('Registration successful! Please log in.');
            this.switchTab('login');
        } else {
            alert(result.message);
        }
    }

    openCustomization() {
        this.customizationModal.classList.remove('hidden');
        this.updateAvatarPreview();
    }

    closeCustomization() {
        this.customizationModal.classList.add('hidden');
    }

    updateAvatarPreview() {
        const previewContainer = document.querySelector('.avatar-preview-large');
        const canvas = this.avatar.drawAvatar(150, 100, 2);
        
        // Clear previous preview
        while (previewContainer.firstChild) {
            previewContainer.removeChild(previewContainer.firstChild);
        }
        
        previewContainer.appendChild(canvas);
    }

    rotateAvatar(direction) {
        // Implement avatar rotation logic
        this.updateAvatarPreview();
    }

    toggleAnimation() {
        const btn = this.animateBtn;
        const isPlaying = btn.textContent === '⏸';
        
        btn.textContent = isPlaying ? '▶' : '⏸';
        // Implement animation toggle logic
        this.updateAvatarPreview();
    }

    async saveAvatar() {
        if (this.currentUsername) {
            const avatarConfig = this.avatar.exportConfig();
            const result = await this.dataServer.saveAvatarConfig(this.currentUsername, avatarConfig);
            
            if (result.success) {
                this.closeCustomization();
                this.registerBtn.disabled = false;
            } else {
                alert(result.message);
            }
        } else {
            this.closeCustomization();
            this.registerBtn.disabled = false;
        }
    }
}

// Initialize landing page when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.landingPage = new LandingPage();
});
