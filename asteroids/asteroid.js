function rnd(a, b) {
	return (Math.random() * (b - a) + a);
}

function Asteroid(pos, size, dir, vel, veldir, fill, stroke, lifeTime)
{
	var n = Math.floor(rnd(4, 8));
	
	var points = [];
	
	for(var i = 0; i < n; ++i)
	{
		var dsize = rnd(-0.1, 0.1);
		var dangle = rnd(-0.4, 0.4);
		var X = size * (1 + dsize) * Math.cos(2 * Math.PI * i / n + dangle);
		var Y = size * (1 + dsize) * Math.sin(2 * Math.PI * i / n + dangle);
		
		points.push({x: X, y: Y});
	}
	
	this.type = 0;
	
	Entity.call(this, pos, size, dir, vel, veldir, fill, stroke, points, lifeTime, 1, {x: 0, y: 0});

	this.directionVelocity = rnd(-1.0, 1.0);
	
	this.update = function(deltaTime) {
		Entity.prototype.update.call(this, deltaTime);
		if(this.size == 28.5)
			this.direction = this.velocityDirection;
	}
}

Asteroid.prototype = Object.create(Entity.prototype);