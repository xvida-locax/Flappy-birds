const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 360;
canvas.height = 640;

const birdImg = new Image();
const topPipeImg = new Image();
const bottomPipeImg = new Image();
const backgroundImg = new Image();

birdImg.src = 'flappybird.png';
topPipeImg.src = 'toppipe.png';
bottomPipeImg.src = 'bottompipe.png';
backgroundImg.src = 'background.png';

const bird = {
    x: canvas.width / 8,
    y: canvas.height / 2,
    width: 24,
    height: 14,
    gravity: 0.3,
    lift: -6,
    velocity: 0,
};

const pipes = [];
const pipeWidth = 64;
const pipeHeight = 502;
let score = 0;
let highScore = 0;
let gameOver = false;
const pipeSpeed = 1;
const pipeOpening = 150; 
const pipeDistance = 300;
let bgMusic;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameOver) {
            resetGame();
        } else {
            bird.velocity = bird.lift;
        }
    }
});

function startGame() {
    document.getElementById('menu').style.display = 'none';
    canvas.style.display = 'block';
    playRandomMusic();
    resetGame();
}

function playRandomMusic() {
    const musicTracks = [
        document.getElementById('bgMusic1'),
        document.getElementById('bgMusic2'),
        document.getElementById('bgMusic3')
    ];

    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }

    bgMusic = musicTracks[Math.floor(Math.random() * musicTracks.length)];
    bgMusic.play();
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameOver = false;
    loop();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    pipes.forEach(pipe => {
        ctx.drawImage(topPipeImg, pipe.x, pipe.y, pipeWidth, pipeHeight);
        ctx.drawImage(bottomPipeImg, pipe.x, pipe.y + pipeHeight + pipeOpening, pipeWidth, pipeHeight);
    });

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
        updateHighScore();
        setTimeout(() => {
            canvas.style.display = 'none';
            document.getElementById('menu').style.display = 'block';
        }, 2000);  // Esperar 2 segundos antes de regresar al menú
    }
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
        bgMusic.pause();  // Pausar música al perder
        bgMusic.currentTime = 0;  // Reiniciar música
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - pipeDistance) {
        const pipeY = Math.random() * ((canvas.height / 3) - pipeHeight) + 30; 
        pipes.push({ x: canvas.width, y: pipeY, width: pipeWidth, height: pipeHeight });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y + pipeHeight || bird.y + bird.height > pipe.y + pipeHeight + pipeOpening)) { 
            gameOver = true;
            bgMusic.pause();  // Pausar música al perder
            bgMusic.currentTime = 0;  // Reiniciar música
        }

        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }
    });

    draw();
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        document.getElementById('highscores').innerHTML = `<li>1. ${highScore} (Nuevo Récord)</li>`;
    } else {
        document.getElementById('highscores').innerHTML = `<li>1. ${highScore}</li>`;
    }
}

function loop() {
    if (!gameOver) {
        update();
        requestAnimationFrame(loop);
    } else {
        draw();
    }
}

backgroundImg.onload = () => {
    birdImg.onload = () => {
        topPipeImg.onload = () => {
            bottomPipeImg.onload = () => {
                document.getElementById('menu').style.display = 'block';
            };
        };
    };
};
