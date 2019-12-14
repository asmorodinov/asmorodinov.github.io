function Animation(n, w, h, source, speed, x, y, vx, vy)
{
	this.n = n;
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.source = source;
	
	this.remove = false;
	this.speed = speed;
	
	this.acc = 0;
	this.time = 1;
	this.frame = 0;
	
	this.Update = function(deltaTime) {
		this.acc += deltaTime;
		this.time += deltaTime;
		
		while(this.acc > this.speed) {
			this.acc -= this.speed;
			this.frame = (this.frame + 1) % this.n;
			if(this.frame == 0) {
				this.frame = this.n - 1;
				this.remove = true;
			}
		}
		this.x += this.vx * deltaTime;
		this.y += this.vy * deltaTime;
		
	}
	this.Draw = function() {
		if(this.n != 12)
		ctx.globalAlpha = 0.6 / (this.time ** 4);
		ctx.drawImage(this.source, this.frame * this.w, 0, this.w, this.h, this.x - this.w / 2.0, this.y - this.h / 2.0, this.w, this.h);
		ctx.globalAlpha = 1;
	}
}