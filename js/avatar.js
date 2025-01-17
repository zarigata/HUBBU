/*
 * [F3V3R DR34M] - 4V4T4R CUST0M1Z4T10N SYST3M
 * CR4CK3D BY: Z4R1G4T4
 * WH3N 1N D0UBT, BL4M3 TH3 US3R!
 */

class Avatar {
    constructor() {
        this.parts = {
            body: {
                type: 'default',
                color: '#FFD6B1',
                variants: ['default', 'tall', 'short']
            },
            hair: {
                type: 'style1',
                color: '#4A3000',
                variants: [
                    'style1', 'style2', 'style3', 'style4',
                    'punk', 'mohawk', 'emo', 'afro',
                    'long', 'pigtails', 'bun', 'spiky'
                ]
            },
            eyes: {
                type: 'normal',
                color: '#4A3000',
                variants: ['normal', 'angry', 'cute', 'sleepy', 'cool', 'wink']
            },
            mouth: {
                type: 'smile',
                variants: ['smile', 'grin', 'serious', 'surprised', 'cool']
            },
            outfit: {
                top: {
                    type: 'tshirt',
                    color: '#FF6B6B',
                    variants: ['tshirt', 'hoodie', 'jacket', 'tank', 'suit', 'dress']
                },
                bottom: {
                    type: 'jeans',
                    color: '#4ECDC4',
                    variants: ['jeans', 'shorts', 'skirt', 'pants', 'tracksuit']
                }
            },
            accessories: {
                hat: {
                    type: 'none',
                    variants: ['none', 'cap', 'beanie', 'crown', 'headphones']
                },
                glasses: {
                    type: 'none',
                    variants: ['none', 'regular', 'sunglasses', 'nerd', 'cyber']
                }
            }
        };

        this.animations = {
            current: 'idle',
            list: ['idle', 'walk', 'dance', 'wave', 'sit']
        };

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sprites = {};
        this.loadSprites();
    }

    async loadSprites() {
        const spriteList = {
            'body': 'sprites/body/',
            'hair': 'sprites/hair/',
            'eyes': 'sprites/eyes/',
            'mouth': 'sprites/mouth/',
            'outfits': 'sprites/outfits/',
            'accessories': 'sprites/accessories/'
        };

        for (let [key, path] of Object.entries(spriteList)) {
            this.sprites[key] = {};
            // In a real implementation, load actual sprite images here
            // For now, we'll use canvas drawing
        }
    }

    setPartType(partCategory, partType, subPart = null) {
        if (subPart) {
            if (this.parts[partCategory][subPart].variants.includes(partType)) {
                this.parts[partCategory][subPart].type = partType;
                return true;
            }
        } else {
            if (this.parts[partCategory].variants.includes(partType)) {
                this.parts[partCategory].type = partType;
                return true;
            }
        }
        return false;
    }

    setPartColor(partCategory, color, subPart = null) {
        if (subPart) {
            this.parts[partCategory][subPart].color = color;
        } else {
            this.parts[partCategory].color = color;
        }
    }

    drawAvatar(x, y, scale = 1, animation = 'idle') {
        this.canvas.width = 120 * scale;
        this.canvas.height = 200 * scale;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw body
        this.drawBody(x, y, scale);
        
        // Draw outfit
        this.drawOutfit(x, y, scale);
        
        // Draw head features
        this.drawHead(x, y, scale);
        
        // Draw accessories
        this.drawAccessories(x, y, scale);

        return this.canvas;
    }

    drawBody(x, y, scale) {
        const ctx = this.ctx;
        const bodyColor = this.parts.body.color;

        // Body base
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(
            x + 60 * scale, 
            y + 100 * scale, 
            30 * scale, 
            50 * scale, 
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }

    drawHead(x, y, scale) {
        const ctx = this.ctx;
        const bodyColor = this.parts.body.color;
        const hairColor = this.parts.hair.color;
        
        // Head
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(
            x + 60 * scale,
            y + 40 * scale,
            25 * scale,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Hair based on style
        this.drawHairStyle(x, y, scale, hairColor);

        // Eyes
        this.drawEyes(x, y, scale);

        // Mouth
        this.drawMouth(x, y, scale);
    }

    drawHairStyle(x, y, scale, color) {
        const ctx = this.ctx;
        ctx.fillStyle = color;

        switch(this.parts.hair.type) {
            case 'style1': // Basic short hair
                ctx.beginPath();
                ctx.arc(
                    x + 60 * scale,
                    y + 35 * scale,
                    27 * scale,
                    Math.PI, 0
                );
                ctx.fill();
                break;

            case 'punk': // Punk style
                ctx.beginPath();
                for(let i = 0; i < 5; i++) {
                    ctx.moveTo(x + (45 + i * 7) * scale, y + 40 * scale);
                    ctx.lineTo(x + (48 + i * 7) * scale, y + 15 * scale);
                    ctx.lineTo(x + (51 + i * 7) * scale, y + 40 * scale);
                }
                ctx.fill();
                break;

            case 'long': // Long hair
                ctx.beginPath();
                ctx.moveTo(x + 35 * scale, y + 40 * scale);
                ctx.quadraticCurveTo(
                    x + 60 * scale, y + 120 * scale,
                    x + 85 * scale, y + 40 * scale
                );
                ctx.fill();
                break;

            // Add more hair styles here
        }
    }

    drawEyes(x, y, scale) {
        const ctx = this.ctx;
        const eyeStyle = this.parts.eyes.type;
        const eyeColor = this.parts.eyes.color;

        switch(eyeStyle) {
            case 'normal':
                // Left eye
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.ellipse(
                    x + 50 * scale,
                    y + 35 * scale,
                    5 * scale,
                    7 * scale,
                    0, 0, Math.PI * 2
                );
                ctx.fill();

                // Right eye
                ctx.beginPath();
                ctx.ellipse(
                    x + 70 * scale,
                    y + 35 * scale,
                    5 * scale,
                    7 * scale,
                    0, 0, Math.PI * 2
                );
                ctx.fill();

                // Pupils
                ctx.fillStyle = eyeColor;
                ctx.beginPath();
                ctx.arc(x + 50 * scale, y + 35 * scale, 2 * scale, 0, Math.PI * 2);
                ctx.arc(x + 70 * scale, y + 35 * scale, 2 * scale, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'cute':
                ctx.fillStyle = eyeColor;
                ctx.beginPath();
                ctx.arc(x + 50 * scale, y + 35 * scale, 4 * scale, 0, Math.PI * 2);
                ctx.arc(x + 70 * scale, y + 35 * scale, 4 * scale, 0, Math.PI * 2);
                ctx.fill();

                // Shine
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(x + 48 * scale, y + 33 * scale, 1.5 * scale, 0, Math.PI * 2);
                ctx.arc(x + 68 * scale, y + 33 * scale, 1.5 * scale, 0, Math.PI * 2);
                ctx.fill();
                break;

            // Add more eye styles
        }
    }

    drawMouth(x, y, scale) {
        const ctx = this.ctx;
        const mouthStyle = this.parts.mouth.type;

        ctx.strokeStyle = '#FF9999';
        ctx.lineWidth = 2 * scale;

        switch(mouthStyle) {
            case 'smile':
                ctx.beginPath();
                ctx.arc(
                    x + 60 * scale,
                    y + 45 * scale,
                    10 * scale,
                    0.1 * Math.PI,
                    0.9 * Math.PI
                );
                ctx.stroke();
                break;

            case 'grin':
                ctx.beginPath();
                ctx.arc(
                    x + 60 * scale,
                    y + 45 * scale,
                    12 * scale,
                    0,
                    Math.PI
                );
                ctx.stroke();
                // Add teeth
                ctx.fillStyle = 'white';
                ctx.fillRect(x + 53 * scale, y + 45 * scale, 14 * scale, 3 * scale);
                break;

            // Add more mouth styles
        }
    }

    drawOutfit(x, y, scale) {
        const ctx = this.ctx;
        const topStyle = this.parts.outfit.top;
        const bottomStyle = this.parts.outfit.bottom;

        // Draw top
        ctx.fillStyle = topStyle.color;
        switch(topStyle.type) {
            case 'tshirt':
                ctx.beginPath();
                ctx.moveTo(x + 30 * scale, y + 70 * scale);
                ctx.lineTo(x + 90 * scale, y + 70 * scale);
                ctx.lineTo(x + 85 * scale, y + 120 * scale);
                ctx.lineTo(x + 35 * scale, y + 120 * scale);
                ctx.closePath();
                ctx.fill();
                break;

            case 'hoodie':
                ctx.beginPath();
                ctx.moveTo(x + 25 * scale, y + 65 * scale);
                ctx.lineTo(x + 95 * scale, y + 65 * scale);
                ctx.lineTo(x + 90 * scale, y + 125 * scale);
                ctx.lineTo(x + 30 * scale, y + 125 * scale);
                ctx.closePath();
                ctx.fill();
                // Hood
                ctx.beginPath();
                ctx.arc(x + 60 * scale, y + 65 * scale, 25 * scale, Math.PI, 0);
                ctx.fill();
                break;

            // Add more top styles
        }

        // Draw bottom
        ctx.fillStyle = bottomStyle.color;
        switch(bottomStyle.type) {
            case 'jeans':
                ctx.fillRect(
                    x + 35 * scale,
                    y + 120 * scale,
                    20 * scale,
                    60 * scale
                );
                ctx.fillRect(
                    x + 65 * scale,
                    y + 120 * scale,
                    20 * scale,
                    60 * scale
                );
                break;

            case 'skirt':
                ctx.beginPath();
                ctx.moveTo(x + 35 * scale, y + 120 * scale);
                ctx.lineTo(x + 85 * scale, y + 120 * scale);
                ctx.lineTo(x + 95 * scale, y + 150 * scale);
                ctx.lineTo(x + 25 * scale, y + 150 * scale);
                ctx.closePath();
                ctx.fill();
                break;

            // Add more bottom styles
        }
    }

    drawAccessories(x, y, scale) {
        const ctx = this.ctx;
        const hatStyle = this.parts.accessories.hat;
        const glassesStyle = this.parts.accessories.glasses;

        // Draw hat if selected
        if (hatStyle.type !== 'none') {
            switch(hatStyle.type) {
                case 'cap':
                    ctx.fillStyle = '#333';
                    ctx.beginPath();
                    ctx.arc(x + 60 * scale, y + 25 * scale, 25 * scale, Math.PI, 0);
                    ctx.fill();
                    // Cap bill
                    ctx.fillRect(
                        x + 35 * scale,
                        y + 25 * scale,
                        50 * scale,
                        5 * scale
                    );
                    break;

                // Add more hat styles
            }
        }

        // Draw glasses if selected
        if (glassesStyle.type !== 'none') {
            switch(glassesStyle.type) {
                case 'regular':
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 2 * scale;
                    // Left lens
                    ctx.beginPath();
                    ctx.arc(x + 50 * scale, y + 35 * scale, 8 * scale, 0, Math.PI * 2);
                    ctx.stroke();
                    // Right lens
                    ctx.beginPath();
                    ctx.arc(x + 70 * scale, y + 35 * scale, 8 * scale, 0, Math.PI * 2);
                    ctx.stroke();
                    // Bridge
                    ctx.beginPath();
                    ctx.moveTo(x + 58 * scale, y + 35 * scale);
                    ctx.lineTo(x + 62 * scale, y + 35 * scale);
                    ctx.stroke();
                    break;

                // Add more glasses styles
            }
        }
    }

    // Animation methods
    setAnimation(animationName) {
        if (this.animations.list.includes(animationName)) {
            this.animations.current = animationName;
            return true;
        }
        return false;
    }

    // Export avatar as data URL
    exportAvatar() {
        return this.canvas.toDataURL();
    }

    // Import avatar configuration
    importConfig(config) {
        try {
            for (let [category, value] of Object.entries(config)) {
                if (typeof value === 'object') {
                    for (let [subCategory, subValue] of Object.entries(value)) {
                        if (subValue.type) {
                            this.setPartType(category, subValue.type, subCategory);
                        }
                        if (subValue.color) {
                            this.setPartColor(category, subValue.color, subCategory);
                        }
                    }
                } else {
                    if (this.parts[category]) {
                        this.parts[category] = value;
                    }
                }
            }
            return true;
        } catch (error) {
            console.error('Error importing avatar configuration:', error);
            return false;
        }
    }

    // Export avatar configuration
    exportConfig() {
        return JSON.stringify(this.parts);
    }
}
