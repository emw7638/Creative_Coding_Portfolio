let sketch2 = function (p) {
  let cellSize = 30;
  let spacing = 50;
  let parentId = "sketch2";
  let canvasWidth = 600;
  let canvasHeight = 600;

  // SETUP
  p.setup = function () {
    const pageContainer = document.getElementById("project2-canvas");

    if (pageContainer) {
      parentId = "project2-canvas";
      canvasWidth = 600;
      canvasHeight = 600;
    } else {
      canvasWidth = 260;
      canvasHeight = 180;
      spacing = 34;
    }

    const cnv = p.createCanvas(canvasWidth, canvasHeight);
    cnv.parent(parentId);

    p.noStroke();
    p.rectMode(p.CENTER);
    p.background(0);
  };

  // DRAW LOOP
  p.draw = function () {
    p.background(0, 10);

    if (p.mouseIsPressed) {
      cellSize = 45;
    } else {
      cellSize = 30;
    }

    const cols = p.floor(p.width / spacing);
    const rows = p.floor(p.height / spacing);

    const randomCol = p.floor(p.random(cols));
    const randomRow = p.floor(p.random(rows));

    const x = randomCol * spacing + spacing / 2;
    const y = randomRow * spacing + spacing / 2;

    const r = p.random(80, 160);
    const g = p.random(120, 220);
    const b = p.random(160, 255);

    p.fill(r, g, b);
    p.rect(x, y, cellSize, cellSize);
  };
};

new p5(sketch2);
