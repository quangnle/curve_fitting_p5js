function computeLeftTangent(points, startIndex){
	let tHat1 = new Vec2(points[startIndex + 1].x, points[startIndex + 1].y)
	let tmp = new Vec2(-points[startIndex].x, -points[startIndex].y)
	tHat1.add(tmp);
	tHat1.unit();
	
	return tHat1;
}

function computeRightTangent(points, endIndex){
	let tHat2 = new Vec2(points[endIndex - 1].x, points[endIndex - 1].y);
	let tmp = new Vec2(-points[endIndex].x, -points[endIndex].y);
	tHat2.add(tmp);
	tHat2.unit();
	
	return tHat2;
}

function computeCenterTangent(points, centerIndex){
	let v1 = new Vec2(points[centerIndex - 1].x, points[centerIndex - 1].y);
	v1.add(new Vec2(-points[centerIndex].x, -points[centerIndex].y));
	
	let v2 = new Vec2(points[centerIndex].x, points[centerIndex].y);
	v2.add(new Vec2(-points[centerIndex + 1].x, -points[centerIndex + 1].y));
	
	let vCenter = new Vec2((v1.x + v2.x)/2.0, (v1.y + v2.y)/2.0);
	vCenter.unit();
	
	return vCenter;
}

function chordLengthParam(points, first, last){
	let result = [0];	
	
	for (let i = first + 1; i <= last; i++){
		let nextU = result[i-first-1] + points[i].dist(points[i - 1]);
		result.push(nextU);
	}
	
	for (let i = first + 1; i <= last; i++){
		result[i - first] = result[i - first] / result[last - first];
	}
	
	return result;
}

function computeMaxError(points, first, last, curve, u, splitPoint){
	let maxDist = 0;
	let dist = 0;
	let p = null;
	let v = null;
	
	splitPoint.val = Math.floor((last - first + 1) / 2);
	
	for (let i = first + 1; i < last; i++){
		p = evalParam(3, curve, u[i - first]);
		v = new Vec2(p.x - points[i].x, p.y - points[i].y);
		dist = v.mag2();
		
		if (dist >= maxDist){
			maxDist = dist;
			splitPoint.val = i;
		}
	}
	
	return maxDist;
}

function generateBeizer(points, first, last, uPrime, tHat1, tHat2){
	let A = [];
	let C = [];
	let X = [0, 0];
	
	let bzCurve = [];
	let nPts = last - first + 1;
	
	for (let i = 0; i < nPts; i++){
		let v1 = new Vec2(tHat1.x, tHat1.y);
		let v2 = new Vec2(tHat2.x, tHat2.y);

		v1.scale(3 * uPrime[i] * (1 - uPrime[i]) * (1 - uPrime[i]));
		v2.scale(3 * uPrime[i] * uPrime[i] * (1 - uPrime[i]));

		A.push([v1, v2]);
	}
	
	let C1 = [0,0];
	C.push(C1);
	
	let C2 = [0,0];	
	C.push(C2);
	
	for (let i = 0; i < nPts; i++){
		let va1 = new Vec2(A[i][0].x, A[i][0].y);
		let va2 = new Vec2(A[i][1].x, A[i][1].y);
		
		C[0][0] = C[0][0] + va1.dot(va1);
		C[0][1] = C[0][1] + va1.dot(va2);
		C[1][0] = C[0][1];
		C[1][1] = C[1][1] + va2.dot(va2);
		
		let vfi = new Vec2(points[first + i].x, points[first + i].y);
		let vf = new Vec2(points[first].x, points[first].y);
		let vl = new Vec2(points[last].x, points[last].y);
		
		let op1 = vf.mul((1 - uPrime[i]) * (1 - uPrime[i]) * (1 - uPrime[i]));
		let op2 = vf.mul(3 * uPrime[i] * (1 - uPrime[i]) * (1 - uPrime[i]));
		let op3 = vl.mul(3 * uPrime[i] * uPrime[i] * (1 - uPrime[i]));
		let op4 = vl.mul(uPrime[i] * uPrime[i] * uPrime[i]);
		
		let vsum = op1.addVector(op2)
		vsum = vsum.addVector(op3);
		vsum = vsum.addVector(op4);
		vsum = vfi.addVector(vsum.negate());
		
		X[0] = X[0] + A[i][0].dot(vsum);
		X[1] = X[1] + A[i][1].dot(vsum);
	}
		
	let detc1c2 = C[0][0] * C[1][1] - C[1][0] * C[0][1];
	let detc1x = C[0][0] * X[1] - C[1][0] * X[0];
	let detxc2 = X[0] * C[1][1] - X[1] * C[0][1];
	
	let alpha_l = 0, alpha_r = 0;
	
	if (detc1c2 != 0){
		alpha_l = detxc2 / detc1c2;
		alpha_r = detc1x / detc1c2;
	}
	
	let segLength = points[first].dist(points[last]);
	let epsilon = 0.000001 * segLength;
	let p0, p1, p2, p3;
	if (alpha_l < epsilon || alpha_r < epsilon){
		let dist = segLength / 3.0;
		p0 = points[first];
		p3 = points[last];
		p1 = (tHat1.mul(dist)).addVector(new Vec2(p0.x, p0.y));
		p2 = (tHat2.mul(dist)).addVector(new Vec2(p3.x, p3.y));		
	} else {
		p0 = points[first];
		p3 = points[last];
		p1 = (tHat1.mul(alpha_l)).addVector(new Vec2(p0.x, p0.y));
		p2 = (tHat2.mul(alpha_r)).addVector(new Vec2(p3.x, p3.y));
	}
	
	bzCurve.push(p0); bzCurve.push(p1); bzCurve.push(p2); bzCurve.push(p3);
	return bzCurve;
}

function fitCubic(points, first, last, tHat1, tHat2, err, result){
	let bzCurve = [];
	let iterationError = err * err;
	let nPts = last - first + 1;
	let splitPoint = {val: 0};
	let p0, p1, p2, p3;
	let maxIterations = 10;
	
	if (nPts == 2){
		let segLength = points[first].dist(points[last]);
		let dist = segLength / 3.0;
		
		p0 = points[first];
		p3 = points[last];
		p1 = (tHat1.mul(dist)).addVector(new Vec2(p0.x, p0.y));
		p2 = (tHat2.mul(dist)).addVector(new Vec2(p3.x, p3.y));	
		
		let bz = new Bezier(p0, p1, p2, p3);
		
		result.push(bz);
		return;
	}
	
	let u = chordLengthParam(points, first, last);
	bzCurve = generateBeizer(points, first, last, u, tHat1, tHat2);
	let maxError = computeMaxError(points, first, last, bzCurve, u, splitPoint);
	
	if (maxError < err){
		let bz = new Bezier(bzCurve[0], bzCurve[1], bzCurve[2], bzCurve[3]);
		result.push(bz);
		return;
	}
	
	if (maxError < iterationError){
		for (let i = 0; i < maxIterations; i++){
			uPrime = reParam(points, first, last, u, bzCurve);
			bzCurve = generateBeizer(points, first, last, uPrime, tHat1, tHat2);
			maxError = computeMaxError(points, first, last, bzCurve, uPrime, splitPoint);
			
			if (maxError < err) {
				let bz = new Bezier(bzCurve[0], bzCurve[1], bzCurve[2], bzCurve[3], 20);
				result.push(bz);
				return ;
			}
			u = uPrime;
		}
	}	
	
	let tHatCenter = computeCenterTangent(points, splitPoint.val);
	fitCubic(points, first, splitPoint.val, tHat1, tHatCenter, err, result);
	tHatCenter = tHatCenter.negate();
	fitCubic(points, splitPoint.val, last, tHatCenter, tHat2, err, result);
}

function fit(points, error, result)
{
    let tHat1 = computeLeftTangent(points, 0);
    let tHat2 = computeRightTangent(points, points.length - 1);
	fitCubic(points, 0, points.length - 1, tHat1, tHat2, error, result);
}