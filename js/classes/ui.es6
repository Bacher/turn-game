
class UI {
    constructor() {

    }

    draw() {
        if (true) {
            uiCtx.font = '20px Serif';
            uiCtx.fillText('Enemy turn', 340, 20);

            $uiCanvas.toggleClass('enemy-turn', true);
        }

        const player = surface.getActivePlayer();

        if (player) {
            uiCtx.font = '16px Sans-serif';
            uiCtx.fillText('HP: ' + player._hp, 10, 340);
            uiCtx.fillText('AP: ' + player._ap, 10, 360);
        }
    }
}
