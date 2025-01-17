/*
 * [F3V3R DR34M] - R00M R3ND3R3R
 * CR4CK3D BY: Z4R1G4T4
 * D0NT F0RG3T T0 DR1NK Y0UR 0V4LT1N3!
 */

class Room {
    constructor() {
        this.tileSize = 50;
        this.floorPattern = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }

    draw(ctx) {
        const offsetX = (ctx.canvas.width - this.floorPattern[0].length * this.tileSize) / 2;
        const offsetY = (ctx.canvas.height - this.floorPattern.length * this.tileSize) / 2;

        // Draw floor tiles
        for (let y = 0; y < this.floorPattern.length; y++) {
            for (let x = 0; x < this.floorPattern[y].length; x++) {
                if (this.floorPattern[y][x] === 1) {
                    const tileX = offsetX + x * this.tileSize;
                    const tileY = offsetY + y * this.tileSize;
                    
                    // Draw tile with isometric effect
                    ctx.fillStyle = '#4a4a4a';
                    ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);
                    
                    // Add grid lines
                    ctx.strokeStyle = '#333333';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(tileX, tileY, this.tileSize, this.tileSize);
                    
                    // Add highlight effect
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.beginPath();
                    ctx.moveTo(tileX, tileY);
                    ctx.lineTo(tileX + this.tileSize, tileY);
                    ctx.lineTo(tileX + this.tileSize / 2, tileY + this.tileSize / 2);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
    }
}
