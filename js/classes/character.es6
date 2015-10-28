
const MODEL_DIRECTION = {
    'up': 'back',
    'down': 'front',
    'left': 'left',
    'right': 'right'
};

class Character extends GameObject {
    constructor(params) {
        super(params);

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

        surface.wait(300);

        surface.addDecal({
            xy: { x: this._xy.x + 22, y: this._xy.y - 20 },
            textureName: 'blood-spray_right',
            lifeTime: 500
        });

        surface.addDecal({
            xy: { x: this._xy.x + 1, y: this._xy.y - 30 },
            textureName: 'hit-label',
            lifeTime: 1000,
            text: -amount
        });
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

        Textures.draw(textureName, this._xy.x + 2, this._xy.y - 40);
    }

}
