function dPointLine(p1, p2, p3){
	let area = Math.abs(0.5 * (p2.x * p3.y + p3.x * p1.y + p1.x * p2.y - p3.x * p2.y - p1.x * p3.y - p2.x * p1.y))    
    
    let bottom = p2.dist(p3);
    let height = area / bottom * 2.0;

    return height;
}

function douglaspeucker(points, firstPoint, lastPoint, tolerance, pointIndices){
	let maxD = 0;
	let indexFurthest = 0;
	
	for (let i=firstPoint + 1; i< lastPoint - 1; i++){
		let distance = dPointLine(points[i], points[firstPoint], points[lastPoint]);
		if (distance > maxD){
			maxD = distance;
			indexFurthest = i;
		}
	}
	
	if ((maxD > tolerance) && (indexFurthest != 0)){
		pointIndices.push(indexFurthest);
		douglaspeucker(points, firstPoint, indexFurthest, tolerance, pointIndices)
		douglaspeucker(points, indexFurthest, lastPoint, tolerance, pointIndices)
	}
}

function dpReduction(points, tolerance){
	if (points == null || points.length < 3) return points;
	
	let fPoint = 0;
	let lPoint = points.length - 1;
	
	let indices = [fPoint, lPoint];
	
	// to remove duplicate points
	while (points[fPoint].x == points[lPoint].x && 
			points[fPoint].y == points[lPoint].y && lPoint > 0){
		lPoint = lPoint - 1;
	}
	
	douglaspeucker(points, fPoint, lPoint, tolerance, indices)
	
	// sort the indices
	for (let i = 0; i < indices.length - 1; i++) {
        for (let j = indices.length - 1; j > i; j--) {
            if (indices[i] > indices[j]) {
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
        }
    }
	
	// return the selected points
	let returnPoints = [];	
	for (let i = 0; i < indices.length; i++){
		returnPoints.push(points[indices[i]]);
	}
	
	return returnPoints;
}