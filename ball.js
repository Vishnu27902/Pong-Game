const INITIAL_SPEED = 0.00001;
const SPEED_INCREMENT = 0.00001;

const audio = new Audio("./strike.mp3");

export default class Ball {
    constructor(ballElement) {
        this.ballElement = ballElement;
        this.reset();
    }

    get x() {
        return parseFloat(getComputedStyle(this.ballElement).getPropertyValue("--x"));
    }

    set x(val) {
        this.ballElement.style.setProperty("--x", val);
    }

    get y() {
        return parseFloat(getComputedStyle(this.ballElement).getPropertyValue("--y"));
    }

    set y(val) {
        this.ballElement.style.setProperty("--y", val);
    }

    update(modTime, paddleRect) {
        this.x += this.coordinate.x + this.speed ;
        this.y += this.coordinate.y + this.speed ;
        this.speed += SPEED_INCREMENT;
        const rect = this.rect();

        if (rect.bottom >= window.innerHeight || rect.top <= 0) {
            audio.play();
            this.coordinate.y *= -1;
        }

        if (paddleRect.some(element => isCollison(element, rect))) {
            audio.play();
            this.coordinate.x *= -1;
        }
    }

    rect() {
        return this.ballElement.getBoundingClientRect();
    }

    reset() {
        this.x = 50;
        this.y = 50;
        this.coordinate = { x: 0 };
        while (Math.abs(this.coordinate.x) <= .2 || Math.abs(this.coordinate.x) >= .9) {
            const pointer = randomNumber(0, 2 * Math.PI);
            this.coordinate = { x: Math.cos(pointer), y: Math.sin(pointer) }
        }
        this.speed = INITIAL_SPEED;
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function isCollison(rect1, rect2) {
    return (rect1.left <= rect2.right && rect1.right >= rect2.left && rect1.bottom >= rect2.top && rect1.top <= rect2.bottom);
}