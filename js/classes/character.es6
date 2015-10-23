
class Character extends GameObject {
    constructor(params) {
        super(params);

        this._hoverColor = '#F00';

        this._stance = STANDS.stand;
        this._direction = 'right';

        this._hp = 137;
    }

    dealDamage(amount) {
        this._hp -= amount;

        if (this._hp <= 0) {
            this._hp = 0;

            this.kill();
        }
    }

    kill() {
        this.destroy();
    }

    destroy() {
        surface.removeObject(this);
    }

    _draw() {
        if (this._textureName) {
            const texture = Textures.get(this._textureName + '_' + this._direction);

            if (texture) {
                ctx.drawImage(texture, this._xy.x + 10, this._xy.y - 14);
            }
        }

        if (this._isHover) {
            ctx.strokeStyle = this._hoverColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(this._xy.x, this._xy.y, CELL_WIDTH, CELL_WIDTH);
        }
    }

}
