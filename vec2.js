var Vec2 = function(x, y){
	this.x = x;
	this.y = y;
	
	this.mag = function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	
	this.mag2 = function(){
		return this.x * this.x + this.y * this.y;
	}
	
	this.add = function(v){
		this.x = this.x + v.x;
		this.y = this.y + v.y;
	}
	
	this.scale = function(s){
		this.x = this.x * s;
		this.y = this.y * s;
	}
	
	this.dist = function(v){
		return Math.sqrt((v.x - this.x)*(v.x - this.x) + (v.y - this.y)*(v.y - this.y));
	}
	
	this.unit = function(){
		let mag = this.mag();
		this.x = this.x / mag;
		this.y = this.y / mag;
	}
	
	this.mul = function(s){
		return new Vec2(s*this.x, s*this.y);
	}
	
	this.addVector = function(v){
		return new Vec2(this.x + v.x, this.y + v.y);
	}
	
	this.negate = function(){
		return new Vec2(-this.x, -this.y);
	}
	
	this.dot = function(v){
		return this.x * v.x + this.y * v.y;
	}
}