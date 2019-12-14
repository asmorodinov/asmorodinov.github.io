function Ship(pos, size, dir, vel, veldir, fill, stroke)
{
	var n = 14;
	
	var points = [
	{x: 0 - 48/2,	y: 0  - 47 / 2},
	{x: 4 - 48/2,	y: 0  - 47 / 2},
	{x: 13- 48/2,	y: 9  - 47 / 2},
	{x: 63- 48/2,	y: 21 - 47 / 2},
	{x: 63- 48/2,	y: 26 - 47 / 2},
	{x: 13- 48/2,	y: 38 - 47 / 2},
	{x: 4 - 48/2,	y: 47 - 47 / 2},
	{x: 0 - 48/2,	y: 47 - 47 / 2},
	{x: 0 - 48/2,	y: 39 - 47 / 2},
	{x: 5 - 48/2,	y: 28 - 47 / 2},
	{x: 0 - 48/2,	y: 26 - 47 / 2},
	{x: 0 - 48/2,	y: 21 - 47 / 2},
	{x: 5 - 48/2,	y: 19 - 47 / 2},
	{x: 0 - 48/2,	y: 8  - 47 / 2}
	];

	
	
	//var n = 4;
	
	//var points = [{x: size, y: 0}, {x: -0.5 * size, y: -0.5 * size}, {x: 0, y: 0}, {x: -0.5 * size, y: 0.5 * size}];
	
	Entity.call(this, pos, size, dir, vel, veldir, fill, stroke, points, 999999, 1, {x: points[0].x, y: points[0].y});
	
	this.acc = 0;
	
	this.type = 2;
	
	this.update = function(deltaTime) {
		var timeStep = 1.0 / 100.0;
		this.acc += deltaTime;
		while (this.acc >= timeStep) 
		{
			this.directionVelocity *= 0.99;
			this.velocity *= 0.997;
			this.acc -= timeStep;
		}
		
		if(this.velocity > 300 * sz2)
			this.velocity = 300 * sz2;
		if(this.velocity < -300 * sz2)
			this.velocity = -300 * sz2;
		
		if(this.directionVelocity > 5 * sz2)
			this.directionVelocity = 5 * sz2;
		if(this.directionVelocity < -5 * sz2)
			this.directionVelocity = -5 * sz2;
		
		Entity.prototype.update.call(this, deltaTime);
		if(thrust)
			this.fill = shipFillStyle;
		else
			this.fill = ship_normFillStyle;
	}
	this.resize = function(size) {
		this.size = size;
		this.points = [{x: size, y: 0}, {x: -0.5 * size, y: -0.5 * size}, {x: 0, y: 0}, {x: -0.5 * size, y: 0.5 * size}];
		this.originalPoints = [{x: size, y: 0}, {x: -0.5 * size, y: -0.5 * size}, {x: 0, y: 0}, {x: -0.5 * size, y: 0.5 * size}];
		this.lastDirection = 0;
	}
}

Ship.prototype = Object.create(Entity.prototype);