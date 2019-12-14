function Powerup(w, h, source, x, y, lifeTime)
{
	this.w = w;
	this.h = h;
	this.source = source; //image variables for draw
	
	this.x = x;
	this.y = y;
	this.points = [{x: this.x - this.w / 2.0, y: this.y - this.h / 2}, {x: this.x + this.w / 2.0, y: this.y - this.h / 2}, 
	{x: this.x + this.w / 2.0, y: this.y + this.h / 2}, {x: this.x - this.w / 2.0, y: this.y + this.h / 2}];
	
	this.remove = false;
	
	this.time = 0;
	this.lifeTime = lifeTime;
}

Powerup.prototype.Draw = function() {
	ctx.drawImage(this.source, 0, 0, this.w, this.h, this.x - this.w / 2.0, this.y - this.h / 2.0, this.w, this.h);
	
	ctx.translate(this.x, this.y);
	ctx.translate(-25, -20 - this.h / 2.0);
		
	ctx.fillStyle = "#00000066";
	ctx.strokeStyle = "#00000000";
	ctx.lineWidth = 1;
	ctx.fillRect(0, 0, 50, 10);
	ctx.fillStyle = "#00AA33BB";
	ctx.fillRect(0, 0, 50 * (1 - this.time / this.lifeTime), 10);
	
	ctx.translate(25, 20 + this.h / 2.0);
	ctx.translate(-this.x, -this.y);
}

Powerup.prototype.Intersect = function() {
	for(var i1 = -canvas.width; i1 <= canvas.width; i1 += canvas.width)
		for(var j1 = -canvas.height; j1 <= canvas.height; j1 += canvas.height)
			if(cheapIntersect({x: ship.position.x + i1, y: ship.position.y + j1}, ship.size, {x: this.x, y: this.y}, this.w))
				if(intersect(ship.getVertices({x: ship.position.x + i1, y: ship.position.y + j1}), this.points))
					return true;
	return false;
}

Powerup.prototype.Update = function(deltaTime) {
	this.time += deltaTime;
	
	if(this.time > this.lifeTime)
		this.remove = true;
	
	if(!this.remove && this.Intersect())
		this.Apply();
}

Powerup.prototype.Apply = function() {
	this.remove = true;
	powerupSound.play();
}




function HPBoost(w, h, source, x, y)
{
	Powerup.call(this, w, h, source, x, y, 4);

	this.Apply = function() {
		Powerup.prototype.Apply.call(this);
		ship.hp += 1;
		ship.hp = Math.min(ship.hp, ship.maxHp);
	}
}

HPBoost.prototype = Object.create(Powerup.prototype);


function FireBoost(w, h, source, x, y)
{
	Powerup.call(this, w, h, source, x, y, 7);

	this.Apply = function() {
		Powerup.prototype.Apply.call(this);
		cd += 1.0;
		setTimeout(function(){if(cd >= 2) cd -= 1.0;}, 20000);
	}
}

FireBoost.prototype = Object.create(Powerup.prototype);

function FireBoost2(w, h, source, x, y)
{
	Powerup.call(this, w, h, source, x, y, 7);

	this.Apply = function() {
		Powerup.prototype.Apply.call(this);
		L += 2;
		setTimeout(function(){if(L >= 3) L -= 2;}, 22000);
	}
}

FireBoost2.prototype = Object.create(Powerup.prototype);


