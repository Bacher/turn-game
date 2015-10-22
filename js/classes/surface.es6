
class Surface {
    constructor() {
        this._objects = [];

        this._activePlayer = null;
    }

    draw() {
        ctx.fillStyle = '#0F0';

        for (var y = 0; y < 400/CELL_WIDTH; ++y) {
            for (var x = 0; x < 800/CELL_WIDTH; ++x) {
                ctx.fillRect(x * CELL_WIDTH, y * CELL_WIDTH, CELL_WIDTH-1, CELL_WIDTH-1);
            }
        }

        this._objects.forEach(obj => obj.draw());
    }

    mouseMove(mousePos) {
        const local = this._getLocalPos(mousePos);

        this._objects.forEach(obj => {
            obj.toggleHover(obj.pos.row === local.row && obj.pos.col === local.col);
        });
    }

    makeClick(mousePos) {
        const local = this._getLocalPos(mousePos);

        this._objects.some(obj => {
            if (obj.pos.row === local.row && obj.pos.col === local.col) {

                if (obj instanceof Player) {
                    obj.toggleActive(true);
                    this._activePlayer = obj;

                } else if (this._activePlayer && obj instanceof Enemy) {
                    this._activePlayer.hit(obj);
                }

                return true;
            }
        });
    }

    addObject(obj) {
        this._objects.push(obj);
    }

    removeObject(obj) {
        var index;
        if ((index = this._objects.indexOf(obj)) !== -1) {
            this._objects.splice(index, 1);
        }
    }

    getActivePlayer() {
        return this._activePlayer;
    }

    _getLocalPos(xy) {
        return {
            row: Math.floor(xy.y / CELL_WIDTH),
            col: Math.floor(xy.x / CELL_WIDTH)
        };
    }
}
