
class GameObject {
    constructor(params) {
        this.pos = {
            row: params.row,
            col: params.col
        };

        this._isHover = false;

        this._xy = this._calcXY(this.pos);
    }

    draw() {
        this._draw();
    }

    _draw() {
        ctx.fillStyle = '#F00';
        ctx.fillRect(0, 0, CELL_WIDTH-1, CELL_WIDTH-1);
    }

    _calcXY(pos) {
        return {
            x: pos.col * CELL_WIDTH,
            y: pos.row * CELL_WIDTH
        };
    }

    toggleHover(enable) {
        this._isHover = enable;
    }

}
