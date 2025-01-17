/*
 * [F3V3R DR34M] - C0NF1G F1L3
 * CR4CK3D BY: Z4R1G4T4
 * PH34R TH3 DR4G0N!
 */

const CONFIG = {
    // Server configuration
    SERVER: {
        OLLAMA_MODEL: 'llama2:3.2',
        OLLAMA_IP: 'http://localhost:11434',  // Change this to your Ollama server IP
        STABLE_DIFFUSION_IP: 'http://localhost:7860'  // Change this to your Stable Diffusion server IP
    },
    
    // Game configuration
    GAME: {
        FPS: 60,
        MOVEMENT_SPEED: 3,
        ROOM_SCALE: 1.0
    },
    
    // Character configuration
    CHARACTER: {
        DEFAULT_SIZE: 30,
        COLORS: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']
    },
    
    // Room configuration
    ROOM: {
        TILE_SIZE: 50,
        DEFAULT_ROOM_WIDTH: 10,
        DEFAULT_ROOM_HEIGHT: 8
    }
};
