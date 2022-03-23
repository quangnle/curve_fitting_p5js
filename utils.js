function evalParam(degree, points, t){
	let temp = [];
	for (i = 0; i <= degree; i++) {
		temp.push(new Vec2(points[i].x, points[i].y));
	}
	
	for (i = 1; i < degree; i++) {	
		for (j = 0; j <= degree-i; j++) {
			temp[j].x = (1.0 - t) * temp[j].x + t * temp[j+1].x;
			temp[j].y = (1.0 - t) * temp[j].y + t * temp[j+1].y;
		}
	}
	
	return temp[0];
}

function rootFind(points, p, u)	{
	let q1 = [];
	let q2 = [];
	
	let qu = null, qu1 = null, qu2 = null;
	
	qu = evalParam(3, points, u);
	for (let i = 0; i < 3; i++){
		let q1x = (points[i + 1].x - points[i].x) * 3;
		let q1y = (points[i + 1].y - points[i].y) * 3;		
		q1.push(new Vec2(q1x, q1y));
	}
	
	for (let i = 0; i < 2; i++){
		let q2x = (q1[i + 1].x - q1[i].x) * 2.0;
        let q2y = (q1[i + 1].y - q1[i].y) * 2.0;
		q2.push(new Vec2(q2x, q2y))
	}
	
	qu1 = evalParam(2, q1, u);
	qu2 = evalParam(1, q2, u);
	
	
	let numerator = (qu.x - p.x) * qu1.x + (qu.y - p.y) * qu1.y;
	let denominator = qu1.x * qu1.x + qu1.y * qu1.y + (qu.x - p.x) * qu2.x + (qu.y - p.y) * qu2.y;
	
	if (denominator == 0) return u;
	
	let result = u - (numerator / denominator);
	return result
}

function reParam(points, first, last, u, curve){
	let nPts = last - first + 1;
	let result = []
	
	for (let i = first; i <= last; i++){
		result.push(rootFind(curve, points[i], u[i - first + 1]));
	}
	
	return result;
}