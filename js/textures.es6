
const Textures = {
    _hash: {}
};

Textures.loadTexture = function(name, width, height, extension = 'gif') {
    const img = new Image();

    Textures._hash[name] = {
        img,
        x: 0,
        y: 0,
        width,
        height
    };

    img.src = `textures/${name}.${extension}`;
};

Textures.loadSprite = function(name, width, height, parts) {
    const img = new Image();

    parts.forEach((line, y) => {
        line.forEach((part, x) => {
            Textures._hash[name + '_' + part] = {
                img,
                x: x * (width + 1),
                y: y * (height + 1),
                width,
                height
            };
        });
    });

    img.src = `textures/${name}.gif`;
};

Textures.draw = function(name, x, y) {
    if (typeof x === 'object') {
        y = x.y;
        x = x.x;
    }

    const texture = Textures._hash[name];

    if (texture) {
        ctx.drawImage(texture.img, texture.x, texture.y, texture.width, texture.height, x, y, texture.width, texture.height);
    }
};

Textures.get = function(name) {
    return Textures._hash[name];
};


Textures.loadSprite('character', 30, 60, [
    ['right_stand', 'right_stand_2', 'right_crouch', 'right_crouch_2'],
    ['left_stand', 'left_stand_2', 'left_crouch', 'left_crouch_2'],
    ['front_stand', 'front_stand_2', 'front_crouch', 'front_crouch_2'],
    ['back_stand', 'back_stand_2', 'back_crouch', 'back_crouch_2']
]);

Textures.loadSprite('ground', CELL_WIDTH, CELL_HEIGHT, [
    ['1', '2', '3']
]);

Textures.loadSprite('wall', CELL_WIDTH, 56, [
    ['1', '2', '3']
]);


Textures.loadTexture('hit-label', 28, 12);
Textures.loadTexture('blood-spray_right', 30, 20);
Textures.loadTexture('blood-spray_left', 30, 20);
Textures.loadTexture('hover', 38, 37);
Textures.loadTexture('move-highlight', CELL_WIDTH, CELL_HEIGHT, 'png');
Textures.loadTexture('active-cell', CELL_WIDTH, CELL_HEIGHT, 'png');
Textures.loadTexture('cell', CELL_WIDTH, CELL_HEIGHT, 'png');
Textures.loadTexture('steps', 11, 15);
