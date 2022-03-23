let w = 640, h = 480;
let mDown = false;
let points = [];
let rPoints = [];

function setup(){
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');
}

function draw(){
	background(255);
	stroke(1);	
	rect(0,0,w-1,h-1);
	line(w >> 1, 1, w >> 1, h-1);
	
	if (mDown){
		if (mouseX < (w>>1)){
			points.push(new Vec2(mouseX, mouseY));
		}
	}
	
	for (let i = 0; i < points.length - 1; i++){
		line(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
	}
	
	if (rPoints.length > 0){
		push();
		translate(w >> 1, 0);
		// for (let i = 0; i < rPoints.length - 1; i++){
			// line(rPoints[i].x, rPoints[i].y, rPoints[i+1].x, rPoints[i+1].y);
		// }
		
		for(let i = 0; i < result.length; i++){
			result[i].draw();
		}
		pop();
	}
}

function mousePressed(){
	mDown = true;
	points = [];
	rPoints = [];
	result = [];
}

function mouseReleased(){
	mDown = false;
	if (points.length > 0){
		rPoints = dpReduction(points, 3);
		if (rPoints != null && rPoints.length > 1){
			fit(rPoints, 4.0, result);
		}
	}
	
}