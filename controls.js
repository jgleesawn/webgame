var pos;
var fov = 45;
var clicked = false;
(function() {
	pos = {x:0,y:0}
	//window.addEventListener("mousemove", handleMouseMove);
	window.onmousedown = function(event) { clicked = true; };
	window.onmouseup = function(event) { clicked = false; };
	window.onmousemove = handleMouseMove;
	function handleMouseMove(event) {
		var x = 0;
		var y = 0;
		if (!event) var event = window.event;
		if (event.pageX || event.pageY) {
			x = event.pageX;
			y = event.pageY;
		} else if (event.clientX || event.clientY) {
			x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		if (x < 0) {
			x = 0;
		} else if (x > gl.viewportWidth) {
			x = gl.viewportWidth;
		}
		if (y < 0) {
			y = 0;
		} else if (y > gl.viewportHeight) {
			y = gl.viewportHeight;
		}
		x -= gl.viewportWidth/2;
		y -= gl.viewportHeight/2;

		x /= 20;
		y /= 20;

		if (clicked) {
			dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
//My movements break after Yawing and Pitching too much.
			var xangle = (Math.PI*(fov * gl.viewportWidth * (x/Math.pow(gl.viewportHeight,2)))/180);
			var yangle = (Math.PI*fov * (y/gl.viewportHeight)/180);
			view.Yaw(xangle);
			view.Pitch(yangle); 
			//console.log(xangle,yangle);
		}
		pos.x = x;
		pos.y = y;
	}

	window.onkeydown = function(event) {
		if (event.charCode == 0) { //signifies keydown.
			switch (event.keyCode) {
				case 87:	//w
					player.MoveUp();
					break;
				case 83:	//s
					player.MoveDown();
					break;
				case 65:	//a
					player.MoveRight();
					break;
				case 68:	//d
					player.MoveLeft();
					break;

				case 69:	//e		//Zoom-in
					view.ZoomIn();
					break;
				case 81:	//q		//Zoom-out
					view.ZoomOut();
					break;

				case 38:	//ArrowUp	//Scroll-up
					view.ScrollUp();
					break;
				case 40:	//ArrowDown	//Scroll-down
					view.ScrollDown();
					break;
				case 37:	//ArrowLeft
					view.ScrollLeft();
					break;
				case 39:	//ArrowRight
					view.ScrollRight();
					break;
			}

		} else {				//signifies keypress?, stopgap, non-event based.
		console.log(event);
			switch (event.char) {
				case "w":
					break;
				case "a":
					break;
				case "s":
					break;
				case "d":
					break;
				case "e":
					break;
				case "q":
					break;
			}
		}
	}
})()



