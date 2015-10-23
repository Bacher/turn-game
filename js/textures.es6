
const Textures = {
    _hash: {}
};

Textures.loadTexture = function(name) {
    const texture = Textures._hash[name] = new Image();

    texture.src = `textures/${name}.gif`;
};

Textures.get = function(name) {
    return Textures._hash[name];
};


Textures.loadTexture('character_front');
Textures.loadTexture('character_back');
Textures.loadTexture('character_left');
Textures.loadTexture('character_right');
