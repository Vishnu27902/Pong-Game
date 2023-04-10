import Ball from "./ball.js";
import Paddle from "./paddle.js";

const ball = new Ball(document.getElementById("ball"));
const player_paddle = new Paddle(document.getElementById("player_paddle"));
const computer_paddle = new Paddle(document.getElementById("computer_paddle"));

const player_score = document.getElementById("player_score");
const computer_score = document.getElementById("computer_score");

let lastTime;

function update(time) {
    if (lastTime != null) {
        const modTime = time - lastTime;
        ball.update(modTime, [player_paddle.rect(), computer_paddle.rect()]);
        computer_paddle.update(modTime, ball.y);
        const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"));
        document.documentElement.style.setProperty("--hue", hue + 0.01);
        if (isLose()) {
            handleLose();
        }
    }
    lastTime = time;
    window.requestAnimationFrame(update);
}

document.addEventListener("mousemove", (event) => {
    player_paddle.position = (event.y / window.innerHeight) * 100;
})

function isLose() {
    const rect = ball.rect();
    return rect.right >= window.innerWidth || rect.left <= 0;
}

function handleLose() {
    const rect = ball.rect();
    if (rect.right >= window.innerWidth) {
        player_score.textContent = parseInt(player_score.textContent) + 1;
    } else {
        computer_score.textContent = parseInt(computer_score.textContent) + 1;
    }
    ball.reset();
    computer_paddle.reset();
}

window.requestAnimationFrame(update);
