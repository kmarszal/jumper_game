var startPlatform = new Path.Rectangle({
	point: [0, view.size.height - 10],
	size: [view.size.width, 10],
	fillColor: 'black'
});

var platform = new Path.Rectangle({
	point: [10, 0],
	size: [100, 10],
	fillColor: 'black'
});

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

var text = new PointText({
	point: view.center,
	justification: 'center',
	fontSize: 30,
	fillColor: 'blue'
});

var platformDescendVector = new Point(0, -0.5);

function onFrame(event) {
	platform.position -= platformDescendVector;
	speedVector -= gravity;
	player.position += speedVector;
	
	if(player.position.x < 15 && speedVector.x < 0) {
		speedVector.x = -speedVector.x / 2;
		player.position.x = 15;
	}
	if(player.position.x > view.size.width - 10 && speedVector.x > 0) {
		speedVector.x = -speedVector.x / 2;
		player.position.x = view.size.width - 15;
	}
	if(player.position.y < 0 && speedVector.y < 0) {
		speedVector.y = -speedVector.y / 2;
		player.position.y = 0;
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
	
	if(platform.position.y > view.size.height) {
		platform.position = view.top;
	}
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
    platform.position = view.top;
}