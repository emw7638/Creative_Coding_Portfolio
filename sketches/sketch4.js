let sketch4 = function (p) {
  let tiles = [];
  let cols = 0;
  let rows = 0;
  let tileSize = 50;
  let parentId = "sketch4";
  let isProjectPage = false;

  p.setup = function () {
    isProjectPage = Boolean(document.getElementById("project4-canvas"));
    parentId = isProjectPage ? "project4-canvas" : "sketch4";

    const size = getCanvasSize();
    const cnv = p.createCanvas(size.width, size.height);
    cnv.parent(parentId);

    buildTiles();
    p.noLoop();
  };

  p.draw = function () {
    p.background(255);

    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        const tile = tiles[i][j];
        drawTile(i * tileSize, j * tileSize, tileSize, tile.rot, tile.c1, tile.c2);
      }
    }
  };

  p.mousePressed = function () {
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
      return;
    }

    buildTiles();
    p.redraw();
  };

  p.windowResized = function () {
    if (!isProjectPage) {
      return;
    }

    const size = getCanvasSize();
    p.resizeCanvas(size.width, size.height);
    buildTiles();
    p.redraw();
  };

  function getCanvasSize() {
    if (isProjectPage) {
      return {
        width: Math.max(720, Math.floor(window.innerWidth - 80)),
        height: Math.max(520, Math.floor(window.innerHeight - 140))
      };
    }

    return {
      width: 260,
      height: 260
    };
  }

  function buildTiles() {
    tileSize = isProjectPage ? 64 : 36;
    cols = Math.ceil(p.width / tileSize);
    rows = Math.ceil(p.height / tileSize);
    tiles = [];

    for (let i = 0; i < cols; i += 1) {
      tiles[i] = [];
      for (let j = 0; j < rows; j += 1) {
        tiles[i][j] = {
          rot: p.random([0, p.HALF_PI, p.PI, p.PI + p.HALF_PI]),
          c1: p.color(p.random(50, 255), p.random(50, 255), p.random(50, 255)),
          c2: p.color(p.random(50, 255), p.random(50, 255), p.random(50, 255))
        };
      }
    }
  }

  function drawTile(x, y, size, rot, c1, c2) {
    p.push();
    p.translate(x + size / 2, y + size / 2);
    p.rotate(rot);
    p.stroke(0);
    p.strokeWeight(isProjectPage ? 3 : 2);

    p.fill(c1);
    p.arc(-size / 2, -size / 2, size, size, 0, p.HALF_PI);
    p.fill(c2);
    p.arc(size / 2, size / 2, size, size, p.PI, p.PI + p.HALF_PI);

    p.pop();
  }
};

new p5(sketch4);
