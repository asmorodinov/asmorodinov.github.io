function Boss(fill)
{
	var n = 4;
	
	var points = [{x: -134, y: -100}, {x: 134, y: -100}, {x: 134, y: 100}, {x: -134, y: 100}];
	
	//for(var i = 0; i < n; ++i)
	//{
	//	var X = 100 * Math.cos(2 * Math.PI * i / n);
	//	var Y = 100 * Math.sin(2 * Math.PI * i / n);
	//	
	//	points.push({x: X, y: Y});
	//}

	this.type = 0;
	this.acc = -1.0;
	this.acc2 = -1.0;
	
	var pos = {x: 0, y: 0};
	pos.x = spaceObjects[0].position.x;
	pos.y = spaceObjects[0].position.y - 200;
	
	Entity.call(this, pos, 100, 0, 140, 0, fill, "#0000", points, 999999, 30 * (level), {x: -134, y: -100});
	
	this.bar = true;
	
	this.update = function(deltaTime) {
		var timeStep = 1.0 / 100.1;
		var timeStep2 = 5.0;
		this.acc += deltaTime;
		this.acc2 += deltaTime;
		while (this.acc >= timeStep) 
		{
			var mindist = 99999999;
			var argi = 0;
			var argj = 0;
			for(var i = -canvas.width; i <= canvas.width; i += canvas.width)
				for(var j = -canvas.height; j <= canvas.height; j += canvas.height) {
					var dist = (this.position.x - spaceObjects[0].position.x - i) ** 2 + (this.position.y - spaceObjects[0].position.y - j) ** 2;
					if(dist < mindist) {
						mindist = dist;
						argi = i;
						argj = j;
					}
				}
				
			var targetDirection = Math.atan2(spaceObjects[0].position.y + argj - this.position.y, spaceObjects[0].position.x + argi - this.position.x);
			this.velocityDirection = targetDirection;
			this.direction = this.velocityDirection;
			
			this.velocity = 140;
			this.acc -= timeStep;
		}
		
		while (this.acc2 >= timeStep2) 
		{
			let n = 16;
			for(let i = 0; i < n; ++i)
			{
				let angle = 2 * Math.PI * (i + 0.5) / n + this.velocityDirection;
				let ast = new Asteroid({
					x: this.position.x + 10 * Math.cos(angle), 
					y: this.position.y + 10 * Math.sin(angle)}, 
					25, 
					angle, 
					rnd(100, 120), 
					angle, 
					boss_projFillStyle, 
					'#0000', 
					15);
				//64x24
				ast.n = 4;
				let a = 32;
				let b = 12;
				ast.points = [{x: -a, y: -b}, {x: a, y: -b}, {x: a, y: b}, {x: -a, y: b}];
				ast.originalPoints = [{x: -a, y: -b}, {x: a, y: -b}, {x: a, y: b}, {x: -a, y: b}];
				ast.sp = false;
				ast.offset = {x: -a, y: -b};
				ast.directionVelocity = 0;
				
				spaceObjects.push(ast);
				spaceObjects[spaceObjects.length - 1].hp = 2;
			}
			this.acc2 -= timeStep2;
			this.acc = -1.5;
			this.velocity = 40;
		}
		
		Entity.prototype.update.call(this, deltaTime);
	}
}

Boss.prototype = Object.create(Entity.prototype);
