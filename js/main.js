/**
 * @fileoverview This file contains the Umbane Javascript components and classes.
 * @package
 */

// Web browser kak
document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);

words = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"];

// Global
var blocks = [];
var connections = []
var blocklocked = false;
var socketlocked = false;
var current;
var xOffset = 0.0;
var yOffset = 0.0;
var connect;
var count = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  colour = [color(255, 0, 255), color(90, 150, 255), color(0, 150, 255), color(160, 150, 255)];
}

function draw() {
  if (!socketlocked){
    render()
  }
}

function render() {
    background(color(227, 31, 12));
    for (i = 0; i < blocks.length; i++) {
      blocks[i].show();
    }
}

// Mouse stuff
function mousePressed() {
  try{	// stop error
	  switch (mouseButton){
	  	case LEFT:
		  	  if (!blocklocked) {
			    for (i = 0; i < blocks.length; i++) {
			      if (blocks[i].over) {
			        blocks[i].lock();
			        current = blocks[i]
			        blocklocked = true;
			        break;
			      }
			    }
			  }
				if (!socketlocked) {
			    for (i = 0; i < blocks.length; i++) {
						for (j = 0; j < blocks[i].sockets.length; j++) {
							if (blocks[i].sockets[j].over) {
								blocks[i].sockets[j].lock();
								current = blocks[i].sockets[j]
								socketlocked = true;
								break;
							}
						}
			    }
			  }
			  xOffset = mouseX - current.x;
			  yOffset = mouseY - current.y;
		  break;
		  case RIGHT:
				  if (!blocklocked) {
				    for (i = 0; i < blocks.length; i++) {
				      if (blocks[i].over) {
                //blocks[i].remove();
                blocks.splice(i, 1);
                //delete blocks[i];
				        break;
				      }
				    }
				  }
					if (!socketlocked) {
				    for (i = 0; i < blocks.length; i++) {
							for (j = 0; j < blocks[i].sockets.length; j++) {
								if (blocks[i].sockets[j].over) {
									blocks[i].sockets[j].lock();
									current = blocks[i].sockets[j]
									socketlocked = true;
									break;
								}
							}
				    }
				  }
				  xOffset = mouseX - current.x;
				  yOffset = mouseY - current.y;
			  break;
	  }
	} catch (e){

	}
}

function mouseDragged() {
  if (blocklocked) {
    current.move(mouseX - xOffset, mouseY - yOffset);
  }
  if (socketlocked) {
    render();
    noFill();
    stroke(colour[0]);
	 	strokeWeight(1);
		bezier(current.x + current.w, current.y + (current.h / 2), mouseX-(20), current.y + (current.h / 2), current.x + current.w +(20), mouseY, mouseX, mouseY);
  }
}

function mouseReleased() {
  if (socketlocked) {
    for (i = 0; i < blocks.length; i++) {
			for (j = 0; j < blocks[i].sockets.length; j++) {
        	if(blocks[i].sockets[j].over){
            var connection = new connector(current, blocks[i].sockets[j]);
	    		  // connections.push(connection);
            // current.recordConnection(connections.length)
            // blocks[i].sockets[j].recordConnection(connections.length)
            current.recordConnection(connection)
            blocks[i].sockets[j].recordConnection(connection)
         	}
				blocks[i].sockets[j].unlock();
		}
	}
    current = null;
  }
  if (blocklocked) {
    for (i = 0; i < blocks.length; i++) {
      blocks[i].unlock();
    }
    current = null;
  }

  // console.log(connections)
  blocklocked = false;
  socketlocked = false;
}

// Keyboard stuff
function keyPressed(){
	switch (key){
		case '1':
		// Make source
			blocks.push(new source(mouseX, mouseY));
		break;
		case '2':
		// Make processor
			blocks.push(new processor(mouseX, mouseY));
		break;
		case '3':
		// make sink
			blocks.push(new sink(mouseX, mouseY));
    break;

    // DEBUG STUFF
    // List connection for block
    case 'l':
      for (i = 0; i < blocks.length; i++) {
        if (blocks[i].over) {
          console.log(blocks[i].label + ' block');
          var blockCons = blocks[i].getConnections()
          for (j = 0; j < blockCons.length; j++) {
            console.log(blockCons[j][0]+ ' -> ' +blockCons[j][1])
          }
        }
      }
    break;
    case 'c':
    for (i = 0; i < connections.length; i++) {
      if (blocks[i].over) {
        console.log(blocks[i].label);
        console.log("|")
        for (j = 0; j < blocks[i].sockets.length; j++) {
          //console.log(blocks[i].sockets[j].connections)
          for (k = 0; k < blocks[i].sockets[j].connections.length; k++) {
            console.log(blocks[i].sockets[j].connections[k].input.block.label+'->'+blocks[i].sockets[j].connections[k].output.block.label);
          }
        }
      }
    }
  break;
  }
}

// Object classes
class block {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.rwidth = 180;
    this.rheight = 55;
    this.over = false;
    this.color
    this.locked = false;
    this.sockets = [];
    this.label = words[count];
    count ++;
  }

  remove(){
    for (i = 0; i < this.sockets.length; i++) {
      for (k = 0; k < blocks[i].sockets[j].connections.length; k++) {
        delete blocks[i].sockets[j].connections[k];
        //console.log(blocks[i].sockets[j].connections[k].input.block.label+'->'+blocks[i].sockets[j].connections[k].output.block.label)
      }
    }
  }

  getConnections(){
    var c = [];
    for (j = 0; j < this.sockets.length; j++) {
      for (var l = 0; l < this.sockets[j].connections.length; l++) {
        c.push([this.sockets[j].connections[l].input.block.label, this.sockets[j].connections[l].output.block.label]);
      }
    }
    return c;
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
    if (mouseX > this.x + 10 && mouseX < this.x + this.rwidth - 10 && mouseY > this.y && mouseY < this.y + this.rheight) {
      var h = hue(this.color);
      var s = saturation(this.color);
      var b = brightness(this.color);
      strokeWeight(2);
      stroke(color(h, s - 50, b));
      if (this.locked == true) {
        current = this;
        fill(color(h, s - 50, b));
      }
      this.over = true;
    } else {
      fill(this.color);
      this.over = false;
      noStroke();
    }
    rect(this.x, this.y, this.rwidth, this.rheight, 5);
    textSize(18);
    textAlign(CENTER);
    fill(color(0, 0, 60));
    text(this.label, this.x + (this.rwidth/2), this.y+ (this.rheight/2) +5);
    strokeWeight(1);
  }
}

class source extends block {
  constructor(_x, _y) {
    super(_x, _y);
    this.color = colour[1];
    this.sockets.push(new socket(this.x, this.y, this.rwidth, this.rheight, 0, this));
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
    this.sockets.push(new socket(this.x, this.y, this.rwidth, this.rheight, 1, this));
    this.sockets.push(new socket(this.x, this.y, this.rwidth, this.rheight, 0, this));
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
    this.sockets.push(new socket(this.x, this.y, this.rwidth, this.rheight, 1, this));
  }

  show() {
    super.show();
    this.sockets[0].show();
  }
}

class socket {
  constructor(_x, _y, _w, _h, _t, _b) {
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.t = _t;
	  this.over = false;
	  this.locked = false;
    // record connections
    this.connections = [];
    this.block = _b;
  }

  recordConnection(connector){
    // Draw connection
    // console.log(idx_connector)
    this.connections.push(connector)
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }

  show() {
    fill(colour[0]);
    stroke(180);
    switch (this.t) {
      case 0:
        ellipse(this.x + this.w, this.y + (this.h / 2), 20, 20);
        if (mouseX > this.x + this.w - 10 && mouseX < this.x + this.w + 10 && mouseY > this.y + (this.h / 2) - 10 && mouseY < this.y + (this.h / 2) + 10) {
          this.over = true;
					fill(color(255, 0, 100));
          ellipse(this.x + this.w, this.y + (this.h / 2), 12, 12);
        }
				else
				{
					this.over = false;
				}
        break;
      case 1:
        ellipse(this.x, this.y + (this.h / 2), 20, 20);
        if (mouseX > this.x - 10 && mouseX < this.x + 10 && mouseY > this.y + (this.h / 2) - 10 && mouseY < this.y + (this.h / 2) + 10) {
          this.over = true;
					fill(color(255, 0, 100));
          ellipse(this.x, this.y + (this.h / 2), 12, 12);
        }
				else
				{
					this.over = false;
				}
        break;

    }
    noStroke();
    // Show connections to this socket
    this.connections.map(c => c.show());
  }
}

class connector {
	constructor(_i, _o,inBlock,outBlock){
		this.input = _i;
		this.output = _o;
		this.inputTo = inBlock;
		this.outputTo = outBlock;
    this.over = false;
	}

	show() {
		var p1x = this.input.x + this.input.w;
		var p1y = this.input.y + (this.input.h / 2);
		var p2x = this.output.x;
		var p2y = this.output.y + (this.output.h / 2);
		noFill();
		stroke(colour[0]);
	 	strokeWeight(1);
		bezier(p1x, p1y, p2x-(20), p1y, p1x+(20), p2y, p2x, p2y);
	}

	over(){

	}
}
