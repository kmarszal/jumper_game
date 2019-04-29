var currentHeight = 0;
var generatedAt = 0;
var starGeneratedAt = 0;
var gameOver = false;
var gameWon = false;
var gameOverBlock;
var stop = false;
var lastPosition = new Point(view.size.width / 2, view.size.height - 10);
var faceDirection = 'right';

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function checkCollision(platform) {
	//left wall
	if(player.position.x > platform.position.x - platform.bounds.width/2 - 5 &&
	lastPosition.x < platform.position.x - platform.bounds.width/2 - 5 && 
	player.position.y > platform.position.y - platform.bounds.height/2 - 5 && 
	player.position.y < platform.position.y + platform.bounds.height/2 && 
	speedVector.x > 0) {
		faceDirection = 'left';
		player.scale(-1, 1);
		speedVector.x = -speedVector.x / 2;
		player.position.x = platform.position.x - platform.bounds.width/2 - 5;
	}
	//right wall
	else if(player.position.x < platform.position.x + platform.bounds.width/2 + 5 &&
	lastPosition.x > platform.position.x + platform.bounds.width/2 + 5 &&
	player.position.y > platform.position.y - platform.bounds.height/2 - 5 && 
	player.position.y < platform.position.y + platform.bounds.height/2 && 
	speedVector.x < 0) {
		faceDirection = 'right';
		player.scale(-1, 1);
		speedVector.x = -speedVector.x / 2;
		player.position.x = platform.position.x + platform.bounds.width/2 + 5;
	}
	//ceiling
	else if(lastPosition.y + 2 > platform.position.y + platform.bounds.height/2 &&
	player.position.y - 2 < platform.position.y + platform.bounds.height/2 && 
	player.position.x < platform.position.x + platform.bounds.width/2 && 
	player.position.x > platform.position.x - platform.bounds.width/2) {
		speedVector.y = -speedVector.y / 2;
		player.position.y = platform.position.y + platform.bounds.height/2 + 7;
	}
	//floor
	else if(lastPosition.y - 2 < platform.position.y - platform.bounds.height/2 &&
	player.position.y + 7 > platform.position.y - platform.bounds.height/2 - 5 && 
	player.position.x < platform.position.x + platform.bounds.width/2 && 
	player.position.x > platform.position.x - platform.bounds.width/2) {
		
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
		player.position.y = platform.position.y - platform.bounds.height / 2 - 12;
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

function beginGameWonAnimation() {
	descendVector = new Point(0, -10);
	gameWon = true;
}

var star;
function generateStar() {
	star = new Path.Star(new Point(getRndInteger(20, view.size.width - 20), -20), 5, 40, 10);
	star.fillColor = 'yellow';
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

/*var player = new Path();
player.add(new Point(view.size.width / 2, view.size.height - 20));
player.add(new Point(view.size.width / 2 + 5, view.size.height - 10));
player.add(new Point(view.size.width / 2 - 5, view.size.height - 10));
player.closed = true;
player.fillColor = 'black';*/

var player = new Raster('rabbit');
player.position = new Point(view.size.width/2, view.size.height - 12);

var speedVector = new Point(0, 0);
var speedArrow;
var speedArrowLines = new Array(2);
var speedLimitArrow;
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

var endingPlatform;
function generateEndingPlatform() {
	endingPlatform = new Path.Rectangle({
		point: [10, -30],
		size: [view.size.width - 20, 30],
	});
	endingPlatform.fillColor = {
		gradient: {
			stops: ['white', 'black']
		},
		origin: endingPlatform.position - new Point(0, -15),
		destination: endingPlatform.position - new Point(0, 15)
	}
}

function checkEndingPlatformCollision() {
	if(player.position.y < endingPlatform.position.y - endingPlatform.bounds.height/2 + 5 &&
	player.position.y > endingPlatform.position.y - endingPlatform.bounds.height/2 - 5 && speedVector.y > 0) {
		if(Math.sqrt(Math.pow(speedVector.x, 2) + Math.pow(speedVector.y, 2)) < 2.5) {
			speedVector = new Point(0, 0);
			jumpsMidAir = 0;
			if(speedArrow) {
				speedArrow.strokeColor = 'violet';
			}
			beginGameWonAnimation();
		}
		speedVector.y = -speedVector.y / 2;
		
		if(speedVector.x > 0) {
			speedVector += friction;
		} 
		if(speedVector.x < 0) {
			speedVector -= friction;
		}
		player.position.y = endingPlatform.position.y - endingPlatform.bounds.height / 2 - 5;
	}
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
var maxStars = 5;
var endHeight = 10000;

var instructionText = new PointText({
	point: view.center + new Point(0, -100),
	justification: 'center',
	fontSize: 20,
	fillColor: 'black',
	content: 'Przeciągnij i upuść gdziekolwiek, aby skoczyć.\n\nMożesz skakać w powietrzu, ale tylko kilka razy i każdy następny skok jest słabszy.\n\nSkoki odnawiają się po zatrzymaniu się na platformie.\n\nTwój wynik zależy od osiągniętej wysokości i liczby zebranych gwiazdek.\n\nJeżeli grasz na telefonie, polecam obrócić ekran\n\nPowodzenia!',
	opacity: 0.75
});

function onFrame(event) {
	if(stop) {
		return;
	}
	if(gameOver) {
		gameOverAnimation();
	} else if (gameWon) {
		gameWonAnimation();
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
			if(star) {
				star.position -= descendVector;
			}
			if(endingPlatform) {
				endingPlatform.position -= descendVector;
			}
			instructionText.position -= descendVector;
		}
		
		if(player.position.x < 22 && speedVector.x < 0) {				
			faceDirection = 'right';
			player.scale(-1, 1);
			speedVector.x = -speedVector.x / 2;
			player.position.x = 22;
		}
		if(player.position.x > view.size.width - 22 && speedVector.x > 0) {
			faceDirection = 'left';
			player.scale(-1, 1);
			speedVector.x = -speedVector.x / 2;
			player.position.x = view.size.width - 22;
		}
		if(player.position.y < scrollingHeight && speedVector.y < 0) {
			if(!(endingPlatform && endingPlatform.position.y > view.center.y)) {
				platforms.forEach( function(platform) {
					platform.position.y -= player.position.y - scrollingHeight;
				});
				if(star) {
					star.position.y -= player.position.y - scrollingHeight;
				}
				if(endingPlatform) {
					endingPlatform.position.y -= player.position.y - scrollingHeight;
				}
				instructionText.position.y -= player.position.y - scrollingHeight;
				currentHeight -= player.position.y - scrollingHeight;
				lastPosition.y -= player.position.y - scrollingHeight;
				player.position.y -= player.position.y - scrollingHeight;
			}
		}
		if(player.position.y > view.size.height + 15 && speedVector.y > 0) {
			if(!gameOver) {
				beginGameOverAnimation();
			}
		}
		
		if(currentHeight > endHeight && !endingPlatform) {
			generateEndingPlatform();
		} else if (!endingPlatform) {
			if(currentHeight > 0 && currentHeight - generatedAt > 200) {
				descending = true;
				generatedAt = currentHeight;
				generatePlatform();
			}
			
			if(currentHeight > 0 && currentHeight - starGeneratedAt > 2 * view.size.height) {
				starGeneratedAt = currentHeight;
				generateStar();
			}
		}
		
		platforms = platforms.slice(-15);
		
		platforms.forEach( function(platform) {
			checkCollision(platform);
		});
		
		if(endingPlatform)
			checkEndingPlatformCollision();
		
		if(star) {
			if(player.position.getDistance(star.position) < 25) {
				star.clear();
				++starCount;
			}
		}
		lastPosition = new Point(player.position);
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
			content: 'Koniec Gry'
		});
		gameOverText.insertAbove(gameOverBlock);
		
		var gameOverText = new PointText({
			point: view.center + new Point(0, -50),
			justification: 'center',
			fontSize: 20,
			fillColor: 'white',
			content: 'Twój marny żywot dobiegł końca'
		});
		gameOverText.insertAbove(gameOverBlock);
		
		var heightText = new PointText({
			point: view.center + new Point(0, 50),
			justification: 'center',
			fontSize: 20,
			fillColor: 'white',
			content: 'Osiągnięta wysokość: ' + Math.round(currentHeight)
		});
		
		var starText = new PointText({
			point: view.center + new Point(0, 150),
			justification: 'center',
			fontSize: 20,
			fillColor: 'white',
			content: 'Zebrane gwiazdki: ' + starCount + '/' + maxStars + ' (' + Math.round(starCount * 100 / maxStars) + '%)'
		});
		
		var heightScore = Math.round(currentHeight / endHeight * 40) / 100;
		var starScore = Math.round(starCount / maxStars * 50) / 100;
		
		var scoreText = new PointText({
			point: view.center + new Point(0, 250),
			justification: 'center',
			fontSize: 20,
			fillColor: 'white',
			content: 'Twój wynik: ' + heightScore + ' (za wysokość) + ' + starScore + ' (za gwiazdki) = ' + Math.round((heightScore + starScore) * 100) / 100 + ' / 1.0'
		});
		
		gameOverText.insertAbove(gameOverBlock);
		stop = true;
	}
}

function gameWonAnimation() {
	endingPlatform.position -= descendVector;
	player.position -= descendVector;
	platforms.forEach(function(platform) {
		platform.position -= descendVector;
	});
	if(endingPlatform.position.y > view.size.height - 20) {
		descendVector = new Point(0, 0);
		var gameOverText = new PointText({
			point: view.center + new Point(0, -150),
			justification: 'center',
			fontSize: 30,
			fillColor: 'black',
			content: 'Gratulacje!'
		});
		gameOverText.insertAbove(gameOverBlock);
		
		var gameOverText = new PointText({
			point: view.center + new Point(0, -50),
			justification: 'center',
			fontSize: 20,
			fillColor: 'black',
			content: 'Udało Ci się dotrzeć na szczyt!'
		});
		gameOverText.insertAbove(gameOverBlock);
		
		var starText = new PointText({
			point: view.center + new Point(0, 50),
			justification: 'center',
			fontSize: 20,
			fillColor: 'black',
			content: 'Zebrane gwiazdki: ' + starCount + '/' + maxStars + ' (' + Math.round(starCount * 100 / maxStars) + '%)'
		});
		
		var topScore = 0.1;
		var heightScore = 0.4;
		var starScore = Math.round(starCount / maxStars * 50) / 100;
		
		var scoreText = new PointText({
			point: view.center + new Point(0, 150),
			justification: 'center',
			fontSize: 20,
			fillColor: 'black',
			content: 'Twój wynik: ' + heightScore + ' (za wysokość) + ' + starScore + ' (za gwiazdki) + ' + topScore + ' (za ukończenie gry) = ' + Math.round((heightScore + starScore + topScore) * 100) / 100 + ' / 1.0'
		});
		
		stop = true;
	}
}

function onMouseDown(event) {
	speedLimitArrow = new Path();
	speedLimitArrow.strokeWidth = 2;
	speedLimitArrow.strokeColor = 'gray';
	speedLimitArrow.opacity = 0.25;
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
	speedLimitArrow.add(event.point);
}

function onMouseDrag(event) {
	speedLimitArrow.removeSegment(1);
	var vector = event.point - speedArrow.firstSegment.point;
	speedLimitArrow.add(speedLimitArrow.firstSegment.point + vector.normalize(200));
	
	speedArrow.removeSegment(1);
	if(vector.length > 200) {
		speedArrow.add(speedArrow.firstSegment.point + vector.normalize(200));
	} else {
		speedArrow.add(event.point);
	}
	
	speedArrowLines.forEach(function(line) {
		line.remove();
	});
	speedArrowLines = new Array(2);
	
	speedArrowLines.push(drawSpeedArrowLine(speedArrow, 30))
	speedArrowLines.push(drawSpeedArrowLine(speedArrow, -30))
}

function drawSpeedArrowLine(arrow, angle) {
	var speedArrowLine = new Path();
	speedArrowLine.strokeWidth = arrow.strokeWidth;
	speedArrowLine.strokeColor = arrow.strokeColor;
	speedArrowLine.add(arrow.lastSegment.point);
	var vector = arrow.firstSegment.point - arrow.lastSegment.point;
	vector.angle -= angle;
	speedArrowLine.add(arrow.lastSegment.point + vector.normalize(speedArrow.length / 10));
	return speedArrowLine;
}

function onMouseUp(event) {
	if (speedVector.x == 0 && speedVector.y == 0) {
		speedVector = speedArrow.lastSegment.point - speedArrow.firstSegment.point;
		speedVector /= 10;
	} else if (jumpsMidAir++ < jumpsLimit) {
		speedVector += (speedArrow.lastSegment.point - speedArrow.firstSegment.point);
		speedVector /= (jumpsMidAir + 3) * 5;
	}
	speedArrow.remove();
	speedLimitArrow.remove();
	
	speedArrowLines.forEach(function(line) {
		line.remove();
	});
	speedArrowLines = new Array(2);
	
	if(speedVector.x > 0) {
		if(faceDirection == 'left') {
			faceDirection = 'right';
			player.scale(-1, 1);
		}
	} else if (speedVector.x < 0) {
		if(faceDirection == 'right') {
			faceDirection = 'left';
			player.scale(-1, 1);
		}
	}
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