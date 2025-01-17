/*
 * [F3V3R DR34M] - D4T4 S3RV3R
 * CR4CK3D BY: Z4R1G4T4
 * WH0 N33DS 4 D4T4B4S3?!
 */

class DataServer {
    constructor() {
        this.STORAGE_KEY = 'h4bb0_dr34m_';
        this.GITHUB_API = 'https://api.github.com/gists';
        this.localData = {};
        this.initializeLocalStorage();
    }

    initializeLocalStorage() {
        // Initialize local storage with empty data if not exists
        if (!localStorage.getItem(this.STORAGE_KEY + 'users')) {
            localStorage.setItem(this.STORAGE_KEY + 'users', JSON.stringify({}));
        }
    }

    // Local Storage Operations
    saveLocal(key, data) {
        try {
            localStorage.setItem(this.STORAGE_KEY + key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to local storage:', error);
            return false;
        }
    }

    getLocal(key) {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY + key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from local storage:', error);
            return null;
        }
    }

    // User Management
    async registerUser(username, password, avatarConfig) {
        try {
            // Check if username exists
            const users = this.getLocal('users');
            if (users[username]) {
                return { success: false, message: 'Username already exists' };
            }

            // Create user data
            const userData = {
                username,
                password: await this.hashPassword(password),
                avatarConfig,
                created: new Date().toISOString(),
                lastLogin: null,
                gistId: null
            };

            // Save to GitHub Gist
            const gistData = await this.createGist(userData);
            userData.gistId = gistData.id;

            // Save to local storage
            users[username] = userData;
            this.saveLocal('users', users);

            return { success: true, userData };
        } catch (error) {
            console.error('Error registering user:', error);
            return { success: false, message: 'Registration failed' };
        }
    }

    async loginUser(username, password) {
        try {
            const users = this.getLocal('users');
            const userData = users[username];

            if (!userData) {
                return { success: false, message: 'User not found' };
            }

            // Verify password
            const isValid = await this.verifyPassword(password, userData.password);
            if (!isValid) {
                return { success: false, message: 'Invalid password' };
            }

            // Update last login
            userData.lastLogin = new Date().toISOString();
            users[username] = userData;
            this.saveLocal('users', users);

            // Get latest data from Gist
            if (userData.gistId) {
                const gistData = await this.getGist(userData.gistId);
                if (gistData) {
                    userData.avatarConfig = gistData.avatarConfig;
                }
            }

            return { success: true, userData };
        } catch (error) {
            console.error('Error logging in:', error);
            return { success: false, message: 'Login failed' };
        }
    }

    // Password Hashing (Simple version - in production use a proper hashing library)
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async verifyPassword(password, hash) {
        const hashedPassword = await this.hashPassword(password);
        return hashedPassword === hash;
    }

    // GitHub Gist Operations
    async createGist(userData) {
        try {
            const response = await fetch(this.GITHUB_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: `H4BB0 DR34M User Data - ${userData.username}`,
                    public: false,
                    files: {
                        'user_data.json': {
                            content: JSON.stringify({
                                username: userData.username,
                                avatarConfig: userData.avatarConfig,
                                lastUpdated: new Date().toISOString()
                            })
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create Gist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating Gist:', error);
            return null;
        }
    }

    async updateGist(gistId, userData) {
        try {
            const response = await fetch(`${this.GITHUB_API}/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    files: {
                        'user_data.json': {
                            content: JSON.stringify({
                                username: userData.username,
                                avatarConfig: userData.avatarConfig,
                                lastUpdated: new Date().toISOString()
                            })
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update Gist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating Gist:', error);
            return null;
        }
    }

    async getGist(gistId) {
        try {
            const response = await fetch(`${this.GITHUB_API}/${gistId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch Gist');
            }

            const data = await response.json();
            return JSON.parse(data.files['user_data.json'].content);
        } catch (error) {
            console.error('Error fetching Gist:', error);
            return null;
        }
    }

    // Avatar Management
    async saveAvatarConfig(username, avatarConfig) {
        try {
            const users = this.getLocal('users');
            const userData = users[username];

            if (!userData) {
                return { success: false, message: 'User not found' };
            }

            userData.avatarConfig = avatarConfig;
            
            // Update local storage
            users[username] = userData;
            this.saveLocal('users', users);

            // Update Gist if available
            if (userData.gistId) {
                await this.updateGist(userData.gistId, userData);
            }

            return { success: true, userData };
        } catch (error) {
            console.error('Error saving avatar config:', error);
            return { success: false, message: 'Failed to save avatar configuration' };
        }
    }

    getAvatarConfig(username) {
        const users = this.getLocal('users');
        const userData = users[username];
        return userData ? userData.avatarConfig : null;
    }
}
