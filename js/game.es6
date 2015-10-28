
const $body = $('BODY');
const $gameCanvas = $('#game');
const $uiCanvas = $('#ui');
const $ui = $('.ui');

const gameCanvasNode = $gameCanvas.get(0);
const uiCanvasNode = $uiCanvas.get(0);

gameCanvasNode.width = WIDTH;
gameCanvasNode.height = HEIGHT;

uiCanvasNode.width = WIDTH;
uiCanvasNode.height = HEIGHT;

$ui.width(WIDTH);
$ui.height(HEIGHT);

const ctx = gameCanvasNode.getContext('2d');
const uiCtx = uiCanvasNode.getContext('2d');

const input = new Input();

const surface = new Surface();

surface.addEnvObject('wall_1', 8, 3, {
    opaque: false,
    move: false
});
surface.addEnvObject('wall_1', 8, 4, {
    opaque: false,
    move: false
});
surface.addEnvObject('wall_1', 7, 5, {
    opaque: false,
    move: false
});

const ui = new UI();

var player;

surface.addObject((player = new Player({
    col: 3,
    row: 3
})));

//surface.addObject(new Enemy({
//    col: 10,
//    row: 4
//}));

setInterval(() => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    surface.draw();

    uiCtx.clearRect(0, 0, WIDTH, HEIGHT);
    ui.draw();
}, 100);
