const canvas = document.querySelector('#drawingCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let patricleArray = [];


// mouse
let mouse = {
    x: null,
    y: null,
    radius: 100
};

document.querySelector('#homePage').addEventListener('mousemove', function (event) {
    mouse.x = event.x + canvas.clientLeft / 2;
    mouse.y = event.y + canvas.clientTop / 2;
});

function drawImage() {
    let imgWidth = png.width;
    let imgHeight = png.height;
    const data = ctx.getImageData(0, 0, imgWidth, imgHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    class Particle {
        constructor(x, y, color, size) {
            this.x = x + canvas.width / 1.4 - png.width * 1.4,
                this.y = y + canvas.height / 2 - png.height * 2,
                this.color = color,
                this.size = 2,
                this.baseX = x + canvas.width / 1.4 - png.width * 1.4,
                this.baseY = y + canvas.height / 2 - png.height * 2,
                this.density = rand(10, 12);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;

            // collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            //max distance, past that force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);

            if (distance < mouse.radius + this.size) {
                this.x -= directionX * 2.5;
                this.y -= directionY * 2.5;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX
                    this.x -= dx / 6;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY
                    this.y -= dy / 6;
                }
            }
            this.draw();
        }
    }

    function init() {
        patricleArray = [];
        for (let y = 0, y2 = data.height; y < y2; y++) {
            for (let x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," +
                        data.data[(y * 4 * data.width) + (x * 4) + 1] + "," +
                        data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                    patricleArray.push(new Particle(positionX * 4, positionY * 4, color));
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(250,250,250,0.4)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = 0; i < patricleArray.length; i++) {
            patricleArray[i].update();
        }
    }
    init();
    animate();

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1400) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        }
    });
}

const png = new Image()
png.src = "data:image/png;base64,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";



window.addEventListener('load', (event) => {
    console.log('page has loaded');
    ctx.drawImage(png, 0, 0);
    drawImage();
})

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}