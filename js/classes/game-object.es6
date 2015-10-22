
class GameObject {
    constructor(params) {
        this.pos = {
            row: params.row,
            col: params.col
        };

        this._isHover = false;
    }

    draw() {
        ctx.save();

        ctx.translate(this.pos.col * CELL_WIDTH, this.pos.row * CELL_WIDTH);

        this._draw();

        ctx.restore();
    }

    _draw() {
        ctx.fillStyle = '#F00';
        ctx.fillRect(0, 0, CELL_WIDTH-1, CELL_WIDTH-1);
    }

    toggleHover(enable) {
        this._isHover = enable;
    }

}
