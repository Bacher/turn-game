
const SEG_HEIGHT = 7;
const K = SEG_HEIGHT / CELL_WIDTH_SHIFT;

class Surface {
    constructor() {
        this._objects = [];
        this._decals = [];

        this._userWait = 0;

        this._size = {
            hor: Math.ceil(WIDTH / CELL_WIDTH),
            ver: Math.ceil(HEIGHT / CELL_VIRT_HEIGHT)
        };

        this._cells = new Array(this._size.ver);
        _.times(this._cells.length, (row) => {
            const rowCells = this._cells[row] = new Array(this._size.hor);

            _.times(rowCells.length, col => {
                const rnd = Math.random();
                var variation = 1;

                if (rnd < 0.2) {
                    variation = 2;
                } else if (rnd < 0.26) {
                    variation = 3;
                }

                rowCells[col] = {
                    textureName: 'ground_' + variation,
                    objects: []
                };
            });
        });

        this._activePlayer = null;
        this._hoverCellPos = null;

        this._cursorAimMode = false;
    }

    calcCellXY(pos) {
        const xy = {
            x: pos.col * CELL_WIDTH,
            y: pos.row * CELL_VIRT_HEIGHT
        };

        if (pos.row % 2) {
            xy.x += CELL_WIDTH_SHIFT;
        }

        return xy;
    }

    draw() {
        const mouse = this._mouse = input.getMousePos();

        this._hoverCellPos = this._getLocalPos(this._mouse);

        ctx.fillStyle = '#0F0';

        for (var row = 0; row < this._size.ver; ++row) {
            const rowCells = this._cells[row];

            for (var col = 0; col < this._size.hor; ++col) {
                const cell = rowCells[col];

                const xy = this.calcCellXY({ row, col });

                Textures.draw(cell.textureName, xy);
                Textures.draw('cell', xy);

                cell.objects.forEach(obj => {
                    Textures.draw(obj.textureName, xy.x, xy.y - 28);
                });
            }
        }

        this._objects.forEach(obj => obj.draw());

        if (!this._userWait) {

            if (this._hoverCellPos) {
                const xy = this.calcCellXY(this._hoverCellPos);

                Textures.draw('hover', xy.x - 1, xy.y - 1);

                if (this._moveCells) {
                    this._moveCells.some(moveCell => {
                        if (moveCell.pos.row === this._hoverCellPos.row && moveCell.pos.col === this._hoverCellPos.col) {
                            ctx.font = '20px Sans-serif';
                            ctx.fillStyle = '#F00';
                            ctx.fillText(moveCell.cost, xy.x + 13, xy.y + 21);

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

        this._decals.forEach(decal => {
            Textures.draw(decal.textureName, decal.xy);

            if (decal.text) {
                ctx.fillStyle = '#000';
                ctx.font = '12px Sans-serif';
                ctx.fillText(decal.text, decal.xy.x + 5, decal.xy.y + 11);
            }
        });
    }

    _drawMouseHover() {
        this._cursorAimMode = false;
        $body.removeClass('hide-cursor');

        this._objects.some(obj => {
            obj.toggleHover(false);

            const isObjectHover = obj.pos.row === this._hoverCellPos.row && obj.pos.col === this._hoverCellPos.col;

            if (isObjectHover) {
                if (this._activePlayer && obj instanceof Enemy && this._activePlayer.canAttack()) {
                    $body.addClass('hide-cursor');
                    this._cursorAimMode = true;

                } else {
                    obj.toggleHover(true);
                }

                return true;
            }
        });
    }

    _drawPath(moveCell) {
        if (moveCell && moveCell.prev) {
            const xy = this.calcCellXY(moveCell.pos);

            Textures.draw('steps', xy.x + 12, xy.y + 7);

            this._drawPath(moveCell.prev);
        }
    }

    makeClick(mousePos) {
        if (!this._userWait) {
            const local = this._getLocalPos(mousePos);

            if (!this._objects.some(obj => {
                    if (obj.pos.row === local.row && obj.pos.col === local.col) {

                        if (obj instanceof Player) {
                            obj.toggleActive(true);
                            this._activePlayer = obj;

                        } else if (this._activePlayer && obj instanceof Enemy && this._activePlayer.canAttack()) {
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
        const xy = this.calcCellXY(pos);

        Textures.draw('move-highlight', xy.x, xy.y);
    }

    getAroundFreeCells(pos) {
        const cells = [];

        const row = pos.row;
        const col = pos.col;

        const xShift = row % 2 === 1 ? 1 : 0;

        [
            [1, 0],
            [-1, 0],
            [ 0 + xShift,  1],
            [-1 + xShift,  1],
            [ 0 + xShift, -1],
            [-1 + xShift, -1]
        ].forEach(variant => {
            const checkPos = {
                row: row + variant[1],
                col: col + variant[0]
            };

            if (checkPos.row >= 0 && checkPos.row <= this._size.ver &&
                checkPos.col >= 0 && checkPos.col <= this._size.hor &&
                this._isCellFree(checkPos)
            ) {
                cells.push(checkPos);
            }
        });

        return cells;
    }

    _isCellFree(pos) {
        return (
            !this._objects.some(object => {
                return object.pos.row === pos.row && object.pos.col === pos.col;
            }) &&
            !this._cells[pos.row][pos.col].objects.some(obj => !obj.params.move)
        );
    }

    _getLocalPos(xy) {
        const pos = {
            row: 0,
            col: 0
        };

        const y21 = xy.y % CELL_VIRT_HEIGHT;
        const y42 = xy.y % (CELL_VIRT_HEIGHT * 2);

        if (y21 > SEG_HEIGHT) {
            pos.row = Math.floor(xy.y / CELL_VIRT_HEIGHT);

            if (y42 <= CELL_VIRT_HEIGHT) {
                pos.col = Math.floor(xy.x / CELL_WIDTH);

            } else {
                pos.col = Math.floor((xy.x - CELL_WIDTH_SHIFT) / CELL_WIDTH);
            }

        } else {
            var x36 = xy.x % CELL_WIDTH;

            if (y42 < CELL_VIRT_HEIGHT) {
                x36 = (x36 + CELL_WIDTH_SHIFT) % CELL_WIDTH;
            }

            var side;

            if (x36 < CELL_WIDTH_SHIFT) {
                side = y21 / x36 > K;

            } else {
                side = (SEG_HEIGHT - y21) / (x36 - CELL_WIDTH_SHIFT) < K;
            }

            if (side) {
                pos.row = Math.floor(xy.y / CELL_VIRT_HEIGHT);

                if (y42 < CELL_VIRT_HEIGHT) {
                    pos.col = Math.floor(xy.x / CELL_WIDTH);
                } else {
                    pos.col = Math.floor((xy.x - CELL_WIDTH_SHIFT)/ CELL_WIDTH);
                }

            } else {
                pos.row = Math.floor(xy.y / CELL_VIRT_HEIGHT) - 1;

                if (y42 < CELL_VIRT_HEIGHT) {
                    pos.col = Math.floor((xy.x - CELL_WIDTH_SHIFT) / CELL_WIDTH);
                } else {
                    pos.col = Math.floor(xy.x / CELL_WIDTH);
                }
            }
        }

        return pos;
    }

    wait(ms) {
        this._userWait++;

        $body.addClass('wait');

        if (ms) {
            setTimeout(() => {
                this.play();
            }, ms);
        }
    }

    play() {
        this._userWait--;

        if (this._userWait) {
            $body.removeClass('wait');
        }
    }

    addDecal(decal) {
        this._decals.push(decal);

        if (decal.lifeTime) {
            setTimeout(() => {
                this.removeDecal(decal);
            }, decal.lifeTime);
        }
    }

    removeDecal(decal) {
        var index;

        if ((index = this._decals.indexOf(decal)) !== -1) {
            this._decals.splice(index, 1);
        }
    }

    addEnvObject(textureName, col, row, params) {
        this._cells[row][col].objects.push({
            textureName,
            params
        });
    }
}
