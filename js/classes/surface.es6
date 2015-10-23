
class Surface {
    constructor() {
        this._objects = [];

        this._size = {
            hor: 16,
            ver: 8
        };

        this._userWait = false;

        this._activePlayer = null;
        this._hoverCellPos = null;

        this._cursorAimMode = false;
    }

    draw() {
        const mouse = this._mouse = input.getMousePos();

        ctx.fillStyle = '#0F0';

        for (var y = 0; y < this._size.ver; ++y) {
            for (var x = 0; x < this._size.hor; ++x) {
                ctx.fillRect(x * CELL_WIDTH, y * CELL_WIDTH, CELL_WIDTH - 1, CELL_WIDTH - 1);
            }
        }

        this._objects.forEach(obj => obj.draw());

        if (!this._userWait) {

            if (this._hoverCellPos) {
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.strokeRect(this._hoverCellPos.col * CELL_WIDTH - 1, this._hoverCellPos.row * CELL_WIDTH - 1, CELL_WIDTH + 1, CELL_WIDTH + 1);

                if (this._moveCells) {
                    this._moveCells.some(moveCell => {
                        if (moveCell.pos.row === this._hoverCellPos.row && moveCell.pos.col === this._hoverCellPos.col) {
                            const x = moveCell.pos.col * CELL_WIDTH;
                            const y = moveCell.pos.row * CELL_WIDTH;

                            ctx.font = '20px Sans-serif';
                            ctx.fillStyle = '#F00';
                            ctx.fillText(moveCell.cost, x + 20, y + 30);

                            this._drawPath(moveCell.prev);

                            return true;
                        }
                    });
                }
            }

            if (this._cursorAimMode) {
                ctx.fillStyle = '#000';
                ctx.fillRect(mouse.x - 10, mouse.y - 1, 21, 3);
                ctx.fillRect(mouse.x - 1, mouse.y - 10, 3, 21);

                if (this._activePlayer) {
                    ctx.font = '14px Sans-serif';
                    ctx.fillText(this._activePlayer.weapon._cost + 'ap', mouse.x + 8, mouse.y + 16);
                }
            }

            this._drawMouseHover();
        }
    }

    _drawMouseHover() {
        const local = this._getLocalPos(this._mouse);

        this._hoverCellPos = local;

        if (!this._objects.some(obj => {
                obj.toggleHover(false);

                const isObjectHover = obj.pos.row === local.row && obj.pos.col === local.col;

                if (isObjectHover) {
                    if (this._activePlayer && obj instanceof Enemy) {
                        $body.addClass('hide-cursor');
                        this._cursorAimMode = true;
                    } else {
                        obj.toggleHover(true);
                    }

                    return true;
                }
            })) {
            this._cursorAimMode = false;
            $body.removeClass('hide-cursor');
        }
    }

    _drawPath(moveCell) {
        if (moveCell && moveCell.prev) {
            const pos = moveCell.pos;

            ctx.fillStyle = '#F00';
            ctx.fillRect(pos.col * CELL_WIDTH + 20, pos.row * CELL_WIDTH + 20, 5, 5);

            this._drawPath(moveCell.prev);
        }
    }

    makeClick(mousePos) {
        const local = this._getLocalPos(mousePos);

        if (!this._objects.some(obj => {
            if (obj.pos.row === local.row && obj.pos.col === local.col) {

                if (obj instanceof Player) {
                    obj.toggleActive(true);
                    this._activePlayer = obj;

                } else if (this._activePlayer && obj instanceof Enemy) {
                    this._activePlayer.hit(obj);
                }

                return true;
            }
        })) {
            if (this._moveCells) {
                this._moveCells.some(moveCell => {
                    if (local.row === moveCell.pos.row && local.col === moveCell.pos.col) {
                        this._activePlayer.goTo(moveCell);
                    }
                });
            }
        }
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

    setMoveCells(cells) {
        this._moveCells = cells;

        cells.forEach(cell => {
            this.highlightCell(cell.pos);
        });
    }

    highlightCell(pos) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(pos.col * CELL_WIDTH, pos.row * CELL_WIDTH, CELL_WIDTH-1, CELL_WIDTH-1);
    }

    getAroundFreeCells(pos) {
        const cells = [];

        const row = pos.row;
        const col = pos.col;

        for (var d = 0; d < 4; ++d) {
            const checkPos = {
                row: row + (d > 1 ? (d === 2 ? -1 : 1) : 0),
                col: col + (d < 2 ? (d === 0 ? -1 : 1) : 0)
            };

            if (checkPos.row >= 0 && checkPos.row <= this._size.ver &&
                checkPos.col >= 0 && checkPos.col <= this._size.hor &&
                this._isCellFree(checkPos)
            ) {
                cells.push(checkPos);
            }
        }

        return cells;
    }

    _isCellFree(pos) {
        return true;
    }

    _getLocalPos(xy) {
        return {
            row: Math.floor(xy.y / CELL_WIDTH),
            col: Math.floor(xy.x / CELL_WIDTH)
        };
    }
}
