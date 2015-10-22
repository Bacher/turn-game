
const WIDTH = 800;
const HEIGHT = 400;
const CELL_WIDTH = 50;

const $gameCanvas = $('#game');
const $uiCanvas = $('#ui');

const gameCanvasNode = $gameCanvas.get(0);
const uiCanvasNode = $uiCanvas.get(0);

gameCanvasNode.width = WIDTH;
gameCanvasNode.height = HEIGHT;

uiCanvasNode.width = WIDTH;
uiCanvasNode.height = HEIGHT;

const ctx = gameCanvasNode.getContext('2d');
const uiCtx = uiCanvasNode.getContext('2d');

const input = new Input();

const surface = new Surface();
const ui = new UI();

surface.addObject(new Player({
    col: 3,
    row: 3
}));

surface.addObject(new Enemy({
    col: 6,
    row: 4
}));

setInterval(() => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    surface.draw();

    uiCtx.clearRect(0, 0, WIDTH, HEIGHT);
    ui.draw();
}, 50);
