/*
 * [F3V3R DR34M] - 4ST3R01DS 404
 * CR4CK3D BY: Z4R1G4T4
 * PL4Y 0R D13!
 */

class AsteroidsGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ship = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 10,
            angle: 0,
            rotation: 0,
            velocity: { x: 0, y: 0 },
            thrusting: false
        };
        this.bullets = [];
        this.asteroids = [];
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameOver = false;
        this.keys = {};
        this.FRICTION = 0.99;
        this.SHIP_THRUST = 0.5;
        this.TURN_SPEED = 0.1;
        this.BULLET_SPEED = 7;
        this.MAX_BULLETS = 5;
        this.ASTEROID_SPEED = 2;
        this.ASTEROID_VERTICES = 10;
        this.ASTEROID_JAG = 0.4;
        this.FONT_FAMILY = "'Press Start 2P', monospace";
        
        // Initialize event listeners
        this.setupEventListeners();
        
        // Start game
        this.createAsteroids();
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.keys[e.key] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key] = false);
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && !this.gameOver) {
                this.shoot();
            }
            if (e.key === 'Enter' && this.gameOver) {
                this.resetGame();
            }
        });
    }

    createAsteroids() {
        const numAsteroids = 3 + (this.level - 1) * 2;
        for (let i = 0; i < numAsteroids; i++) {
            let x, y;
            do {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
            } while (this.distBetweenPoints(x, y, this.ship.x, this.ship.y) < 100);

            this.asteroids.push({
                x: x,
                y: y,
                radius: 50,
                velocity: {
                    x: (Math.random() * 2 - 1) * this.ASTEROID_SPEED,
                    y: (Math.random() * 2 - 1) * this.ASTEROID_SPEED
                },
                vertices: this.createAsteroidVertices()
            });
        }
    }

    createAsteroidVertices() {
        const vertices = [];
        for (let i = 0; i < this.ASTEROID_VERTICES; i++) {
            const angle = (i * Math.PI * 2) / this.ASTEROID_VERTICES;
            const jag = 1 + Math.random() * this.ASTEROID_JAG;
            vertices.push({
                x: Math.cos(angle) * jag,
                y: Math.sin(angle) * jag
            });
        }
        return vertices;
    }

    shoot() {
        if (this.bullets.length < this.MAX_BULLETS) {
            const angle = this.ship.angle;
            this.bullets.push({
                x: this.ship.x + Math.cos(angle) * this.ship.radius,
                y: this.ship.y - Math.sin(angle) * this.ship.radius,
                velocity: {
                    x: Math.cos(angle) * this.BULLET_SPEED,
                    y: -Math.sin(angle) * this.BULLET_SPEED
                },
                lifetime: 60
            });
        }
    }

    updateShip() {
        // Rotation
        if (this.keys['ArrowLeft']) this.ship.rotation = this.TURN_SPEED;
        else if (this.keys['ArrowRight']) this.ship.rotation = -this.TURN_SPEED;
        else this.ship.rotation = 0;

        // Thrust
        this.ship.thrusting = this.keys['ArrowUp'];
        if (this.ship.thrusting) {
            this.ship.velocity.x += Math.cos(this.ship.angle) * this.SHIP_THRUST;
            this.ship.velocity.y -= Math.sin(this.ship.angle) * this.SHIP_THRUST;
        }

        // Update position
        this.ship.x += this.ship.velocity.x;
        this.ship.y += this.ship.velocity.y;
        this.ship.angle += this.ship.rotation;

        // Apply friction
        this.ship.velocity.x *= this.FRICTION;
        this.ship.velocity.y *= this.FRICTION;

        // Screen wrapping
        this.ship.x = this.wrapCoordinate(this.ship.x, this.canvas.width);
        this.ship.y = this.wrapCoordinate(this.ship.y, this.canvas.height);
    }

    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.velocity.x;
            bullet.y += bullet.velocity.y;
            bullet.x = this.wrapCoordinate(bullet.x, this.canvas.width);
            bullet.y = this.wrapCoordinate(bullet.y, this.canvas.height);
            bullet.lifetime--;

            if (bullet.lifetime <= 0) {
                this.bullets.splice(i, 1);
            }
        }
    }

    updateAsteroids() {
        for (let asteroid of this.asteroids) {
            asteroid.x += asteroid.velocity.x;
            asteroid.y += asteroid.velocity.y;
            asteroid.x = this.wrapCoordinate(asteroid.x, this.canvas.width);
            asteroid.y = this.wrapCoordinate(asteroid.y, this.canvas.height);
        }
    }

    checkCollisions() {
        // Check bullet collisions
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            for (let j = this.bullets.length - 1; j >= 0; j--) {
                const bullet = this.bullets[j];
                if (this.distBetweenPoints(asteroid.x, asteroid.y, bullet.x, bullet.y) < asteroid.radius) {
                    // Split asteroid or remove it
                    if (asteroid.radius > 20) {
                        this.splitAsteroid(i);
                    }
                    this.asteroids.splice(i, 1);
                    this.bullets.splice(j, 1);
                    this.score += 100;
                    break;
                }
            }
        }

        // Check ship collision
        if (!this.gameOver) {
            for (let asteroid of this.asteroids) {
                if (this.distBetweenPoints(this.ship.x, this.ship.y, asteroid.x, asteroid.y) < asteroid.radius + this.ship.radius) {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver = true;
                    } else {
                        this.resetShip();
                    }
                    break;
                }
            }
        }

        // Check level completion
        if (this.asteroids.length === 0) {
            this.level++;
            this.createAsteroids();
        }
    }

    splitAsteroid(index) {
        const asteroid = this.asteroids[index];
        const newRadius = asteroid.radius / 2;
        for (let i = 0; i < 2; i++) {
            this.asteroids.push({
                x: asteroid.x,
                y: asteroid.y,
                radius: newRadius,
                velocity: {
                    x: (Math.random() * 2 - 1) * this.ASTEROID_SPEED * 1.5,
                    y: (Math.random() * 2 - 1) * this.ASTEROID_SPEED * 1.5
                },
                vertices: this.createAsteroidVertices()
            });
        }
    }

    resetShip() {
        this.ship.x = this.canvas.width / 2;
        this.ship.y = this.canvas.height / 2;
        this.ship.velocity = { x: 0, y: 0 };
        this.ship.angle = 0;
    }

    resetGame() {
        this.ship = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: 10,
            angle: 0,
            rotation: 0,
            velocity: { x: 0, y: 0 },
            thrusting: false
        };
        this.bullets = [];
        this.asteroids = [];
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameOver = false;
        this.createAsteroids();
    }

    drawShip() {
        this.ctx.save();
        this.ctx.translate(this.ship.x, this.ship.y);
        this.ctx.rotate(this.ship.angle);
        
        // Draw ship
        this.ctx.strokeStyle = '#0F0';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-10, -10);
        this.ctx.lineTo(20, 0);
        this.ctx.lineTo(-10, 10);
        this.ctx.lineTo(-5, 0);
        this.ctx.closePath();
        this.ctx.stroke();

        // Draw thrust
        if (this.ship.thrusting) {
            this.ctx.beginPath();
            this.ctx.moveTo(-5, 0);
            this.ctx.lineTo(-15, 5);
            this.ctx.lineTo(-13, 0);
            this.ctx.lineTo(-15, -5);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawBullets() {
        this.ctx.fillStyle = '#0F0';
        for (let bullet of this.bullets) {
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawAsteroids() {
        this.ctx.strokeStyle = '#0F0';
        this.ctx.lineWidth = 2;
        for (let asteroid of this.asteroids) {
            this.ctx.beginPath();
            for (let i = 0; i < asteroid.vertices.length; i++) {
                const vertex = asteroid.vertices[i];
                const x = asteroid.x + vertex.x * asteroid.radius;
                const y = asteroid.y + vertex.y * asteroid.radius;
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    drawHUD() {
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = '20px ' + this.FONT_FAMILY;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`SC0R3: ${this.score}`, 20, 40);
        this.ctx.fillText(`L1V3S: ${this.lives}`, 20, 70);
        this.ctx.fillText(`L3V3L: ${this.level}`, 20, 100);

        if (this.gameOver) {
            this.ctx.textAlign = 'center';
            this.ctx.fillText('G4M3 0V3R', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('PR3SS 3NT3R T0 R3ST4RT', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }

    wrapCoordinate(coord, max) {
        if (coord < 0) return max + (coord % max);
        return coord % max;
    }

    distBetweenPoints(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    gameLoop() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gameOver) {
            this.updateShip();
            this.updateBullets();
            this.updateAsteroids();
            this.checkCollisions();
        }

        this.drawShip();
        this.drawBullets();
        this.drawAsteroids();
        this.drawHUD();

        requestAnimationFrame(() => this.gameLoop());
    }
}
