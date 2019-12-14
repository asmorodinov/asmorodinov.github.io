function Bullet(pos, size, dir, vel, veldir, fill, stroke, lifeTime, hp)
{
	var n = 4;
	
	
	//16x6
	let a = 12;
	let b = 4;
	var points = [{x: -a, y: -b}, {x: a, y: -b}, {x: a, y: b}, {x: -a, y: b}];
	
	//for(var i = 0; i < n; ++i)
	//{
	//	var X = size * Math.cos(2 * Math.PI * i / n);
	//	var Y = size * Math.sin(2 * Math.PI * i / n);
	//	
	//	points.push({x: X, y: Y});
	//}
	
	this.type = 1;
	
	Entity.call(this, pos, size, dir, vel, veldir, fill, stroke, points, lifeTime, hp, {x: -a, y: -b});
	
	this.update = function(deltaTime) {
		Entity.prototype.update.call(this, deltaTime);
		
		this.direction = this.velocityDirection;
	}
}

Bullet.prototype = Object.create(Entity.prototype);