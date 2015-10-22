
class Input {
    constructor() {
        this._mouse = { x: 0, y: 0 };

        $uiCanvas
            .on('mousemove', e => {
                this._mouse.x = e.offsetX;
                this._mouse.y = e.offsetY;

                surface.mouseMove(this._mouse);
            })
            .on('mousedown', e => {
                this._mouse.x = e.offsetX;
                this._mouse.y = e.offsetY;

                surface.makeClick(this._mouse);
            })
            .on('mouseup', e => {});
    }
}
