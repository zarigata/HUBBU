/*
 * [F3V3R DR34M] - MULT1PL4Y3R H4NDL3R
 * CR4CK3D BY: Z4R1G4T4
 * 1F U C4N R34D TH1S U R 1337!
 */

class MultiplayerManager {
    constructor(game, database) {
        this.game = game;
        this.db = database;
        this.currentRoom = null;
        this.players = new Map();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for room changes
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const roomId = btn.dataset.room;
                this.changeRoom(roomId);
            });
        });
    }

    async initialize(username, avatarConfig) {
        // Sign in anonymously
        const user = await this.db.signInAnonymously();
        if (!user) return false;

        // Save initial user data
        await this.db.saveUserData(user.uid, {
            username,
            avatarConfig,
            lastSeen: firebase.database.ServerValue.TIMESTAMP
        });

        // Join lobby by default
        await this.changeRoom('lobby');
        return true;
    }

    async changeRoom(roomId) {
        // Leave current room if any
        if (this.currentRoom) {
            this.db.leaveRoom(this.currentRoom);
            this.players.clear();
        }

        this.currentRoom = roomId;

        // Join new room
        const playerData = {
            username: this.game.currentPlayer.username,
            avatarConfig: this.game.currentPlayer.avatar.exportConfig(),
            position: {
                x: this.game.currentPlayer.x,
                y: this.game.currentPlayer.y
            }
        };

        await this.db.joinRoom(roomId, playerData);

        // Listen to other players in the room
        this.db.listenToPlayers(
            roomId,
            this.handlePlayerJoined.bind(this),
            this.handlePlayerLeft.bind(this)
        );

        // Listen to chat messages
        this.db.listenToChat(roomId, this.handleChatMessage.bind(this));
    }

    handlePlayerJoined(playerId, playerData) {
        if (playerId === this.db.currentUser.uid) return;

        // Create new player instance
        const player = new Character(playerData.username);
        player.avatar.importConfig(playerData.avatarConfig);
        player.x = playerData.position.x;
        player.y = playerData.position.y;

        this.players.set(playerId, player);
        this.game.addPlayer(player);

        // Show join message in chat
        this.game.ui.addChatMessage(`${playerData.username} has entered the room`, 'system');
    }

    handlePlayerLeft(playerId, playerData) {
        const player = this.players.get(playerId);
        if (!player) return;

        this.game.removePlayer(player);
        this.players.delete(playerId);

        // Show leave message in chat
        this.game.ui.addChatMessage(`${player.username} has left the room`, 'system');
    }

    handleChatMessage(messageData) {
        const { username, message } = messageData;
        this.game.ui.addChatMessage(`${username}: ${message}`, 'room');
    }

    updatePlayerPosition(x, y) {
        if (!this.currentRoom || !this.db.currentUser) return;

        this.db.updatePlayerPosition(this.currentRoom, this.db.currentUser.uid, {
            position: { x, y }
        });
    }

    async sendChatMessage(message) {
        if (!this.currentRoom) return;
        await this.db.sendChatMessage(this.currentRoom, message);
    }
}
