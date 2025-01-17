/*
 * [F3V3R DR34M] - CH4R4CT3R CL4SS
 * K3YG3N BY: Z4R1G4T4
 * WH3N 1N D0UBT, BL4M3 TH3 US3R!
 */

class Character {
    constructor(username, x, y) {
        this.username = username;
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.speed = 3;
        this.color = this.generateColor();
        this.size = 30;
    }

    generateColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.speed) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    draw(ctx) {
        // Draw character body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw username
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.username, this.x, this.y - this.size);
    }
}
