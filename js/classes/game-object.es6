
class GameObject {
    constructor(params) {
        this.move(params);

        this._isHover = false;
    }

    draw() {
        this._draw();
    }

    _draw() {
        ctx.fillStyle = '#F00';
        ctx.fillRect(0, 0, CELL_WIDTH-1, CELL_WIDTH-1);
    }

    move(pos) {
        this.pos = {
            row: pos.row,
            col: pos.col
        };

        this._xy = surface.calcCellXY(this.pos);
    }

    rotateToDirection(toPos) {
        if (toPos.col !== this.pos.col || toPos.row !== this.pos.row) {
            if (toPos.row % 2 === 0) {
                this._direction = (toPos.col > this.pos.col ? 'right' : 'left');
            } else {
                this._direction = (toPos.col >= this.pos.col ? 'right' : 'left');
            }
        }
    }

    toggleHover(enable) {
        this._isHover = enable;
    }

}
