
const TETRIS_WIDTH = 10;
const TETRIS_HEIGHT = 18;
const TETRIS_SIZE = 32;

function renderBackground(color) {
    let elem = document.createElement("div");
    elem.style.position = "absolute";
    elem.style.width = TETRIS_SIZE * TETRIS_WIDTH + "px";
    elem.style.height = TETRIS_SIZE * TETRIS_HEIGHT + "px";
    elem.style.backgroundColor = color;
    elem.style.zIndex = "-1";
    document.body.appendChild(elem);
}

function generateTetrimino(color) {
    let tetrimino = {};
    let elem = document.createElement("div");
    elem.style.position = "absolute";
    elem.style.width = TETRIS_SIZE + "px";
    elem.style.height = TETRIS_SIZE + "px";
    elem.style.backgroundColor = color;
    tetrimino.elem = elem;
    return tetrimino;
}

function generateBarTetriminos(color) {
    let tetriminos = [];
    let tetrimino1 = generateTetrimino(color);
    tetrimino1.x = 0;
    tetrimino1.y = 0;
    let tetrimino2 = generateTetrimino(color);
    tetrimino2.x = 1;
    tetrimino2.y = 0;
    // let tetrimino3 = generateTetrimino(color);
    // tetrimino3.x = 2;
    // tetrimino3.y = 0;
    // let tetrimino4 = generateTetrimino(color);
    // tetrimino4.x = 3;
    // tetrimino4.y = 0;
    tetriminos.push([]);
    tetriminos[0].push(tetrimino1);
    tetriminos[0].push(tetrimino2);
    // tetriminos[0].push(tetrimino3);
    // tetriminos[0].push(tetrimino4);
    return tetriminos;
}

function initTetrisState() {
    let tetrisState = {};
    tetrisState.actives = null;
    tetrisState.data = new Array(TETRIS_HEIGHT);
    for (var i = 0; i < TETRIS_HEIGHT; i++) {
        tetrisState.data[i] = new Array(TETRIS_WIDTH);
        for (var j = 0; j < TETRIS_WIDTH; j++) {
            tetrisState.data[i][j] = null;
        }
    }
    return tetrisState;
}

function canFallTetriminos(tetrisState) {
    if (tetrisState.actives === null) {
        return false;
    }
    for (var i = 0; i < tetrisState.actives.length; i++) {
        for (var j = 0; j < tetrisState.actives[i].length; j++) {
            let x = tetrisState.actives[i][j].x;
            let y = tetrisState.actives[i][j].y;
            if (y+1 >= TETRIS_HEIGHT) {
                return false;
            } else if (tetrisState.data[y+1][x] !== null) {
                return false;
            }
        }
    }
    return true;
}

function moveTetriminos(tetrisState) {
    for (var i = 0; i < tetrisState.actives.length; i++) {
        for (var j = 0; j < tetrisState.actives[i].length; j++) {
            tetrisState.actives[i][j].y += 1;
        }
    }
}

function tetrisActiveToStatic(tetrisState) {
    if (tetrisState.actives === null) {
        return;
    }
    for (var i = 0; i < tetrisState.actives.length; i++) {
        for (var j = 0; j < tetrisState.actives[i].length; j++) {
            let x = tetrisState.actives[i][j].x;
            let y = tetrisState.actives[i][j].y;
            tetrisState.data[y][x] = tetrisState.actives[i][j];
        }
    }
    tetrisState.actives = null;
}

function destroyTetriminos(tetrisState) {
    for (var i = TETRIS_HEIGHT-1; i >= 0; i--) {
        let canDestroy = true;
        for (var j = TETRIS_WIDTH-1; j >= 0; j--) {
            if (tetrisState.data[i][j] === null) {
                canDestroy = false;
                break;
            }
        }
        if (canDestroy) {
            for (var y = i; y >= 1; y--) {
                tetrisState.data[y] = tetrisState.data[y-1];
            }
            tetrisState.data[0] = new Array(TETRIS_WIDTH);
            for (var j = 0; j < TETRIS_WIDTH; j++) {
                tetrisState.data[0][j] = null;
            }
            i += 1;
        }
    }
}

function processTetrisState(tetrisState) {
    if (canFallTetriminos(tetrisState)) {
        moveTetriminos(tetrisState);
    } else {
        tetrisActiveToStatic(tetrisState);
        tetrisState.actives = generateBarTetriminos("#ADD8E6");
        destroyTetriminos(tetrisState);
    }
}

function renderTetrisState(tetrisState, tetrisElem) {
    tetrisElem.innerHTML = "";

    // render actives
    if (tetrisState.actives !== null) {
        for (var i = 0; i < tetrisState.actives.length; i++) {
            for (var j = 0; j < tetrisState.actives[i].length; j++) {
                tetrisState.actives[i][j].elem.style.top = TETRIS_SIZE * tetrisState.actives[i][j].y + "px";
                tetrisState.actives[i][j].elem.style.left = TETRIS_SIZE * tetrisState.actives[i][j].x + "px";
                tetrisElem.appendChild(tetrisState.actives[i][j].elem);
            }
        }
    }

    // render statics
    for (var i = 0; i < TETRIS_HEIGHT; i++) {
        for (var j = 0; j < TETRIS_WIDTH; j++) {
            if (tetrisState.data[i][j] !== null) {
                tetrisState.data[i][j].elem.style.top = TETRIS_SIZE * i + "px";
                tetrisState.data[i][j].elem.style.left = TETRIS_SIZE * j + "px";
                tetrisElem.appendChild(tetrisState.data[i][j].elem);
            }
        }
    }
}

function tetrisUpdateLoop(tetrisState, tetrisElem) {
    processTetrisState(tetrisState);
    setTimeout(() => {
        tetrisUpdateLoop(tetrisState, tetrisElem);
    }, 100);
}
function tetrisRenderLoop(tetrisState, tetrisElem) {
    renderTetrisState(tetrisState, tetrisElem);
    setTimeout(() => {
        tetrisRenderLoop(tetrisState, tetrisElem);
    }, 50);
}

function moveRight(tetrisState) {
    for (var i = 0; i < tetrisState.actives.length; i++) {
        for (var j = 0; j < tetrisState.actives[i].length; j++) {
            tetrisState.actives[i][j].x += 1;
        }
    }
}
function moveLeft(tetrisState) {
    for (var i = 0; i < tetrisState.actives.length; i++) {
        for (var j = 0; j < tetrisState.actives[i].length; j++) {
            tetrisState.actives[i][j].x -= 1;
        }
    }
}

const RIGHT_KEY = 39
const LEFT_KEY = 37

document.addEventListener("DOMContentLoaded", () => {
    let tetrisElem = document.getElementById("tetris");
    let tetrisState = initTetrisState();
    renderBackground("#8FBC8F");
    tetrisState.actives = generateBarTetriminos("#ADD8E6");
    renderTetrisState(tetrisState, tetrisElem);
    tetrisUpdateLoop(tetrisState);
    tetrisRenderLoop(tetrisState, tetrisElem);
    window.addEventListener("keyup", (e) => {
        if (e.keyCode == RIGHT_KEY) {
            moveRight(tetrisState);
        } else if (e.keyCode == LEFT_KEY) {
            moveLeft(tetrisState);
        }
    });
});
