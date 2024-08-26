let w = 640, h = 480;
let mDown = false;
let points = [];
let rPoints = [];
let tolerance = 3;
let showControlPoints = true;

function setup(){
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');
}

function draw(){
	background(255);
	fill(255);
	stroke(0.5);	
	rect(0,0,w-1,h-1);
	line(w >> 1, 1, w >> 1, h-1);

	fill(0);
	text("Draw on this side, release to see the result on the right.", 10, 20);	

	if (mDown){
		if (mouseX > 0 && mouseX < (w >> 1) && mouseY > 0 && mouseY < h){
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
		// 	line(rPoints[i].x, rPoints[i].y, rPoints[i+1].x, rPoints[i+1].y);
		// }
		
		for(let i = 0; i < result.length; i++){
			result[i].draw();
		}
		pop();
	}
}

function mousePressed(){
	if (mouseX > 0 && mouseX < (w >> 1) && mouseY > 0 && mouseY < h) {
		mDown = true;
		points = [];
		rPoints = [];
		result = [];
	}
}

function drawTheCurve(){
	if (points.length > 0){
		rPoints = dpReduction(points, tolerance);
		if (rPoints != null && rPoints.length > 1){
			fit(rPoints, 4.0, result);

			const lblNPoints = document.getElementById('nPoints');
			lblNPoints.innerHTML = `Number of points: <b>${points.length}</b>`;

			const lblRPoints = document.getElementById('nRPoints');
			lblRPoints.innerHTML = `Number of points after reduction: <b>${rPoints.length}</b>`;
		}
	}	
}

function mouseReleased(){
	mDown = false;
	drawTheCurve();
}