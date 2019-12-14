function MeleeEnemy(pos, fill) {
	this.type = 0;
	
	var n = 4;
	
	let a = 84.0 / 2.0;
	let b = 93.0 / 2.0;
	var points = [{x: -a, y: -b}, {x: a, y: -b}, {x: a, y: b}, {x: -a, y: b}];
	Entity.call(this, pos, 45, rnd(0, 2 * Math.PI), 0, 0, fill, "#0000", points, 999999, 24 * (level / 2 + 1), {x: -a, y: -b});
	this.sp = false;
	this.acc = 0;
	this.bar = true;
	
	this.update = function(deltaTime) {
		var timeStep = 1.0 / 100.1;
		this.acc += deltaTime;
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
			let length = (this.position.x - argi - ship.position.x) ** 2 + (this.position.y - argj - ship.position.y) ** 2;
			if(length < 400 ** 2)
			{	
				var targetDirection = Math.atan2(spaceObjects[0].position.y + argj - this.position.y, spaceObjects[0].position.x + argi - this.position.x);
				this.velocityDirection = targetDirection;
				this.direction = this.velocityDirection;
			
				this.velocity = 100;
			}
			else
				this.velocity = 0;
			
			this.acc -= timeStep;
		}
		Entity.prototype.update.call(this, deltaTime);
	}
}

MeleeEnemy.prototype = Object.create(Entity.prototype);

function RangedEnemy(pos, fill) {
	this.type = 0;
	
	var n = 4;
	
	let a = 84.0 / 2.0;
	let b = 104.0 / 2.0;
	var points = [{x: -a, y: -b}, {x: a, y: -b}, {x: a, y: b}, {x: -a, y: b}];
	Entity.call(this, pos, 45, rnd(0, 2 * Math.PI), 0, 0, fill, "#0000", points, 999999, 14 * (level / 2 + 1), {x: -a, y: -b});
	this.sp = false;
	this.acc = 0;
	this.acc2 = -1.0;
	this.bar = true;
	
	this.update = function(deltaTime) {
		var timeStep = 1.0 / 15.1;
		var timeStep2 = 2.0;
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
			let length = (this.position.x - argi - ship.position.x) ** 2 + (this.position.y - argj - ship.position.y) ** 2;
			if(length < 350 ** 2)
			{	
				var targetDirection = Math.atan2(spaceObjects[0].position.y + argj - this.position.y, spaceObjects[0].position.x + argi - this.position.x);
				this.velocityDirection = -targetDirection;
				this.direction = this.velocityDirection;
			
				this.velocity = 160;
			}
			else
				this.velocity = 0;
			
			this.acc -= timeStep;
		}
		while (this.acc2 >= timeStep2) 
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
			let angle = Math.atan2(spaceObjects[0].position.y + argj - this.position.y, spaceObjects[0].position.x + argi - this.position.x);
			let ast = new Asteroid({
					x: this.position.x + 10 * Math.cos(angle), 
					y: this.position.y + 10 * Math.sin(angle)}, 
					25, 
					angle, 
					rnd(180, 200), 
					angle, 
					boss_projFillStyle, 
					'#0000', 
					7);
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
			
			this.acc2 -= timeStep2;
		}
		Entity.prototype.update.call(this, deltaTime);
	}
}

RangedEnemy.prototype = Object.create(Entity.prototype);


