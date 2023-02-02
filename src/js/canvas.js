window.addEventListener('load', function () {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let colorMemory = '';

    if (canvas.width > 780) {
        drawArc(window.innerWidth / 6, 350, 47, 0, 360, false, "#FFD247");
        drawArc(window.innerWidth / 1.65, 350, 70, 0, 360, false, "#FFD247");
        drawArc(window.innerWidth / 2, window.innerHeight / 2, 20, 0, 360, false, "#13CC00");
    }

    drawArc(0, 0, 250, 0, 360, false, "#FFD247", "#FFD247");
    // drawArc(window.innerWidth, window.innerHeight / 2, window.innerHeight / 2, 0, 360, false, "#4947E5", "#4947E5");

    function drawArc(xPos, yPos, radius, startAngle, endAngle, anticlockwise, fillColor) {
        var startAngle = startAngle * (Math.PI / 180);
        var endAngle = endAngle * (Math.PI / 180);
        var radius = radius;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = 0;
        ctx.beginPath();
        ctx.arc(xPos, yPos, radius, startAngle, endAngle, anticlockwise);
        ctx.fill();
    }

    const text = 'Hello I`m Olga, front-end developer.';

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.canvasWidth;
            this.y = Math.random() * this.effect.canvasHeight;
            // this.x = Math.random() * this.effect.canvasWidth;
            // this.y = this.effect.canvasHeight;
            this.originX = x;
            this.originY = y;
            this.size = this.effect.gap;
            this.color = color;
            this.dx = 0;
            this.dy = 0;
            this.vx = 0;
            this.vy = 0;
            this.force = 0;
            this.angle = 0;
            this.distance = 0;
            // this.friction = Math.random() * 0.6 + 0.15;
            // this.ease = Math.random() * 0.1 + 0.005;
            this.friction = Math.random() * 0.6 + 0.15;
            this.ease = Math.random() * 0.1 + .1;
        }
        update() {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.radius / this.distance;
            if (this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }
            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        }
        draw() {
            // only change colours when this colour is different than previous
            if (colorMemory != this.color) {
                this.effect.context.fillStyle = this.color;
            }
            this.effect.context.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    class Effect {
        constructor(context, canvasWidth, canvasHeight) {
            this.context = context;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.fontSize = 50;
            this.maxTextWidth = this.canvasWidth / 100 * 40;
            this.textX = this.canvasWidth / 100 * 5;
            this.gap = 2;
            this.textVerticalOffset = 0;
            this.lineHeight = this.fontSize;
            this.textY = this.canvasHeight / 2 - this.lineHeight / 2;
            this.particles = [];
            this.mouse = {
                radius: 20000,
                x: 0,
                y: 0
            }
            document.querySelector('#homePage').addEventListener("mousemove", e => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            });
        }
        /* Examples of analogous combinations:
        Violet, blue, and teal.
        Red, fuchsia, and purple.
        Red, orange, and yellow.
        Green, blue, and purple.*/
        wrapText(text) {
            if (this.canvasWidth < 680) {
                this.fontSize = 50;
                this.maxTextWidth = this.canvasWidth / 100 * 80;
                this.textX = this.canvasWidth / 100 * 5;
                this.gap = 1;
                this.lineHeight = this.fontSize;
            } else if (this.canvasWidth < 1169) {
                this.maxTextWidth = this.canvasWidth / 100 * 40;
            } else {
                this.fontSize = 75;
                this.textX = this.canvasWidth / 100 * 15;
                this.gap = 2;
                this.lineHeight = this.fontSize;
            }
            this.context.font = "bold " + this.fontSize + 'rem DM Sans';
            this.context.textAlign = 'start';
            this.context.textBaseline = 'middle';
            // this.context.strokeStyle = 'white';
            // this.context.lineWidth = 5;
            this.context.letterSpacing = "3px"; // experimental property
            this.context.imageSmoothingEnabled = false
            //this.context.fillStyle = 'white';
            // const edge = this.canvasWidth * 0.2;
            // const gradient = this.context.createLinearGradient(edge, edge, this.canvasWidth - edge, this.canvasHeight - edge);
            // gradient.addColorStop(0, 'red');
            // gradient.addColorStop(0.5, 'fuchsia');
            // gradient.addColorStop(1, 'purple');
            this.context.fillStyle = '#292930';
            let linesArray = [];
            let words = text.split(' ');
            let lineCounter = 0;
            let line = '';
            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                if (this.context.measureText(testLine).width > this.maxTextWidth) {
                    line = words[i] + ' ';
                    lineCounter++;
                } else {
                    line = testLine;
                }
                linesArray[lineCounter] = line;
            }
            let textHeight = this.lineHeight * lineCounter;
            this.textY = this.canvasHeight / 2 - textHeight / 2 + this.textVerticalOffset;
            linesArray.forEach((el, index) => {
                this.context.fillText(el, this.textX, this.textY + (index * this.lineHeight));
                this.context.strokeText(el, this.textX, this.textY + (index * this.lineHeight));
            });
            this.convertToParticles();
        }
        convertToParticles() {
            this.particles = [];
            const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
            for (let y = 0; y < this.canvasHeight; y += this.gap) {
                for (let x = 0; x < this.canvasWidth; x += this.gap) {
                    const index = (y * this.canvasWidth + x) * 4;
                    const alpha = pixels[index + 3];
                    if (alpha > 0) {
                        const red = pixels[index];
                        const green = pixels[index + 1];
                        const blue = pixels[index + 2];
                        const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                        if (colorMemory != color) {
                            colorMemory = color;
                        }
                        this.particles.push(new Particle(this, x, y, color));
                    }
                }
            }
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
        render() {
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            })
        }
    }

    let effect = new Effect(ctx, canvas.width, canvas.height);
    effect.wrapText(text);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        effect = new Effect(ctx, canvas.width, canvas.height);
        effect.wrapText(text);
    });
});