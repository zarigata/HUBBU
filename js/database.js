/*
 * [F3V3R DR34M] - D4T4B4S3 H4NDL3R
 * CR4CK3D BY: Z4R1G4T4
 * WH3N 1N D0UBT, BL4M3 TH3 US3R!
 */

class Database {
    constructor() {
        this.db = firebase.database();
        this.auth = firebase.auth();
        this.currentUser = null;
        this.onlineUsers = new Map();
        this.setupPresence();
    }

    async signInAnonymously() {
        try {
            const result = await this.auth.signInAnonymously();
            this.currentUser = result.user;
            return result.user;
        } catch (error) {
            console.error('Error signing in:', error);
            return null;
        }
    }

    setupPresence() {
        const connectedRef = this.db.ref('.info/connected');
        connectedRef.on('value', (snap) => {
            if (snap.val() === true && this.currentUser) {
                const userStatusRef = this.db.ref(`/status/${this.currentUser.uid}`);
                
                // When we disconnect, remove this device
                userStatusRef.onDisconnect().remove();

                // Set the status to online
                userStatusRef.set(true);
            }
        });

        // Listen to online users
        const statusRef = this.db.ref('/status');
        statusRef.on('value', (snap) => {
            const data = snap.val() || {};
            this.onlineUsers = new Map(Object.entries(data));
            this.updateOnlineCount();
        });
    }

    updateOnlineCount() {
        const count = this.onlineUsers.size;
        document.getElementById('online-count').textContent = `Online: ${count}`;
    }

    async saveUserData(userId, data) {
        try {
            await this.db.ref(`users/${userId}`).set(data);
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }

    async getUserData(userId) {
        try {
            const snapshot = await this.db.ref(`users/${userId}`).once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    listenToRoom(roomId, callback) {
        const roomRef = this.db.ref(`rooms/${roomId}`);
        roomRef.on('value', (snapshot) => {
            callback(snapshot.val());
        });
    }

    async updatePlayerPosition(roomId, userId, position) {
        try {
            await this.db.ref(`rooms/${roomId}/players/${userId}`).update(position);
            return true;
        } catch (error) {
            console.error('Error updating position:', error);
            return false;
        }
    }

    async sendChatMessage(roomId, message) {
        try {
            const messageRef = this.db.ref(`rooms/${roomId}/chat`).push();
            await messageRef.set({
                userId: this.currentUser.uid,
                username: this.currentUser.displayName || 'Anonymous',
                message: message,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    }

    listenToChat(roomId, callback) {
        const chatRef = this.db.ref(`rooms/${roomId}/chat`).limitToLast(50);
        chatRef.on('child_added', (snapshot) => {
            callback(snapshot.val());
        });
    }

    async joinRoom(roomId, playerData) {
        if (!this.currentUser) return false;

        try {
            const roomRef = this.db.ref(`rooms/${roomId}/players/${this.currentUser.uid}`);
            
            // Remove player from room when disconnected
            roomRef.onDisconnect().remove();
            
            // Add player to room
            await roomRef.set({
                ...playerData,
                lastUpdated: firebase.database.ServerValue.TIMESTAMP
            });
            
            return true;
        } catch (error) {
            console.error('Error joining room:', error);
            return false;
        }
    }

    leaveRoom(roomId) {
        if (!this.currentUser) return;
        
        const roomRef = this.db.ref(`rooms/${roomId}/players/${this.currentUser.uid}`);
        roomRef.remove();
    }

    listenToPlayers(roomId, onPlayerJoined, onPlayerLeft) {
        const playersRef = this.db.ref(`rooms/${roomId}/players`);
        
        playersRef.on('child_added', (snapshot) => {
            onPlayerJoined(snapshot.key, snapshot.val());
        });

        playersRef.on('child_removed', (snapshot) => {
            onPlayerLeft(snapshot.key, snapshot.val());
        });
    }
}
