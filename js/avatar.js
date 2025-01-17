/*
 * [F3V3R DR34M] - 8B1T 4V4T4R SYST3M
 * CR4CK3D BY: Z4R1G4T4
 * R3TR0 1S TH3 FUTUR3!
 */

class Avatar {
    constructor() {
        this.pixelSize = 4; // Size of each "pixel" in our 8-bit style
        this.parts = {
            body: {
                type: 'default',
                color: '#FFD6B1',
                variants: ['default', 'tall', 'short']
            },
            hair: {
                type: 'style1',
                color: '#4A3000',
                variants: ['style1', 'spiky', 'bowl', 'long']
            },
            eyes: {
                type: 'normal',
                color: '#000000',
                variants: ['normal', 'happy', 'cool', 'angry']
            },
            mouth: {
                type: 'smile',
                color: '#FF9999',
                variants: ['smile', 'neutral', 'o']
            },
            outfit: {
                top: {
                    type: 'tshirt',
                    color: '#FF6B6B',
                    variants: ['tshirt', 'jacket', 'tank']
                },
                bottom: {
                    type: 'pants',
                    color: '#4ECDC4',
                    variants: ['pants', 'shorts', 'skirt']
                }
            },
            accessories: {
                hat: {
                    type: 'none',
                    color: '#333333',
                    variants: ['none', 'cap', 'beanie']
                }
            }
        };

        this.direction = 0; // 0: front, 1: right, 2: back, 3: left
        this.animation = {
            enabled: false,
            frame: 0,
            totalFrames: 4,
            frameDelay: 200,
            lastUpdate: 0
        };
    }

    drawPixel(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(
            Math.floor(x) * this.pixelSize,
            Math.floor(y) * this.pixelSize,
            this.pixelSize,
            this.pixelSize
        );
    }

    drawPixelArray(ctx, startX, startY, pixelArray, color) {
        for (let y = 0; y < pixelArray.length; y++) {
            for (let x = 0; x < pixelArray[y].length; x++) {
                if (pixelArray[y][x]) {
                    this.drawPixel(ctx, startX + x, startY + y, color);
                }
            }
        }
    }

    drawAvatar(x, y, scale = 1) {
        const baseWidth = 32; // Base width in pixels
        const baseHeight = 48; // Base height in pixels
        
        const canvas = document.createElement('canvas');
        canvas.width = baseWidth * this.pixelSize * scale;
        canvas.height = baseHeight * this.pixelSize * scale;
        
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // Keep pixels sharp
        
        // Scale everything
        ctx.scale(scale, scale);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw avatar parts in order
        this.drawBody(ctx, baseWidth/2, baseHeight/2);
        this.drawOutfit(ctx, baseWidth/2, baseHeight/2);
        this.drawHead(ctx, baseWidth/2, baseHeight/4);
        
        return canvas;
    }

    drawBody(ctx, centerX, centerY) {
        // Basic body shape - 8-bit style
        const bodyPixels = [
            [0,1,1,1,1,0],
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
            [0,1,1,1,1,0]
        ];

        this.drawPixelArray(
            ctx,
            centerX - 3,
            centerY - 3,
            bodyPixels,
            this.parts.body.color
        );
    }

    drawHead(ctx, centerX, centerY) {
        // Head base - 8-bit style
        const headPixels = [
            [0,1,1,1,1,0],
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
            [1,1,1,1,1,1],
            [0,1,1,1,1,0]
        ];

        this.drawPixelArray(
            ctx,
            centerX - 3,
            centerY - 3,
            headPixels,
            this.parts.body.color
        );

        // Draw facial features based on direction
        if (this.direction === 0 || this.direction === 2) { // Front or back
            this.drawFace(ctx, centerX, centerY);
        } else { // Side view
            this.drawSideProfile(ctx, centerX, centerY);
        }

        // Draw hair
        this.drawHair(ctx, centerX, centerY);
    }

    drawFace(ctx, centerX, centerY) {
        switch(this.parts.eyes.type) {
            case 'normal':
                // Left eye
                this.drawPixel(ctx, centerX - 2, centerY - 1, this.parts.eyes.color);
                // Right eye
                this.drawPixel(ctx, centerX + 1, centerY - 1, this.parts.eyes.color);
                break;
            case 'happy':
                // Happy eyes
                this.drawPixel(ctx, centerX - 2, centerY - 1, this.parts.eyes.color);
                this.drawPixel(ctx, centerX - 1, centerY - 2, this.parts.eyes.color);
                this.drawPixel(ctx, centerX + 1, centerY - 1, this.parts.eyes.color);
                this.drawPixel(ctx, centerX + 2, centerY - 2, this.parts.eyes.color);
                break;
        }

        // Draw mouth based on type
        switch(this.parts.mouth.type) {
            case 'smile':
                this.drawPixel(ctx, centerX - 1, centerY + 1, this.parts.mouth.color);
                this.drawPixel(ctx, centerX, centerY + 1, this.parts.mouth.color);
                this.drawPixel(ctx, centerX + 1, centerY + 1, this.parts.mouth.color);
                break;
            case 'o':
                this.drawPixel(ctx, centerX, centerY + 1, this.parts.mouth.color);
                break;
        }
    }

    drawSideProfile(ctx, centerX, centerY) {
        // Side view eye
        this.drawPixel(
            ctx,
            this.direction === 1 ? centerX + 1 : centerX - 1,
            centerY - 1,
            this.parts.eyes.color
        );
    }

    drawHair(ctx, centerX, centerY) {
        const hairColor = this.parts.hair.color;
        
        switch(this.parts.hair.type) {
            case 'style1':
                // Basic hair
                const basicHair = [
                    [1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1],
                    [1,0,1,1,1,1,0,1]
                ];
                this.drawPixelArray(ctx, centerX - 4, centerY - 4, basicHair, hairColor);
                break;
            
            case 'spiky':
                // Spiky hair
                const spikyHair = [
                    [1,0,1,0,1,0,1,0],
                    [1,1,1,1,1,1,1,1],
                    [1,1,0,1,1,0,1,1]
                ];
                this.drawPixelArray(ctx, centerX - 4, centerY - 4, spikyHair, hairColor);
                break;
            
            case 'bowl':
                // Bowl cut
                const bowlHair = [
                    [0,1,1,1,1,1,1,0],
                    [1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1]
                ];
                this.drawPixelArray(ctx, centerX - 4, centerY - 4, bowlHair, hairColor);
                break;
        }
    }

    drawOutfit(ctx, centerX, centerY) {
        // Draw top
        switch(this.parts.outfit.top.type) {
            case 'tshirt':
                const tshirt = [
                    [1,1,1,1,1,1],
                    [1,1,1,1,1,1],
                    [1,1,1,1,1,1],
                    [0,1,1,1,1,0]
                ];
                this.drawPixelArray(
                    ctx,
                    centerX - 3,
                    centerY,
                    tshirt,
                    this.parts.outfit.top.color
                );
                break;
            
            case 'tank':
                const tank = [
                    [1,0,1,1,0,1],
                    [1,0,1,1,0,1],
                    [1,1,1,1,1,1],
                    [0,1,1,1,1,0]
                ];
                this.drawPixelArray(
                    ctx,
                    centerX - 3,
                    centerY,
                    tank,
                    this.parts.outfit.top.color
                );
                break;
        }

        // Draw bottom
        switch(this.parts.outfit.bottom.type) {
            case 'pants':
                const pants = [
                    [0,1,1,1,1,0],
                    [0,1,1,1,1,0],
                    [0,1,1,1,1,0],
                    [0,1,0,0,1,0]
                ];
                this.drawPixelArray(
                    ctx,
                    centerX - 3,
                    centerY + 4,
                    pants,
                    this.parts.outfit.bottom.color
                );
                break;
            
            case 'skirt':
                const skirt = [
                    [1,1,1,1,1,1],
                    [0,1,1,1,1,0],
                    [0,0,1,1,0,0]
                ];
                this.drawPixelArray(
                    ctx,
                    centerX - 3,
                    centerY + 4,
                    skirt,
                    this.parts.outfit.bottom.color
                );
                break;
        }
    }

    rotate(direction) {
        this.direction = (this.direction + direction + 4) % 4;
    }

    setAnimation(enabled) {
        this.animation.enabled = enabled;
        this.animation.frame = 0;
        this.animation.lastUpdate = Date.now();
    }

    updateAnimation() {
        if (!this.animation.enabled) return;

        const now = Date.now();
        if (now - this.animation.lastUpdate > this.animation.frameDelay) {
            this.animation.frame = (this.animation.frame + 1) % this.animation.totalFrames;
            this.animation.lastUpdate = now;
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

    exportConfig() {
        return JSON.stringify(this.parts);
    }

    importConfig(config) {
        try {
            const parsedConfig = typeof config === 'string' ? JSON.parse(config) : config;
            for (let [category, value] of Object.entries(parsedConfig)) {
                if (this.parts[category]) {
                    this.parts[category] = value;
                }
            }
            return true;
        } catch (error) {
            console.error('Error importing avatar configuration:', error);
            return false;
        }
    }
}
