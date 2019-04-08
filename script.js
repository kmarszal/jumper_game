var currentHeight = 0;
var generatedAt = 0;
var starGeneratedAt = 0;
var gameOver = false;
var gameOverBlock;
var stop = false;

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
	if(player.position.y < platform.position.y + platform.bounds.height/2 &&
	player.position.y > platform.position.y + platform.bounds.height/2 - 10 && 
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
			jumpsMidAir = 0;
			if(speedArrow) {
				speedArrow.strokeColor = 'violet';
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

function beginGameOverAnimation() {
	descendVector = new Point(0, -10);
	gameOver = true;
	gameOverBlock = new Path.Rectangle({
		point: [0, -view.size.height],
		size: [view.size.width, view.size.height + 20],
		fillColor: 'black'
	});
}

var star;
function generateStar() {
	star = new Path.Star(new Point(getRndInteger(20, view.size.width - 20), -20), 5, 40, 10);
	star.fillColor = 'yellow';
	++maxStars;
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

var descendVector = new Point(0, -0.5);

var platforms = new Array();
function generatePlatform() {
	platforms.push(new Path.Rectangle({
		point: [getRndInteger(0, view.size.width), -20],
		size: [getRndInteger(view.size.width/20, view.size.width/3), getRndInteger(5, 20)],
		fillColor: 'black'
	}));
}

function generateStartingPlatform(height) {
	//starting platform
	platforms.push(new Path.Rectangle({
		point: [0, view.size.height - 10],
		size: [view.size.width, 10],
		fillColor: 'black'
	}));
	platforms.push(new Path.Rectangle({
		point: [getRndInteger(0, view.size.width), height - 20],
		size: [getRndInteger(view.size.width/20, view.size.width/3), getRndInteger(5, 20)],
		fillColor: 'black'
	}));
}

var heightNow = 0;
while(heightNow < view.size.height){ 
	generateStartingPlatform(heightNow);
	heightNow += 200;
}

var descending = false;
var jumpsMidAir = 0;
var jumpsLimit = 5;
var starCount = 0;
var maxStars = 0;

function onFrame(event) {
	if(stop) {
		return;
	}
	if(gameOver) {
		gameOverAnimation();
	} else {
		scrollingHeight = view.size.height / 4;
		speedVector -= gravity;
		player.position += speedVector;
		
		if(descending) {
			player.position -= descendVector;
			platforms.forEach(function(platform) {
				platform.position -= descendVector;
			});
			currentHeight -= descendVector.y;
			if(star){
				star.position -= descendVector;
			}
		}
		
		if(player.position.x < 15 && speedVector.x < 0) {
			speedVector.x = -speedVector.x / 2;
			player.position.x = 15;
		}
		if(player.position.x > view.size.width - 15 && speedVector.x > 0) {
			speedVector.x = -speedVector.x / 2;
			player.position.x = view.size.width - 15;
		}
		if(player.position.y < scrollingHeight && speedVector.y < 0) {
			platforms.forEach( function(platform) {
				platform.position.y -= player.position.y - scrollingHeight;
			});
			if(star) {
				star.position.y -= player.position.y - scrollingHeight;
			}
			currentHeight -= player.position.y - scrollingHeight;
			player.position.y -= player.position.y - scrollingHeight;
		}
		if(player.position.y > view.size.height + 15 && speedVector.y > 0) {
			if(!gameOver) {
				beginGameOverAnimation();
			}
		}
		
		if(currentHeight > 0 && currentHeight - generatedAt > 200) {
			descending = true;
			generatedAt = currentHeight;
			generatePlatform();
		}
		
		if(currentHeight > 0 && currentHeight - starGeneratedAt > 2 * view.size.height) {
			starGeneratedAt = currentHeight;
			generateStar();
		}
		
		platforms = platforms.slice(-15);
		
		platforms.forEach( function(platform) {
			checkCollision(platform);
		});
		
		if(star) {
			if(player.position.getDistance(star.position) < 25) {
				star.clear();
				++starCount;
			}
		}
	}
}

function gameOverAnimation() {
	gameOverBlock.position -= descendVector;
	if(gameOverBlock.position.y > view.center.y) {
		descendVector = new Point(0, 0);
		var gameOverText = new PointText({
			point: view.center + new Point(0, -150),
			justification: 'center',
			fontSize: 30,
			fillColor: 'white',
			content: 'Game Over'
		});
		gameOverText.insertAbove(gameOverBlock);
		
		var gameOverText = new PointText({
			point: view.center + new Point(0, -50),
			justification: 'center',
			fontSize: 20,
			fillColor: 'white',
			content: 'You suck'
		});
		gameOverText.insertAbove(gameOverBlock);
		
		var scoreText = new PointText({
			point: view.center + new Point(0, 50),
			justification: 'center',
			fontSize: 20,
			fillColor: 'white',
			content: 'Your score: ' + Math.round(currentHeight)
		});
		
		var starText = new PointText({
			point: view.center + new Point(0, 150),
			justification: 'center',
			fontSize: 20,
			fillColor: 'white',
			content: 'Collected stars: ' + starCount + '/' + maxStars + ' (' + Math.round(starCount * 100 / maxStars) + '%)'
		});
		gameOverText.insertAbove(gameOverBlock);
		stop = true;
	}
}

function onMouseDown(event) {
	speedArrow = new Path();
	speedArrow.strokeWidth = 3;
	if (speedVector.x == 0 && speedVector.y == 0) {
		speedArrow.strokeColor = 'violet';
	} else {
		switch(jumpsMidAir) {
			case 0:
			speedArrow.strokeColor = 'blue';
			break;
			
			case 1:
			speedArrow.strokeColor = 'green';
			break;
			
			case 2:
			speedArrow.strokeColor = 'yellow';
			break;
			
			case 3:
			speedArrow.strokeColor = 'orange';
			break;
			
			case 4:
			speedArrow.strokeColor = 'red';
			break;
			
			default:
			speedArrow.strokeColor = 'black';
		}
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
	} else if (jumpsMidAir++ < jumpsLimit) {
		speedVector += (speedArrow.lastSegment.point - speedArrow.firstSegment.point);
		speedVector /= (jumpsMidAir + 1) * 10;
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
}