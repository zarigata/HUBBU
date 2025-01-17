/*
 * [F3V3R DR34M] PR3S3NTS
 * H4BB0 DR34M W0RLD 2025 3D1T10N
 * CR4CK3D BY: Z4R1G4T4
 * GR33TZ: ALL THE SCENE!
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.players = new Map();
        this.currentPlayer = null;
        this.room = new Room();
        
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
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleChat(e.target.value);
        });
    }

    startGame() {
        const username = document.getElementById('username').value.trim();
        if (username) {
            document.getElementById('login-screen').style.display = 'none';
            this.currentPlayer = new Character(username, 100, 100);
            this.players.set(username, this.currentPlayer);
            this.gameLoop();
        }
    }

    handleClick(e) {
        if (!this.currentPlayer) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.currentPlayer.moveTo(x, y);
    }

    handleChat(message) {
        if (!message.trim()) return;
        
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = `${this.currentPlayer.username}: ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        document.getElementById('chat-input').value = '';
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw room
        this.room.draw(this.ctx);
        
        // Update and draw all players
        for (let player of this.players.values()) {
            player.update();
            player.draw(this.ctx);
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    window.game = new Game();
});
