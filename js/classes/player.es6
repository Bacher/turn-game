
class Player extends Character {
    constructor(params) {
        super(params);

        this._color = '#00F';
        this._isActive = false;

        this._ap = 53;
    }

    toggleActive(enable) {
        this._isActive = enable;
    }

    hit(enemy) {
        enemy.kill();
    }

    _draw() {
        Character.prototype._draw.call(this);

        if (this._isActive) {
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, CELL_WIDTH, CELL_WIDTH);
        }
    }

}
