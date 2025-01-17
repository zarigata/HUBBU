/*
 * [F3V3R DR34M] - G4M3 C0R3
 * CR4CK3D BY: Z4R1G4T4
 * H4X0R3D W1TH L0V3!
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.players = new Map();
        this.currentPlayer = null;
        this.room = new Room();
        this.ui = new UI();
        this.db = new Database();
        this.multiplayer = new MultiplayerManager(this, this.db);
        
        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('customize-btn').addEventListener('click', () => this.ui.toggleCustomization());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = e.target.value.trim();
                if (message) {
                    this.multiplayer.sendChatMessage(message);
                    e.target.value = '';
                }
            }
        });
    }

    async startGame() {
        const username = document.getElementById('username').value.trim();
        if (!username) return;

        // Initialize player
        this.currentPlayer = new Character(username);
        this.currentPlayer.avatar = this.ui.avatar;
        
        // Initialize multiplayer
        const success = await this.multiplayer.initialize(
            username,
            this.currentPlayer.avatar.exportConfig()
        );

        if (success) {
            document.getElementById('login-screen').style.display = 'none';
            this.gameLoop();
        } else {
            alert('Failed to connect to server. Please try again.');
        }
    }

    handleClick(e) {
        if (!this.currentPlayer) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.currentPlayer.moveTo(x, y);
        this.multiplayer.updatePlayerPosition(x, y);
    }

    addPlayer(player) {
        this.players.set(player.username, player);
    }

    removePlayer(player) {
        this.players.delete(player.username);
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw room
        this.room.draw(this.ctx);
        
        // Update and draw current player
        if (this.currentPlayer) {
            this.currentPlayer.update();
            this.currentPlayer.draw(this.ctx);
        }
        
        // Update and draw other players
        for (let player of this.players.values()) {
            player.update();
            player.draw(this.ctx);
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }

    changeRoom(roomId) {
        this.room.changeRoom(roomId);
        this.multiplayer.changeRoom(roomId);
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    window.game = new Game();
});
