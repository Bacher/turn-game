
class Character extends GameObject {
    constructor(params) {
        super(params);

        this._color = '#777';
        this._hoverColor = '#F00';

        this._stance = STANDS.stand;

        this._hp = 137;
    }

    kill() {
        this.destroy();
    }

    destroy() {
        surface.removeObject(this);
    }

    _draw() {
        ctx.fillStyle = this._color;
        ctx.fillRect(10, 10, CELL_WIDTH - 21, CELL_WIDTH - 21);

        if (this._isHover) {
            ctx.strokeStyle = this._hoverColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, CELL_WIDTH, CELL_WIDTH);
        }
    }

}
