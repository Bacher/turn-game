
const MODEL_DIRECTION = {
    'up': 'back',
    'down': 'front',
    'left': 'left',
    'right': 'right'
};

class Character extends GameObject {
    constructor(params) {
        super(params);

        this._hoverColor = '#F00';

        this._stance = STANDS.stand;
        this._direction = 'right';

        this._hp = 137;
    }

    dealDamage(amount, by) {
        this._hp -= amount;

        if (this._hp <= 0) {
            this._hp = 0;

            this.kill();
        }

        surface.addBloodSpray(this, by);
    }

    kill() {
        this.destroy();
    }

    destroy() {
        surface.removeObject(this);
    }

    _draw() {
        var textureName = this._textureName + '_' + MODEL_DIRECTION[this._direction] + '_' + STANDS_L[this._stance];

        if (Math.random() < 0.5) {
            textureName += '_2';
        }

        Textures.draw(textureName, this._xy.x + 10, this._xy.y - 14);

        if (this._isHover) {
            ctx.strokeStyle = this._hoverColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(this._xy.x, this._xy.y, CELL_WIDTH, CELL_WIDTH);
        }
    }

}
