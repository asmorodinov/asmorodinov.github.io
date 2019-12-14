function toNorm(x) {
	var y = x;
	while(y > Math.PI)
		y -= Math.PI;
	while(y < -Math.PI)
		y += Math.PI;
	return y;
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

function HomingBullet(pos, size, dir, vel, veldir, fill, stroke, lifeTime, spaceObjects, hp)
{
	//var n = 12;
	
	//var points = [];
	
	var n = 4;
	let a = 18;
	let b = 10.5;
	var points = [{x: -a, y: -b}, {x: a, y: -b}, {x: a, y: b}, {x: -a, y: b}];
	
	//for(var i = 0; i < n; ++i)
	//{
	//	var X = size * Math.cos(2 * Math.PI * i / n);
	//	var Y = size * Math.sin(2 * Math.PI * i / n);
	//	
	//	points.push({x: X, y: Y});
	//}
	
	this.type = 1;
	this.acc = 0;
	
	this.spaceObjects = spaceObjects;
	
	Entity.call(this, pos, size, dir, vel, veldir, fill, stroke, points, lifeTime, hp, {x: -a, y: -b});
	
	this.update = function(deltaTime) {
		var timeStep = 1.0 / 45.0;
		this.acc += deltaTime;
		while (this.acc >= timeStep) 
		{
			var mindist = 99999999;
			var argmin = 0;
			var argi = 0;
			var argj = 0;
			
			for(var i1 = 0; i1 < this.spaceObjects.length; ++i1) 
				if(spaceObjects[i1].type == 0) 
					for(var i = -canvas.width; i <= canvas.width; i += canvas.width)
						for(var j = -canvas.height; j <= canvas.height; j += canvas.height) {
							var dist = (this.position.x - this.spaceObjects[i1].position.x - i) ** 2 + (this.position.y - this.spaceObjects[i1].position.y - j) ** 2;
							if(dist < mindist) {
								mindist = dist;
								argmin = i1;
								argi = i;
								argj = j;
							}
						}
			
			
			var targetDirection = Math.atan2(this.spaceObjects[argmin].position.y + argj - this.position.y, this.spaceObjects[argmin].position.x + argi - this.position.x);
			//if(toNorm(targetDirection - this.velocityDirection)	> 0)
			//	this.directionVelocity = 10.7;
			//else
			//	this.directionVelocity = -10.7;
			//this.velocityDirection = lerp(this.velocityDirection, targetDirection, 0.6);
			this.velocityDirection = lerp(this.velocityDirection, targetDirection, 1.0);
			this.acc -= timeStep;
			this.direction = this.velocityDirection;
		}
		
		Entity.prototype.update.call(this, deltaTime);
	}
}

HomingBullet.prototype = Object.create(Entity.prototype);