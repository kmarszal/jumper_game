var startPlatform = new Path.Rectangle({
	point: [0, view.size.height - 10],
	size: [view.size.width, 10],
	fillColor: 'black'
});

var platform1 = new Path.Rectangle({
	point: [800, 600],
	size: [400, 200],
	fillColor: 'black'
});

var currentHeight = 0;
var generatedAt = 0;
/*
var platform2 = new Path.Rectangle({
	point: [50, 0],
	size: [100, 10],
	fillColor: 'black'
});
*/

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function checkCollision(platform) {
	//left wall
	if(player.position.x < platform.position.x - platform.bounds.width/2 + 10 &&
	player.position.x > platform.position.x - platform.bounds.width/2 && 
	player.position.y > platform.position.y - platform.bounds.height/2 - 5 && 
	player.position.y < platform.position.y + platform.bounds.height/2 && 
	speedVector.x > 0) {
		
		speedVector.x = -speedVector.x / 2;
		player.position.x = platform.position.x - platform.bounds.width/2;
	}
	//right wall
	if(player.position.x > platform.position.x + platform.bounds.width/2 - 10 &&
	player.position.x < platform.position.x + platform.bounds.width/2 &&
	player.position.y > platform.position.y - platform.bounds.height/2 - 5 && 
	player.position.y < platform.position.y + platform.bounds.height/2 && 
	speedVector.x < 0) {
	
		speedVector.x = -speedVector.x / 2;
		player.position.x = platform.position.x + platform.bounds.width/2;
	}
	//ceiling
	if(player.position.y < platform.position.y + platform.bounds.height/2 + 10 &&
	player.position.y > platform.position.y + platform.bounds.height/2 && 
	player.position.x < platform.position.x + platform.bounds.width/2 && 
	player.position.x > platform.position.x - platform.bounds.width/2 &&
	speedVector.y < 0) {
	
		speedVector.y = -speedVector.y / 2;
		player.position.y = platform.position.y + platform.bounds.height/2;
	}
	//floor
	if(player.position.y < platform.position.y - platform.bounds.height/2 + 5 &&
	player.position.y > platform.position.y - platform.bounds.height/2 - 5 &&
	player.position.x < platform.position.x + platform.bounds.width/2 && 
	player.position.x > platform.position.x - platform.bounds.width/2 && 
	speedVector.y > 0) {
		
		if(Math.sqrt(Math.pow(speedVector.x, 2) + Math.pow(speedVector.y, 2)) < 2.5) {
			speedVector = new Point(0, 0);
			if(speedArrow) {
				speedArrow.strokeColor = 'green';
			}
		}
		speedVector.y = -speedVector.y / 2;
		
		if(speedVector.x > 0) {
			speedVector += friction;
		} 
		if(speedVector.x < 0) {
			speedVector -= friction;
		}
		player.position.y = platform.position.y - platform.bounds.height / 2 - 5;
	}
}

var leftBorder = new Path.Rectangle({
	point: [0, 0],
	size: [10, view.size.height],
	fillColor: 'black'
});

var rightBorder = new Path.Rectangle({
	point: [view.size.width - 10, 0],
	size: [10, view.size.height],
	fillColor: 'black'
});

var player = new Path();
player.add(new Point(view.size.width / 2, view.size.height - 20));
player.add(new Point(view.size.width / 2 + 5, view.size.height - 10));
player.add(new Point(view.size.width / 2 - 5, view.size.height - 10));
player.closed = true;
player.fillColor = 'black';

var speedVector = new Point(0, 0);
var speedArrow;
var gravity = new Point(0, -0.1);
var friction = new Point(-0.1, 0);

var text1 = new PointText({
	point: view.center - new Point(200, 30),
	justification: 'center',
	fontSize: 30,
	fillColor: 'blue'
});

var text2 = new PointText({
	point: view.center - new Point(200, -30),
	justification: 'center',
	fontSize: 30,
	fillColor: 'blue'
});

var platformDescendVector = new Point(0, -0.5);

var platforms = new Array();
function generatePlatform() {
	platforms.push(new Path.Rectangle({
		point: [getRndInteger(0, view.size.width), 0],
		size: [getRndInteger(view.size.width/20, view.size.width/3), getRndInteger(5, 20)],
		fillColor: 'black'
	}));
}

function onFrame(event) {
	//platform2.position -= platformDescendVector;
	speedVector -= gravity;
	player.position += speedVector;
	
	if(player.position.x < 15 && speedVector.x < 0) {
		speedVector.x = -speedVector.x / 2;
		player.position.x = 15;
	}
	if(player.position.x > view.size.width - 15 && speedVector.x > 0) {
		speedVector.x = -speedVector.x / 2;
		player.position.x = view.size.width - 15;
	}
	if(player.position.y < 0 && speedVector.y < 0) {
		platform1.position.y -= player.position.y;
		platforms.forEach( function(platform) {
			platform.position.y -= player.position.y;
		});
		currentHeight -= player.position.y;
		player.position.y -= player.position.y;
	}
	if(player.position.y > view.size.height - 15 && speedVector.y > 0) {
		if(Math.sqrt(Math.pow(speedVector.x, 2) + Math.pow(speedVector.y, 2)) < 2.5) {
			speedVector = new Point(0, 0);
			if(speedArrow) {
				speedArrow.strokeColor = 'green';
			}
		}
		speedVector.y = -speedVector.y / 2;
		
		if(speedVector.x > 0) {
			speedVector += friction;
		} 
		if(speedVector.x < 0) {
			speedVector -= friction;
		}
		player.position.y = view.size.height - 15;
	}
	
	if(currentHeight > 0 && currentHeight - generatedAt > 200) {
		generatedAt = currentHeight;
		generatePlatform();
		text1.content = platforms.length;
	}
	
	checkCollision(platform1);
	
	platforms = platforms.slice(-10);
	
	platforms.forEach( function(platform) {
		checkCollision(platform);
	});
	
	text2.content = currentHeight;
	
	//checkCollision(platform2);
	/*if(platform2.position.y > view.size.height) {
		platform2.position.y = 0;
	}*/
}

function onMouseDown(event) {
	speedArrow = new Path();
	speedArrow.strokeWidth = 3;
	if (speedVector.x == 0 && speedVector.y == 0) {
		speedArrow.strokeColor = 'green';
	} else {
		speedArrow.strokeColor = 'red';
	}
	speedArrow.add(event.point);
}

function onMouseDrag(event) {
	speedArrow.removeSegment(1);
	speedArrow.add(event.point);
}

function onMouseUp(event) {
	if (speedVector.x == 0 && speedVector.y == 0) {
		speedVector = speedArrow.lastSegment.point - speedArrow.firstSegment.point;
		speedVector /= 10;
	}
	speedArrow.remove();
}

function onResize() {
    leftBorder = new Path.Rectangle({
		point: [0, 0],
		size: [10, view.size.height],
		fillColor: 'black'
	});

	rightBorder = new Path.Rectangle({
		point: [view.size.width - 10, 0],
		size: [10, view.size.height],
		fillColor: 'black'
	});

	startPlatform = new Path.Rectangle({
		point: [0, view.size.height - 10],
		size: [view.size.width, 10],
		fillColor: 'black'
	}); 
}