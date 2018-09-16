// Web browser kak
document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);

// P5
var blocks = [];
var connections = []
var blocklocked = false;
var socketlocked = false;
var current;
var xOffset = 0.0;
var yOffset = 0.0;
var connect;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  colour = [color(255, 0, 255), color(90, 150, 255), color(0, 150, 255), color(160, 150, 255)];
  var rows = 1
	for (i = 1; i <= 1; i++) {
	blocks.push(new source(30, (i*5)*20));
  blocks.push(new processor(330, (i*5)*20));
  blocks.push(new sink(630, (i*5)*20) );
	}
}

function draw() {
  if (!socketlocked){
    render()
  }
}

function render() {
    background(color(227, 31, 12));
  	// for (i = 0; i < connections.length; i++) {
   //  	connections[i].show();
   //  }

    for (i = 0; i < blocks.length; i++) {
      blocks[i].show();
    }
}

// Mouse stuff
function mousePressed() {
  try{	// stop error
	  switch (mouseButton){
	  	case LEFT:
	  	  // if(current !== undefined){	//stop throwing error
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
			// }
		  break;
		  case RIGHT:
	    	  // if(current !== undefined){	//stop throwing error
				  if (!blocklocked) {
				    for (i = 0; i < blocks.length; i++) {
				      if (blocks[i].over) {
				      	// Remove connector then block
				      	// find connection correct connection to block

				      	blocks.splice(i, 1 );
                // blocks[i].remove()

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
				// }
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
            // current.recordConnection(connection)
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
			console.log('here')
		break;
		case '2':
		// Make processor
			blocks.push(new processor(mouseX, mouseY));
		break;
		case '3':
		// make sink
			blocks.push(new sink(mouseX, mouseY)); 
		break;
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
    this.sockets = [];
  }

  lock() {
    this.locked = true;
		console.log('Block locked')
  }

  unlock() {
    this.locked = false;
		console.log('Block unlocked')
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
	  this.over = false;
	  this.locked = false;
    // record connections
    this.connections = [];
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
		console.log('Socket locked')
  }

  unlock() {
    this.locked = false;
		console.log('Socket unlocked')
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
