
class Player extends Character {
    constructor(params) {
        super(params);

        this._textureName = 'character';
        this._isActive = false;

        this._fullAp = this._ap = 4;

        this.weapon = new Weapon({
            name: 'SVD',
            damage: '30-45',
            range: 15
        });
    }

    toggleActive(enable) {
        this._isActive = enable;
    }

    hit(enemy) {
        this._ap -= this.weapon._cost;

        this.weapon.hit(enemy);
    }

    _draw() {
        if (this._isActive) {
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(this._xy.x, this._xy.y, CELL_WIDTH, CELL_WIDTH);

            const cur = { cost: 0, pos: this.pos };
            const cells = [cur];

            this._getMoveCells(cells, cur, this._ap);

            cells.splice(0, 1);

            surface.setMoveCells(cells);
        }

        Character.prototype._draw.call(this);
    }

    _getMoveCells(already, cur, ap) {
        if (ap >= 2) {
            const cells = surface.getAroundFreeCells(cur.pos);

            const added = [];

            cells.forEach(cell => {
                if (!already.some(move => move.pos.col === cell.col && move.pos.row === cell.row)) {
                    const tmp = {
                        pos: cell,
                        prev: cur,
                        cost: 2 + cur.cost
                    };

                    added.push(tmp);
                    already.push(tmp);
                }
            });

            added.forEach(move => {
                this._getMoveCells(already, move, ap - 2);
            });
        }
    }

    reduceAp(amount) {
        this._ap -= amount;

        if (this._ap < 0) {
            this._ap = 0;
        }
    }

    restoreAp() {
        this._ap = this._fullAp;
    }

    goTo(finalCell) {
        this.reduceAp(finalCell.cost);

        surface.wait();

        const steps = [];
        var moveCell = finalCell;

        while (moveCell) {
            steps.push(moveCell);

            moveCell = moveCell.prev;
        }

        steps.length = steps.length - 1;

        var step = steps.length - 1;
        var animationStep = 1;
        var startPos = _.clone(this._xy);
        var moveTo = steps[step];
        var moveToXY = this._calcXY(moveTo.pos);

        const intervalId = setInterval(() => {
            const delta = animationStep / 8;
            this._xy.x = Math.round(startPos.x + (moveToXY.x - startPos.x) * delta);
            this._xy.y = Math.round(startPos.y + (moveToXY.y - startPos.y) * delta);

            animationStep++;

            if (animationStep === 9) {
                if (step === 0) {
                    this.move(finalCell.pos);

                    const prevCellPos = moveTo.prev.pos;

                    if (finalCell.pos.row !== prevCellPos.row) {
                        this._direction = (finalCell.pos.row > prevCellPos.row ? 'up' : 'down')
                    } else {
                        this._direction = (finalCell.pos.col > prevCellPos.col ? 'right' : 'left')
                    }

                    clearInterval(intervalId);

                    surface.play();

                } else {
                    animationStep = 1;
                    step--;

                    startPos = _.clone(this._xy);
                    moveTo = steps[step];
                    moveToXY = this._calcXY(moveTo.pos);
                }
            }

        }, 50);
    }

    canAttack() {
        return this._ap >= this.weapon._cost;
    }

}
