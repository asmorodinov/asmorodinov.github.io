function Entity(pos, size, dir, vel, veldir, fill, stroke, points, lifeTime, hp, offset) 
{
	this.n = points.length;
	
	this.points = [];
	this.sp = true;
	this.originalPoints = [];
	this.position = pos;
	this.size = size;
	this.velocity = vel;
	this.velocityDirection = veldir;
	this.direction = dir;
	this.lastDirection = 0;
	this.fill = fill;
	this.stroke = stroke;
	
	this.lifeTime = lifeTime;
	this.time = 0;
	this.remove = false;
	
	this.directionVelocity = 0;
	
	this.hp = hp;
	this.maxHp = hp;
	this.bar = false;
	
	this.offset = offset;
	
	for(var i = 0; i < this.n; ++i)
	{
		this.points.push({x: points[i].x, y: points[i].y});
		this.originalPoints.push({x: points[i].x, y: points[i].y});
	}
}

Entity.prototype.update = function(deltaTime) {
	this.time += deltaTime;
	
	this.position = {x: this.velocity * Math.cos(this.velocityDirection) * deltaTime + this.position.x, y: this.velocity * Math.sin(this.velocityDirection) * deltaTime + this.position.y};
		
	this.direction += deltaTime * this.directionVelocity;
			
	if(this.time > this.lifeTime)
		this.remove = true;
		
	if(this.position.x < 0)
		this.position.x += canvas.width;
		
	if(this.position.y < 0)
		this.position.y += canvas.height;
		
	this.position.x = this.position.x % canvas.width;
	this.position.y = this.position.y % canvas.height;
		
	if(Math.abs(this.direction - this.lastDirection) >= 0.01) {
		var a = this.direction;
		var b = this.lastDirection;
		var theta = a - b;
		for(var i = 0; i < this.n; ++i) {
			var alpha = Math.atan2(this.points[i].y, this.points[i].x);
			var len = Math.sqrt(this.points[i].x * this.points[i].x + this.points[i].y * this.points[i].y);
			
			this.points[i].x = len * Math.cos(alpha + theta);
			this.points[i].y = len * Math.sin(alpha + theta);
		}
		this.lastDirection = this.direction;
	}	
}

Entity.prototype.getVertices = function(pos) {
	var points = [];
	for(var i = 0; i < this.n; ++i) {
		var X = this.points[i].x + pos.x;
		var Y = this.points[i].y + pos.y;
		points.push({x: X, y: Y});
	}
	return points;
}

Entity.prototype.Draw = function(pos) {
	
	
	ctx.translate(pos.x, pos.y);
	
	ctx.globalAlpha = 0.5;
	if(this.bar && this.hp < this.maxHp){
		ctx.translate(-25, -30 - this.size / 1.0);
		
		ctx.fillStyle = "#00000066";
		ctx.strokeStyle = "#00000000";
		ctx.lineWidth = 1;
		ctx.fillRect(0, 0, 50, 10);
		ctx.fillStyle = "#FF0000BB";
		ctx.fillRect(0, 0, 50 * this.hp / this.maxHp, 10);
		
		ctx.translate(25, 30 + this.size / 1.0);
	}
	
	ctx.globalAlpha = Math.max(0.5, 1 - this.time / this.lifeTime);
	
	ctx.fillStyle = this.fill;
	ctx.strokeStyle = this.stroke;
	ctx.lineWidth = 3;
	
	ctx.rotate(this.direction);
	ctx.beginPath();
	
	ctx.translate(this.offset.x, this.offset.y);
	
	for(var i = 0; i < this.n; ++i) {
		var X = this.originalPoints[i].x - this.offset.x;
		var Y = this.originalPoints[i].y - this.offset.y;
		
		if(i == 0)
			ctx.moveTo(X, Y);
		if(i > 0)
			ctx.lineTo(X, Y);
		if(i == this.n - 1)
			ctx.lineTo(this.originalPoints[0].x - this.offset.x, this.originalPoints[0].y - this.offset.y);
	}

	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	
	
	ctx.translate(-this.offset.x, -this.offset.y);
	ctx.rotate(-this.direction);
	ctx.translate(-pos.x, -pos.y);
	ctx.globalAlpha = 1;
}

Entity.prototype.draw = function() {
	for(var i = -canvas.width; i <= canvas.width; i += canvas.width)
		for(var j = -canvas.height; j <= canvas.height; j += canvas.height)
			this.Draw({x: this.position.x + i, y: this.position.y + j});			
}