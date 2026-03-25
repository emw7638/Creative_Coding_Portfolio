let sketch1 = function (p) {
  const nodes = [];
  const pulses = [];
  const labels = [
    "design.sys",
    "pixel_note.txt",
    "mesh.exe",
    "dream.log",
    "pink_wave.ai",
    "blueprint.psd",
    "orbit.tmp",
    "grid.mail"
  ];

  let parentId = "sketch1";
  let container = null;
  let isLargeMode = false;
  let hoveredNode = null;
  let introPhase = 0;

  p.setup = function () {
    container = document.getElementById("project1-canvas") || document.getElementById("sketch1");
    isLargeMode = Boolean(document.getElementById("project1-canvas"));
    parentId = isLargeMode ? "project1-canvas" : "sketch1";

    const size = getCanvasSize();
    const cnv = p.createCanvas(size.width, size.height);
    cnv.parent(parentId);

    p.rectMode(p.CENTER);
    p.noStroke();

    buildScene();
  };

  p.draw = function () {
    introPhase += 0.01;
    hoveredNode = null;

    drawBackdrop();
    updateNodes();
    drawConnections();
    drawNodes();
    updatePulses();
    drawHud();
  };

  p.mousePressed = function () {
    if (!pointerInsideCanvas()) {
      return;
    }

    pulses.push({
      x: p.mouseX,
      y: p.mouseY,
      radius: 16,
      alpha: 190
    });

    if (hoveredNode) {
      hoveredNode.flash = 1;
      hoveredNode.vx += p.random(-1.6, 1.6);
      hoveredNode.vy += p.random(-1.6, 1.6);
    }
  };

  p.windowResized = function () {
    if (!container) {
      return;
    }

    const size = getCanvasSize();
    p.resizeCanvas(size.width, size.height);
    repositionNodes();
  };

  function getCanvasSize() {
    if (container) {
      const width = Math.max(220, container.clientWidth || 0);
      const height = isLargeMode
        ? Math.max(320, container.clientHeight || Math.floor(window.innerHeight * 0.62))
        : Math.max(180, container.clientHeight || 180);

      return { width, height };
    }

    return { width: 280, height: 180 };
  }

  function buildScene() {
    nodes.length = 0;
    pulses.length = 0;

    const totalNodes = isLargeMode ? 9 : 5;

    for (let i = 0; i < totalNodes; i += 1) {
      const w = isLargeMode ? p.random(88, 126) : p.random(52, 72);
      const h = isLargeMode ? p.random(54, 74) : p.random(32, 42);

      nodes.push({
        x: p.random(w * 0.6, p.width - w * 0.6),
        y: p.random(h * 0.8, p.height - h * 0.8),
        vx: p.random(-0.8, 0.8),
        vy: p.random(-0.6, 0.6),
        w,
        h,
        colorMix: p.random(),
        phase: p.random(p.TWO_PI),
        label: labels[i % labels.length],
        flash: 0
      });
    }
  }

  function repositionNodes() {
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      node.x = p.constrain(node.x, node.w * 0.55, p.width - node.w * 0.55);
      node.y = p.constrain(node.y, node.h * 0.75, p.height - node.h * 0.75);
    }
  }

  function drawBackdrop() {
    p.background(247, 246, 248);

    for (let y = 0; y < p.height; y += 18) {
      const alpha = y % 36 === 0 ? 18 : 8;
      p.fill(180, 184, 194, alpha);
      p.rect(p.width / 2, y, p.width, 1);
    }

    const leftGlow = 140 + 30 * p.sin(introPhase);
    const rightGlow = 150 + 25 * p.cos(introPhase * 0.9);

    drawGlow(p.width * 0.23, p.height * 0.28, leftGlow, p.color(187, 214, 255, 70));
    drawGlow(p.width * 0.76, p.height * 0.68, rightGlow, p.color(245, 198, 223, 78));
    drawGlow(p.width * 0.5, p.height * 0.45, 120, p.color(255, 255, 255, 85));

    if (pointerInsideCanvas()) {
      drawGlow(p.mouseX, p.mouseY, isLargeMode ? 130 : 72, p.color(189, 211, 255, 60));
    }
  }

  function drawGlow(x, y, size, glowColor) {
    for (let i = 4; i >= 1; i -= 1) {
      const scale = i / 4;
      const c = p.color(glowColor);
      c.setAlpha(16 * scale);
      p.fill(c);
      p.circle(x, y, size * scale);
    }
  }

  function updateNodes() {
    const interactionRadius = isLargeMode ? 190 : 95;
    const pushStrength = isLargeMode ? 0.2 : 0.12;

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const drift = p.sin(introPhase + node.phase) * 0.12;

      node.vx += drift * 0.03;
      node.vy += p.cos(introPhase * 1.1 + node.phase) * 0.02;

      if (pointerInsideCanvas()) {
        const dx = p.mouseX - node.x;
        const dy = p.mouseY - node.y;
        const distance = Math.max(1, Math.hypot(dx, dy));

        if (distance < interactionRadius) {
          const direction = p.mouseIsPressed ? -1 : 1;
          const force = (1 - distance / interactionRadius) * pushStrength * direction;
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }

        if (distance < Math.max(node.w, node.h) * 0.65) {
          hoveredNode = node;
        }
      }

      node.x += node.vx;
      node.y += node.vy;
      node.vx *= 0.985;
      node.vy *= 0.985;

      const xMin = node.w * 0.55;
      const xMax = p.width - node.w * 0.55;
      const yMin = node.h * 0.75;
      const yMax = p.height - node.h * 0.75;

      if (node.x < xMin || node.x > xMax) {
        node.vx *= -0.95;
        node.x = p.constrain(node.x, xMin, xMax);
      }

      if (node.y < yMin || node.y > yMax) {
        node.vy *= -0.95;
        node.y = p.constrain(node.y, yMin, yMax);
      }

      node.flash *= 0.94;
    }
  }

  function drawConnections() {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const distance = p.dist(a.x, a.y, b.x, b.y);
        const limit = isLargeMode ? 240 : 120;

        if (distance > limit) {
          continue;
        }

        const alpha = p.map(distance, 0, limit, 90, 8);
        p.strokeWeight(distance < limit * 0.45 ? 1.6 : 1);
        p.stroke(151, 170, 206, alpha);
        p.line(a.x, a.y, b.x, b.y);
      }
    }

    if (pointerInsideCanvas()) {
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        const distance = p.dist(p.mouseX, p.mouseY, node.x, node.y);

        if (distance > (isLargeMode ? 170 : 90)) {
          continue;
        }

        p.stroke(210, 168, 191, 70);
        p.strokeWeight(1);
        p.line(p.mouseX, p.mouseY, node.x, node.y);
      }
    }

    p.noStroke();
  }

  function drawNodes() {
    p.textAlign(p.LEFT, p.CENTER);
    p.textFont("Silkscreen");

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const lift = p.sin(introPhase * 1.5 + node.phase) * 3;
      const px = node.x;
      const py = node.y + lift;
      const shell = p.lerpColor(
        p.color(251, 251, 252),
        p.color(233, 240, 255),
        node.colorMix
      );
      const shellPink = p.lerpColor(shell, p.color(246, 215, 231), 0.35);

      p.fill(0, 0, 0, 20);
      p.rect(px + 4, py + 4, node.w, node.h, 0);

      p.fill(node === hoveredNode ? shellPink : shell);
      p.stroke(105, 105, 105);
      p.strokeWeight(2);
      p.rect(px, py, node.w, node.h, 0);

      p.fill(214, 214, 214);
      p.rect(px, py - node.h * 0.32, node.w, node.h * 0.22, 0);

      p.noStroke();
      p.fill(110, 110, 116);

      const textSize = isLargeMode ? 9 : 6;
      p.textSize(textSize);
      p.text(node.label, px - node.w * 0.4, py - node.h * 0.32);

      const iconSize = isLargeMode ? 14 : 9;
      p.fill(181, 208, 255);
      p.rect(px - node.w * 0.22, py + node.h * 0.03, iconSize, iconSize, 0);
      p.fill(244, 200, 222);
      p.rect(px - node.w * 0.06, py + node.h * 0.03, iconSize, iconSize, 0);
      p.fill(222, 222, 227);
      p.rect(px + node.w * 0.1, py + node.h * 0.03, iconSize, iconSize, 0);

      if (node.flash > 0.02) {
        p.noFill();
        p.stroke(245, 198, 223, 160 * node.flash);
        p.strokeWeight(2);
        p.rect(px, py, node.w + 10 * node.flash, node.h + 10 * node.flash, 0);
      }

      p.noStroke();
    }
  }

  function updatePulses() {
    for (let i = pulses.length - 1; i >= 0; i -= 1) {
      const pulse = pulses[i];

      p.noFill();
      p.stroke(242, 186, 214, pulse.alpha);
      p.strokeWeight(2);
      p.circle(pulse.x, pulse.y, pulse.radius);

      p.stroke(181, 208, 255, pulse.alpha * 0.7);
      p.circle(pulse.x, pulse.y, pulse.radius * 1.45);

      pulse.radius += isLargeMode ? 4.5 : 3;
      pulse.alpha -= 5;

      if (pulse.alpha <= 0) {
        pulses.splice(i, 1);
      }
    }

    p.noStroke();
  }

  function drawHud() {
    const label = hoveredNode ? hoveredNode.label : "desktop constellations";
    const instruction = p.mouseIsPressed ? "hold to scatter" : "move to attract  click to ping";

    p.fill(255, 255, 255, isLargeMode ? 220 : 200);
    p.stroke(118, 118, 124, 120);
    p.strokeWeight(1.5);

    const hudWidth = isLargeMode ? 240 : 138;
    const hudHeight = isLargeMode ? 44 : 32;
    p.rect(p.width - hudWidth * 0.55 - 14, hudHeight * 0.55 + 14, hudWidth, hudHeight, 0);

    p.noStroke();
    p.fill(80, 82, 88);
    p.textAlign(p.LEFT, p.CENTER);
    p.textFont("Silkscreen");
    p.textSize(isLargeMode ? 10 : 6);
    p.text(label, p.width - hudWidth + 12, isLargeMode ? 26 : 22);

    p.fill(118, 122, 132);
    p.textSize(isLargeMode ? 8 : 5.5);
    p.text(instruction, p.width - hudWidth + 12, isLargeMode ? 40 : 31);
  }

  function pointerInsideCanvas() {
    return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
  }
};

new p5(sketch1);
