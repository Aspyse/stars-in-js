var canvas = document.querySelector('canvas'),
	ctx = canvas.getContext('2d'),
	dd = 0.05,
	mouseX = 0,
	mouseY = 0,
	starCount = 250,
	stars = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const measure = (x1, x2, y1, y2) => {
	return Math.sqrt(Math.pow(x1-x2, 2)+Math.pow(y1-y2, 2));
}
function Star(x, y, level, index) {
	this.x = x;
	this.y = y;
	this.level = level;
	this.radius = measure(canvas.width/2, this.x, canvas.height, this.y);
	this.angle = Math.atan((canvas.height-this.y)/(canvas.width/2-this.x));
	this.pMul = this.level/100;
	this.index = index;
	this.draw = function() {
		ctx.beginPath();
    ctx.arc(this.x, this.y, this.brightness, 0, Math.PI*2, false);
    ctx.strokeStyle = "white";
    ctx.stroke();
	}
	this.update = function() {
		if (this.y > canvas.height && this.x > canvas.width/2) {
			this.angle -= Math.PI;
		}
		this.angle += Math.acos(1-Math.pow(dd/(this.radius/(this.level/2)),2)/2);
		console.log(this.angle);
    this.x = canvas.width/2 + this.radius*Math.cos(this.angle) - (mouseX*this.pMul);
    this.y = canvas.height + this.radius*Math.sin(this.angle) - (mouseY*this.pMul);
    this.draw();
	}
}
function hoverSize() {
	for (i = 0; i < stars.length; i++) {
		if (measure(mouseX, stars[i].x-canvas.width/2, mouseY, stars[i].y-canvas.height/2) < 100) {
			stars[i].brightness = stars[i].level/3;
		}
		else
			stars[i].brightness = stars[i].level/5;
	}
}
function hoverLines() {
	for (i = 0; i < stars.length; i++) {
		for (j = 0; j <stars.length; j++) {
			if (stars[i].brightness == stars[i].level/3) {
				if (measure(stars[j].x, stars[i].x, stars[j].y, stars[i].y) < 70) {
					ctx.beginPath();
					ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
					ctx.moveTo(stars[j].x, stars[j].y);
           		   	ctx.lineTo(stars[i].x, stars[i].y);
           			ctx.stroke();
				}
			}
		}
	}
}

for (i = 0; i < starCount; i++) {
	stars[i] = new Star(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*10, i);
	//stars[i].angle = Math.atan(stars[i].y/stars[i].x)*180/Math.PI;
}
const animate = () => {
	setTimeout(function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (i = 0; i < starCount; i++)
			stars[i].update()
		hoverSize();
		hoverLines();

		window.requestAnimationFrame(animate);
	}, 1000 / 144);
}
animate();
const changeMouse = (event) => {
  mouseX = event.clientX-(canvas.width/2);
  mouseY = event.clientY-(canvas.height/2);
}
document.querySelector("body").addEventListener("mousemove", changeMouse);