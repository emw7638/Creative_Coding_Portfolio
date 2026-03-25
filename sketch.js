let welcomeX, welcomeY;
let vX = 1.5;
let vY = 1;
let welcomeWidth = 300;
let welcomeHeight = 150;

function setup() {
  let cnv = createCanvas(0, 0); 
  cnv.parent(document.body);
  frameRate(60);

  let welcome = document.getElementById("welcome");
  welcomeX = welcome.offsetLeft;
  welcomeY = welcome.offsetTop;
}

function draw() {
  let welcome = document.getElementById("welcome");
  if (!welcome) return;
  
  welcomeX += vX;
  welcomeY += vY;

  let maxX = window.innerWidth - welcomeWidth;
  let maxY = window.innerHeight - welcomeHeight;

  if (welcomeX < 0 || welcomeX > maxX) vX *= -1;
  if (welcomeY < 0 || welcomeY > maxY) vY *= -1;

  welcome.style.left = welcomeX + "px";
  welcome.style.top = welcomeY + "px";
}
