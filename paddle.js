const SPEED = 0.02;

export default class Paddle {
    constructor(paddleElement) {
        this.paddleElement = paddleElement;
        this.reset();
    }
    
    get position() {
        return parseFloat(getComputedStyle(this.paddleElement).getPropertyValue("--position"));
    }

    set position(val) {
        this.paddleElement.style.setProperty("--position", val);
    }

    update(modTime, ballPosY) {
        this.position += SPEED * modTime * (ballPosY - this.position);
    }

    reset() {
        this.position = 50;
    }

    rect() {
        return this.paddleElement.getBoundingClientRect();
    }
}