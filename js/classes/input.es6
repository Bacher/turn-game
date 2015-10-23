
const KEYS = {
    enter: 13
};

class Input {
    constructor() {
        this._mouse = { x: -999, y: -999 };

        $uiCanvas
            .on('mousemove', e => {
                this._mouse.x = e.offsetX;
                this._mouse.y = e.offsetY;
            })
            .on('mousedown', e => {
                e.preventDefault();

                this._mouse.x = e.offsetX;
                this._mouse.y = e.offsetY;

                surface.makeClick(this._mouse);
            })
            .on('mouseup', e => {});

        $body.on('keydown', e => {
            if (e.which === KEYS.enter) {
                player.restoreAp();
            }
        });
    }

    getMousePos() {
        return this._mouse;
    }
}
