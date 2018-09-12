var blocks = [];
var locked = false;
var current
var xOffset = 0.0;
var yOffset = 0.0;

function setup() {
  createCanvas(900, 800);
  colorMode(HSB, 255);
  colour = [color(255, 0, 255), color(90, 150, 255), color(0, 150, 255), color(160, 150, 255)];
  blocks.push(new source(30, 20));
  blocks.push(new processor(330, 20));
  blocks.push(new sink(630, 20));
}

function draw() {
  background(80);

  for (i = 0; i < blocks.length; i++) {
    blocks[i].show();
  }
}

function mousePressed() {
  if (!locked) {
    for (i = 0; i < blocks.length; i++) {
      if (blocks[i].over) {
        blocks[i].lock();
        current = blocks[i]
        locked = true;
        break;
      }
      // }
    }
  }
  xOffset = mouseX - current.x;
  yOffset = mouseY - current.y;
}

function mouseDragged() {
  if (locked) {
    current.move(mouseX - xOffset, mouseY - yOffset);
  }
}

function mouseReleased() {
  if (locked) {
    for (i = 0; i < blocks.length; i++) {
      blocks[i].unlock();
    }
    locked = false;
    current = null;
  }
}

class block {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.rwidth = 180;
    this.rheight = 55;
    this.over = false;
    this.color
    this.locked = false;
    this.sockets = []
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    for (i = 0; i < this.sockets.length; i++) {
      this.sockets[i].move(x, y);
    }
  }

  show() {
    fill(this.color);
    if (mouseX > this.x && mouseX < this.x + this.rwidth && mouseY > this.y && mouseY < this.y + this.rheight) {
      var h = hue(this.color);
      var s = saturation(this.color);
      var b = brightness(this.color);
      strokeWeight(2);
      stroke(color(h, s - 50, b));
      current = this;
      if (this.locked == true) {
        fill(color(h, s - 50, b));
      }
      this.over = true;
    } else {
      fill(this.color);
      this.over = false;
      noStroke();
    }
    rect(this.x, this.y, this.rwidth, this.rheight, 5);
    strokeWeight(1);
  }
}

class source extends block {
  constructor(_x, _y) {
    super(_x, _y);
    this.color = colour[1];
    this.sockets.push(new socket(this.x, this.y, this.rwidth, this.rheight, 0));
  }
  
  show() {
    super.show();
    this.sockets[0].show();
  }
}

class processor extends block {
  constructor(_x, _y) {
    super(_x, _y);
    this.color = colour[2];
    this.sockets.push(new socket(this.x, this.y, this.rwidth, this.rheight, 1));
    this.sockets.push(new socket(this.x, this.y, this.rwidth, this.rheight, 0));
  }
  
  show() {
    super.show();
    this.sockets[0].show();
    this.sockets[1].show();
  }
}

class sink extends block {
  constructor(_x, _y) {
    super(_x, _y);
    this.color = colour[3];
    this.sockets.push(new socket(this.x, this.y, this.rwidth, this.rheight, 1));
  }
  
  show() {
    super.show();
    this.sockets[0].show();
  }
}

class socket {
  constructor(_x, _y, _w, _h, _t) {
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.t = _t;
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(colour[0]);
    stroke(180);
    switch (this.t) {
      case 0:
        ellipse(this.x + this.w, this.y + (this.h / 2), 20, 20);
        if (mouseX > this.x + this.w - 10 && mouseX < this.x + this.w + 10 && mouseY > this.y + (this.h / 2) - 10 && mouseY < this.y + (this.h / 2) + 10) {
          fill(color(255, 0, 100));
          ellipse(this.x + this.w, this.y + (this.h / 2), 12, 12);
        }
        break;
      case 1:
        ellipse(this.x, this.y + (this.h / 2), 20, 20);
        if (mouseX > this.x - 10 && mouseX < this.x + 10 && mouseY > this.y + (this.h / 2) - 10 && mouseY < this.y + (this.h / 2) + 10) {
          fill(color(255, 0, 100));
          ellipse(this.x, this.y + (this.h / 2), 12, 12);
        }
        break;
    }
    noStroke();
  }
}
