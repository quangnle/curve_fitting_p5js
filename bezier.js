var Bezier = function(p1, p2, p3, p4){
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	this.p4 = p4;
	
	this.segments = function(){
		let nSegs = 30;
		let inc = 1.0 / nSegs;
		let t = 0, t1 = 0;
		let arr = [];
		
		for (let i = 0; i < nSegs; i++){
			t1 = 1 - t;
			let t1_3 = t1*t1*t1;
			let t1_3a = (3*t)*t1*t1;
			let t1_3b = (3*t*t)*t1
			let t1_3c = t*t*t;
			
			let x = t1_3 * this.p1.x
			x = x + t1_3a * this.p2.x;
            x = x + t1_3b * this.p3.x;
            x = x + t1_3c * this.p4.x

            let y = t1_3  * this.p1.y;
            y = y + t1_3a * this.p2.y;
            y = y + t1_3b * this.p3.y;
            y = y + t1_3c * this.p4.y;
			
			arr.push({"x":x, "y":y});			
            t = t + inc;
		}
		
		return arr;
	}
	
	this.draw = function(){
		let segments = this.segments();
		
		for (let i = 0; i < segments.length - 1; i++){
			line(segments[i].x, segments[i].y, segments[i+1].x, segments[i+1].y);
		}
		
		ellipse(segments[0].x, segments[0].y, 3, 3);
		ellipse(segments[segments.length - 1].x, segments[segments.length - 1].y, 3, 3);
	}
}