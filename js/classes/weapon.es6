
class Weapon {
    constructor(params) {
        this._name = params.name;

        this._damage = {
            min: Number(params.damage.split('-')[0]),
            max: Number(params.damage.split('-')[1])
        };

        this._range = params.range;

        this._cost = 2;
    }

    getUIString() {
        return `Weapon: ${this._name} (damage: ${this._damage.min}-${this._damage.max}, range: ${this._range}, hit: ${this._cost}ap)`;
    }

    hit(enemy) {
        enemy.dealDamage(this._getRandomDamage());
    }

    _getRandomDamage() {
        const damage = this._damage;

        return damage.min + (Math.floor(Math.random() * (damage.max - damage.min)));
    }
}
