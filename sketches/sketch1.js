let sketch1 = function (p) {
  let t = 0;
  let parentId = "sketch1";
  let container = null;
  let isProjectPage = false;

  p.setup = function () {
    container = document.getElementById("project1-canvas") || document.getElementById("sketch1");
    isProjectPage = Boolean(document.getElementById("project1-canvas"));
    parentId = isProjectPage ? "project1-canvas" : "sketch1";

    const cnv = p.createCanvas(400, 400);
    cnv.parent(parentId);
    p.pixelDensity(1);
  };

  p.draw = function () {
    p.background(0);
    p.loadPixels();

    let index = 0;

    for (let y = 0; y < p.height; y += 1) {
      for (let x = 0; x < p.width; x += 1) {
        const d = p.dist(x, y, p.mouseX, p.mouseY);
        const wave = p.sin(d * 0.05 - t);

        const r = p.map(wave, -1, 1, 80, 245);
        const g = p.map(x, 0, p.width, 115, 205);
        const b = p.map(y, 0, p.height, 160, 245);

        p.pixels[index] = r;
        p.pixels[index + 1] = g;
        p.pixels[index + 2] = b;
        p.pixels[index + 3] = 255;

        index += 4;
      }
    }

    p.updatePixels();
    t += 0.05;
  };

  p.windowResized = function () {
    if (!isProjectPage) {
      return;
    }

    p.resizeCanvas(400, 400);
  };
};

new p5(sketch1);
