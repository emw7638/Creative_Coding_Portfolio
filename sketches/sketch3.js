let sketch3 = function (p) {
  const symbols = ["⬛", "◼️", "✦", "▪️", "•", "·", "."];

  let video;
  let cnv;
  let parentId = "sketch3";
  let vidw = 64;
  let vidh = 48;
  let scl = 12;
  let canvasWidth = vidw * scl;
  let canvasHeight = vidh * scl;

  // SETUP
  p.setup = function () {
    const pageContainer = document.getElementById("project3-canvas");

    if (pageContainer) {
      parentId = "project3-canvas";
      vidw = 64;
      vidh = 48;
      scl = Math.max(12, Math.floor(Math.min((window.innerWidth - 110) / vidw, (window.innerHeight - 180) / vidh)));
    } else {
      scl = 4;
    }

    canvasWidth = vidw * scl;
    canvasHeight = vidh * scl;

    cnv = p.createCanvas(canvasWidth, canvasHeight);
    cnv.parent(parentId);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(scl);
    p.textFont("monospace");

    video = p.createCapture(p.VIDEO);
    video.size(vidw, vidh);
    video.hide();
  };

  // DRAW LOOP
  p.draw = function () {
    p.background(250, 250, 248);
    video.loadPixels();

    for (let y = 0; y < video.height; y += 1) {
      for (let x = 0; x < video.width; x += 1) {
        const mirroredX = video.width - x - 1;
        const pixelIndex = (mirroredX + y * video.width) * 4;

        const r = video.pixels[pixelIndex + 0];
        const g = video.pixels[pixelIndex + 1];
        const b = video.pixels[pixelIndex + 2];
        const bright = (r + g + b) / 3;

        let sIndex = p.floor(p.map(bright, 0, 255, 0, symbols.length));
        sIndex = p.constrain(sIndex, 0, symbols.length - 1);

        const px = x * scl + scl / 2;
        const py = y * scl + scl / 2;

        if (bright < 90) {
          p.fill(80, 80, 80);
        } else if (bright < 170) {
          p.fill(160, 185, 235);
        } else {
          p.fill(220, 180, 205);
        }

        p.text(symbols[sIndex], px, py);
      }
    }
  };
};

new p5(sketch3);
