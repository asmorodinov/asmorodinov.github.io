var lastUpdate = ( performance || Date ).now();
var dt = 0;

var dif = 1;
var dif2 = 2;
var level = 0;

var Imgs = {};

var fillStyle;
var shipFillStyle;
var ship_normFillStyle;
var bulletFillStyle;
var hom_bulletFillStyle;
var boss_projFillStyle;

var bulletSound; 
var powerupSound;
var explosionSound;
var selectionSound;
var thrust_s;
var ost;

var loadedAudio = false;

canvas.addEventListener('click', function() {
	if(!loadedAudio)
	{
		bulletSound = new Howl({src: ["asteroids/Assets/laser.wav"], volume: 0.01});
		powerupSound = new Howl({src: ["asteroids/Assets/powerup.wav"], volume: 0.3});
		explosionSound = new Howl({src: ["asteroids/Assets/explosion.wav"], volume: 0.05});
		selectionSound = new Howl({src: ["asteroids/Assets/select.wav"], volume: 0.9});
		thrust_s = new Howl({src: ["asteroids/Assets/thrust.flac"], volume: 0.0, loop: true, sprite: {main: [0, 3100, true]}});
		ost = new Howl({src: ["asteroids/Assets/ost.wav"], volume: 0.8, loop: true, html5: false});
		
		loadedAudio = true;
		
		ost.volume(vol * v4);
		ost.play();
		bulletSound.volume(vol2 * v1); 
		powerupSound.volume(vol2 * v2); 
		explosionSound.volume(vol2 * v3);
		selectionSound.volume(vol2 * v5);
	
	}
});

//window.onload = function() {
//	setTimeout(function(){initImages();}, 1000);
//}

var v1 = 0.2;
var v2 = 1.0;
var v3 = 0.3;
var v4 = 1.0;
var v5 = 0.4;

//ost.on('load', function(){
//  setTimeout(function(){ost.play();}, 1000);
//});

var cooling = 0;

var paused = false;

var ship;
var spaceObjects = [];
var animations = [];
var powerups = [];

var buttons = [];
var choices = [];

var bckg;

var vol = 0.5;
var vol2 = 0.1;

var GameState = {
    MainMenu: 0,
	Settings: 1,
	Game: 2,
	GameOver: 3,
	Choosing: 4
};

var gameState = GameState.MainMenu;

var mx = 0;
var my = 0;

var frameCnt = 0;
var time0 = Date.now();

var prevTime = ( performance || Date ).now();
var fps = 0;

var cd = 1.0;
var sz = 1.0;
var sz2 = 1.0;
var sp = 1.0;
var ch = 0.0;
var ch2 = 0.0;
var ch3 = 0.0;

var inv = 0;
var pen = 1;
var dang = 0.05;

var rem = false;
var K = 3;
var L = 1;

var thrust = false;

var acc = 0;

var muted = false;
  
function initImages() {
	var fileNames = ["asteroid.png", "ship.png", "background.png", "buttons/button3.png",
	"buttons/button4.png", "buttons/button5.png", "buttons/button_hov3.png", "buttons/button_hov4.png", "buttons/button_hov5.png",
	"buttons/button10.png", "buttons/button_hov10.png", "boss.png", "bullet.png", "hom_bullet.png", 
	"boss_proj.png", "ship_norm.png", "Explosion.png", "smoke.png", "hp.png", "fire.png", "Explosion2.png", "enemyBlue1.png", "enemyGreen2.png", "fire2.png"];
	
	var names = ["ast", "ship", "bckg", "menu", "up", "down", "menu_h", "up_h", "down_h", "btn", "btn_h", "boss", "bullet", "h_bullet", "b_bullet", "ship_n", "expl", "trail", 
	"hp", "fire", "expl2", "enem", "enem2", "fire2"];
	
	var loaded = fileNames.length;
	for(var i = 0; i < fileNames.length; ++i) {
		var img = new Image();
		img.src = "asteroids/Assets/" + fileNames[i];
		img.onload = function() {if(!--loaded) initGame()};
		Imgs[names[i]] = img;
	}
}

function resetGame() {
	paused = false;
	
	dif = 1;
	dif2 = 2;
	level = 0;
	cooling = 0;
	cd = 1.0;
	sz = 1.0;
	sz2 = 1.0;
    sp = 1.0;
	ch = 0.0;
	ch2 = 0.0;
	ch3 = 0.0;
	K = 3;
	L = 1;
	
	inv = 0;
	pen = 1;
	dang = 0.05;

	spaceObjects = [];
	animations = [];
	powerups = [];
	
	ship = new Ship({x: canvas.width / 2.0, y: canvas.height / 2.0}, 50, rnd(0, 2 * Math.PI), 0, 0, shipFillStyle, '#0000');
	ship.hp = 3;
	ship.maxHp = 3;
	ship.bar = true;
	
	spaceObjects.push(ship);

	newLevel();
}

function initGame() {	
	fillStyle = ctx.createPattern(Imgs.ast, "repeat");
	shipFillStyle = ctx.createPattern(Imgs.ship, "repeat");
	ship_normFillStyle = ctx.createPattern(Imgs.ship_n, "repeat");
	bulletFillStyle = ctx.createPattern(Imgs.bullet, "repeat");
	hom_bulletFillStyle = ctx.createPattern(Imgs.h_bullet, "repeat");
	boss_projFillStyle = ctx.createPattern(Imgs.b_bullet, "repeat");
	bckg = ctx.createPattern(Imgs.bckg, "repeat");
	
	resetGame();

	buttons.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 - 80,  w: 480, h: 90, txt: function() { return "Continue";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"),   func: function() {gameState = GameState.Game; paused = false;}, cond: function() {return gameState == GameState.MainMenu;} });
	buttons.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 40,  w: 480, h: 90, txt: function() { return "Start Game";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {gameState = GameState.Game; resetGame();}, cond: function() {return gameState == GameState.MainMenu;} });
	buttons.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 160, w: 480, h: 90, txt: function() { return "Settings";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"),   func: function() {setTimeout(function(){gameState = GameState.Settings;}, 50);}, cond: function() {return gameState == GameState.MainMenu;} });
		
		
	buttons.push({state: 0, x: 100, y: canvas.height - 24, w: 200, h: 48, txt: function() { return "Menu";}, fill: ctx.createPattern(Imgs.menu, "repeat"), fillHover: ctx.createPattern(Imgs.menu_h, "repeat"), func: function() {gameState = GameState.MainMenu; /*resetGame();*/}, cond: function() {return gameState == GameState.Game || gameState == GameState.Settings || gameState == GameState.GameOver || gameState == GameState.Choosing;} });
		
	buttons.push({state: 0, x: canvas.width / 2 + 220, y: canvas.height / 2 - 84 - 42, w: 128, h: 64, txt: function() { return "";}, fill: ctx.createPattern(Imgs.up, "repeat"), fillHover: ctx.createPattern(Imgs.up_h, "repeat"), func: function() {if(vol <= 0.9){ vol += 0.1; ost.volume(vol * v4); } }, cond: function() {return gameState == GameState.Settings} });
	buttons.push({state: 0, x: canvas.width / 2 + 220, y: canvas.height / 2 - 42, w: 128, h: 64, txt: function() { return "";}, fill: ctx.createPattern(Imgs.down, "repeat"), fillHover: ctx.createPattern(Imgs.down_h, "repeat"), func: function() {if(vol >= 0.1){ vol -= 0.1; ost.volume(vol * v4); } }, cond: function() {return gameState == GameState.Settings} });
	
	buttons.push({state: 0, x: canvas.width / 2 + 220, y: canvas.height / 2 - 42 + 84, w: 128, h: 64, txt: function() { return "";}, fill: ctx.createPattern(Imgs.up, "repeat"), fillHover: ctx.createPattern(Imgs.up_h, "repeat"), func: function() {if(vol2 <= 0.9){ vol2 += 0.1; bulletSound.volume(vol2 * v1); powerupSound.volume(vol2 * v2); explosionSound.volume(vol2 * v3); selectionSound.volume(vol2 * v5);} }, cond: function() {return gameState == GameState.Settings} });
	buttons.push({state: 0, x: canvas.width / 2 + 220, y: canvas.height / 2 - 42 + 84 * 2, w: 128, h: 64, txt: function() { return "";}, fill: ctx.createPattern(Imgs.down, "repeat"), fillHover: ctx.createPattern(Imgs.down_h, "repeat"), func: function() {if(vol2 >= 0.1){ vol2 -= 0.1; bulletSound.volume(vol2 * v1); powerupSound.volume(vol2 * v2); explosionSound.volume(vol2 * v3); selectionSound.volume(vol2 * v5);} }, cond: function() {return gameState == GameState.Settings} });
		
	buttons.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 84 * 3 - 24, w: 480, h: 90, txt: function() { return muted ? "Unmute" : "Mute";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {muted = !muted; Howler.mute(muted); }, cond: function() {return gameState == GameState.Settings} });
		
		
		
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 - 180, w: 480, h: 90, txt: function() { return "+15% reload speed"; }, fill : ctx.createPattern(Imgs.btn, "repeat"), fillHover : ctx.createPattern(Imgs.btn_h, "repeat"),
		func : function() {
			gameState = GameState.Game; 
			paused = false; 
			cd += 0.15; 
			rem = true;
		},
		cond : function() {
			return gameState == GameState.Choosing;
		}
		});
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 - 60,  w: 480, h: 90, txt: function() { return "+1 Max HP";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {
		gameState = GameState.Game; 
		paused = false; 
		ship.maxHp += 1;
		ship.hp += 1;
		rem = true;
		}, cond: function() {
			return gameState == GameState.Choosing;
		}});
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 60,  w: 480, h: 90, txt: function() { return "+30% bullet lifetime";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {
		gameState = GameState.Game; 
		paused = false; 
		sz += 0.3; 
		
		rem = true;
		}, cond: function() {
			return gameState == GameState.Choosing;
		}});
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 180, w: 480, h: 90, txt: function() { return "+1 penetration";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {
		gameState = GameState.Game; 
		paused = false; 
		pen += 1;
		rem = true;
		}, cond: function() {
			return gameState == GameState.Choosing;
		}});
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 180, w: 480, h: 90, txt: function() { return "+20% move speed";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {
		gameState = GameState.Game; 
		paused = false; 
		sz2 += 0.2;
		//gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, 10 * sz2);
		//gradient.addColorStop(0, '#cecd');           
		//gradient.addColorStop(1, '#353d');

		//gradient3 = ctx.createRadialGradient(0, 0, 1, 0, 0, 10 * sz2);
		//gradient3.addColorStop(0, '#eccd');           
		//gradient3.addColorStop(1, '#533d');
		
		rem = true;
		}, cond: function() {
			return gameState == GameState.Choosing;
		}});
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 180, w: 480, h: 90, txt: function() { return "+25% bullet speed";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {
		gameState = GameState.Game; 
		paused = false; 
		sp += 0.25;
		
		rem = true;
		}, cond: function() {
			return gameState == GameState.Choosing;
		}});
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 180, w: 480, h: 90, txt: function() { return "+" + Math.floor(20 * (1 - ch)).toString() + "% to fire homing bullet";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {
		gameState = GameState.Game; 
		paused = false; 
		ch += 0.2 * (1 - ch); // ch = 0.2 + 0.8 * (0.2 + 0.8 * (0.2 + 0.8 * 0.2)) = 0.2 * (1 + 0.8 + 0.8 * 0.8 + ...) = 0.2 * 
		
		rem = true;
		}, cond: function() {
			return gameState == GameState.Choosing;
		}, upd: function() {
			
		}
		});
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 180, w: 480, h: 90, txt: function() { return "+" + Math.floor(15 * (1 - ch2)).toString() + "% to duplicate bullet";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {
		gameState = GameState.Game; 
		paused = false; 
		ch2 += 0.15 * (1 - ch2); // ch = 0.2 + 0.8 * (0.2 + 0.8 * (0.2 + 0.8 * 0.2)) = 0.2 * (1 + 0.8 + 0.8 * 0.8 + ...) = 0.2 * 
		
		rem = true;
		}, cond: function() {
			return gameState == GameState.Choosing;
		}, upd: function() {
			
		}
		});	
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 180, w: 480, h: 90, txt: function() { return "+" + Math.floor(15 * (1 - ch3)).toString() + "% to dodge";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {
		gameState = GameState.Game; 
		paused = false; 
		ch3 += 0.15 * (1 - ch3); // ch = 0.2 + 0.8 * (0.2 + 0.8 * (0.2 + 0.8 * 0.2)) = 0.2 * (1 + 0.8 + 0.8 * 0.8 + ...) = 0.2 * 
		
		rem = true;
		}, cond: function() {
			return gameState == GameState.Choosing;
		}, upd: function() {
			
		}
		});	
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 180, w: 480, h: 90, txt: function() { return "+1 choice";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {
		gameState = GameState.Game; 
		paused = false; 
		setTimeout(function(){if(K < choices.length) K += 1;}, 100); 
		
		rem = true;
		}, cond: function() {
			return gameState == GameState.Choosing;
		}, upd: function() {
			
		}
		});
	choices.push({state: 0, x: canvas.width / 2, y: canvas.height / 2 + 180, w: 480, h: 90, txt: function() { return "+50% reload, -25% move speed";}, fill: ctx.createPattern(Imgs.btn, "repeat"), fillHover: ctx.createPattern(Imgs.btn_h, "repeat"), func: function() {
		gameState = GameState.Game; 
		paused = false; 
		sz2 -= 0.25;
		cd += 0.5;
		//gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, 10 * sz2);
		//gradient.addColorStop(0, '#cecd');           
		//gradient.addColorStop(1, '#353d');

		//gradient3 = ctx.createRadialGradient(0, 0, 1, 0, 0, 10 * sz2);
		//gradient3.addColorStop(0, '#eccd');           
		//gradient3.addColorStop(1, '#533d');
		
		rem = true;
		}, cond: function() {
			return gameState == GameState.Choosing;
		}});
	
	gameLoop();
	
}

function drawBackground() {
	ctx.beginPath();
	ctx.fillStyle = bckg;
	ctx.rect(0, 0, canvas.width, canvas.height);
	
	ctx.closePath();
	ctx.fill();
}

function drawButtons() {
	for(var i = 0; i < buttons.length; ++i) {
		var btn = buttons[i];
		if(btn.cond()) {
			ctx.translate(btn.x - btn.w / 2, btn.y - btn.h / 2);
			ctx.beginPath();
			
			if(btn.state == 0)
				ctx.fillStyle = btn.fill;
			else if(btn.state == 1)
				ctx.fillStyle = btn.fillHover;
			
			ctx.rect(0, 0, btn.w, btn.h);
			ctx.fill();
			ctx.closePath();		
			ctx.translate(-btn.x + btn.w / 2, -btn.y + btn.h / 2);
	
	
			ctx.font = '30px FR73PixelW00-Regular';	
			if(btn.state == 0)
				ctx.fillStyle = "#33CCCC";
			if(btn.state == 1)
				ctx.fillStyle = "#11AAAA";
			ctx.textBaseline = 'middle';
			ctx.textAlign = "center"; 
			ctx.fillText(btn.txt(), btn.x, btn.y);
			ctx.textAlign = "start"; 
		}
	}
}

function newLevel() {
	if(level % 4 == 3) {
		spaceObjects.push(new Boss(ctx.createPattern(Imgs.boss, "repeat")));
		spaceObjects[spaceObjects.length - 1].bar = true;
	} else {
		for(var i = 0; i < dif; ++i) {
			var angle = rnd(0, 2 * Math.PI);
			var l = rnd(380, 400);
			spaceObjects.push(new Asteroid({x: ship.position.x + l * Math.cos(angle), y: ship.position.y + l * Math.sin(angle)}, 100, rnd(0, 2 * Math.PI), rnd(35, 45), rnd(0, 2 * Math.PI), fillStyle, '#777d', 99999));
			
			angle = rnd(0, 2 * Math.PI);
			l = rnd(380, 400);
			if(Math.random() < 0.55)
				spaceObjects.push(new MeleeEnemy({x: ship.position.x - l * Math.cos(angle), y: ship.position.y - l * Math.sin(angle)}, ctx.createPattern(Imgs.enem, "repeat")));
			
			angle = rnd(0, 2 * Math.PI);
			l = rnd(380, 400);
			if(Math.random() < 0.55)
				spaceObjects.push(new RangedEnemy({x: ship.position.x - l * Math.cos(angle), y: ship.position.y - l * Math.sin(angle)}, ctx.createPattern(Imgs.enem2, "repeat")));
			
		}
	}
	if(!(level == 1 || level % 4 == 3))
		++dif;
	++level;
	if(dif % 5 == 0) {
		dif = 1;
		++dif2;
	}
	
	if(level >= 2) {
		paused = true;
		gameState = GameState.Choosing;
		
		shuffle(choices);
	
		let sp = canvas.height * 0.75 / K;
		for(let i = 0; i < K; ++i) {
			let btn = choices[i];
			btn.x = canvas.width / 2;
			
			btn.y = canvas.height / 2 + (i - (K - 1) / 2.0) * sp;
			
			buttons.push(btn);
		}
	}
}

function gameLoop() {
	
	var now = ( performance || Date ).now();
    dt = Math.min((now - lastUpdate) * 0.001, 1.0 / 20.0);
	++frameCnt;
	
	
	if ( now > prevTime + 500 ) {
		fps = frameCnt * 1000.0 / (now - prevTime);
		prevTime = now;
		frameCnt = 0;
	}
	
    lastUpdate = now;
	
	if(gameState != GameState.GameOver){
		for(var i = 0; i < buttons.length; ++i) {
			var btn = buttons[i];
			if(btn.cond() && btn.state != 2){
				if ((mx > btn.x - btn.w / 2.0) && (mx < btn.x + btn.w / 2.0) && (my > btn.y - btn.h / 2.0) && (my < btn.y + btn.h / 2.0)) {
					if(btn.state == 0 && loadedAudio)
						selectionSound.play();
					btn.state = 1;
				} else {
					btn.state = 0;
				}
			}
		}
	}
	
	if(paused)
		dt = 0;
	
	
	if(rem)
	{
		rem = false;
		for(let i = 0; i < K; ++i)
			buttons.pop();
	}
	
	if(gameState == GameState.MainMenu || gameState == GameState.Settings) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		
		
		ctx.font = '60px FR73PixelW00-Regular';
		
		ctx.fillStyle = "#44CC44";
		ctx.textAlign = "center"; 
		if(gameState == GameState.MainMenu) {
			ctx.fillText("Asteroids", canvas.width / 2, 80);
		} else {
			ctx.fillText("Settings", canvas.width / 2, 80);
			
			ctx.fillText("Music: " + Math.round(vol * 100) + "%", canvas.width / 2 - 80, canvas.height / 2 - 42 - 42);
			ctx.fillText("Sound: " + Math.round(vol2 * 100) + "%", canvas.width / 2 - 80, canvas.height / 2 + 126 - 42);
		}
		ctx.textAlign = "start"; 
		
		
	} else if(gameState == GameState.Game || gameState == GameState.Choosing) {
		
		cooling -= dt;
		inv -= dt;
		if(cooling <= -0.001)
			cooling = 0;
		if(inv <= -0.001)
			inv = 0;
		
		if(!paused && ship.hp > 0) {
			if(Key.isDown(Key.UP) || Key.isDown(Key.W)) {
				var velVectx = ship.velocity * Math.cos(ship.velocityDirection);
				var velVecty = ship.velocity * Math.sin(ship.velocityDirection);
				var dirVectx = Math.cos(ship.direction);
				var dirVecty = Math.sin(ship.direction);
				velVectx += 100 * sz2 * dt * dirVectx;
				velVecty += 100 * sz2 * dt * dirVecty;
				
				ship.velocity = Math.sqrt(velVectx * velVectx + velVecty * velVecty);
				ship.velocityDirection = Math.atan2(velVecty, velVectx);
				
				if(!thrust)
				{
					thrust_s.play('main');
					setTimeout(function(){thrust = false; thrust_s.stop();}, 3100);
				}
				thrust = true;
				acc += dt;
				while(acc >= 1.0 / 90.0)
				{
					animations.push(new Animation(9, 32, 32, Imgs.trail, 1.0 / 21.0, ship.position.x - Math.cos(ship.direction) * 15, ship.position.y - Math.sin(ship.direction) * 15, -Math.cos(ship.direction) * 200, -Math.sin(ship.direction) * 200));
					acc -= 1.0 / 90.0;
				}
				
			} else {
				thrust = false;
				thrust_s.stop();
			}
			if(Key.isDown(Key.DOWN) || Key.isDown(Key.S)) {
				var velVectx = ship.velocity * Math.cos(ship.velocityDirection);
				var velVecty = ship.velocity * Math.sin(ship.velocityDirection);
				var dirVectx = Math.cos(ship.direction);
				var dirVecty = Math.sin(ship.direction);
				velVectx -= 100 * sz2 * dt * dirVectx;
				velVecty -= 100 * sz2 * dt * dirVecty;
				
				ship.velocity = Math.sqrt(velVectx * velVectx + velVecty * velVecty);
				ship.velocityDirection = Math.atan2(velVecty, velVectx);
			} if(Key.isDown(Key.LEFT) || Key.isDown(Key.A)) {
				ship.direction -= 1 * sz2 * dt;
				ship.directionVelocity -= 4 * sz2 * dt;
			} if(Key.isDown(Key.RIGHT) || Key.isDown(Key.D)) {
				ship.direction += 1 * sz2 * dt;
				ship.directionVelocity += 4 * sz2 * dt;
			} if((Key.isDown(Key.SPACE) || Key.isDown(Key.Enter)) && cooling <= 0.001) {
				let pos = {x: ship.position.x + Math.cos(ship.direction) * 35, y: ship.position.y + Math.sin(ship.direction) * 35};
				
				let r = dang * rnd(-1, 1);
				for(let i = 0; i < L; ++i) {
					let r1 = r + (i - (L - 1) / 2.0) * 0.15;
					if(Math.random() < 1.0 - ch) {
						var bullet = new Bullet(pos, 10 * sz2, 0, 300 * sp, ship.direction + r1, bulletFillStyle, '#3530', 5 * sz, pen);
						spaceObjects.push(bullet);
						while(Math.random() < ch2) {
							let r2 = dang * rnd(-1, 1) * 0.5;
							var bullet = new Bullet(pos, 10 * sz2, 0, 300 * sp, ship.direction + r1 + r2, bulletFillStyle, '#3530', 5 * sz, pen);
							spaceObjects.push(bullet);
						}
							
					} else {
						var bullet = new HomingBullet(pos, 15 * sz2, 0, 250 * sp, ship.direction + r1, hom_bulletFillStyle, '#3530', 5 * sz, spaceObjects, pen);
						spaceObjects.push(bullet);
						while(Math.random() < ch2) {
							let r2 = dang * rnd(-1, 1) * 0.5;
							var bullet = new HomingBullet(pos, 15 * sz2, 0, 250 * sp, ship.direction + r1 + r2, hom_bulletFillStyle, '#3530', 5 * sz, spaceObjects, pen);
							spaceObjects.push(bullet);
						}
					}
				}
				cooling = 0.3 / cd;
				bulletSound.play();
			}
		}
		
		canvas.width = canvas.width;
		
		drawBackground();
		
		
		var astCount = 0;
		var intersected = false;
		
		for(var j = 0; j < powerups.length; ++j) {
			powerups[j].Update(dt);
			powerups[j].Draw();
		}
		
		for(var j = 0; j < spaceObjects.length; ++j) {
			spaceObjects[j].update(dt);
			spaceObjects[j].draw();
		}
		
		for(var j = 0; j < animations.length; ++j) {
			animations[j].Update(dt);
			animations[j].Draw();
		}
		
		
		if(spaceObjects.length > 0)
		spaceObjects[0].draw();
		
		for(var j = 1; j < spaceObjects.length; ++j)
			astCount += (spaceObjects[j].type == 0);
		
		for(var j = 1; j < spaceObjects.length; ++j)
			if(spaceObjects[j].type == 0)
				for(var i1 = -canvas.width; i1 <= canvas.width; i1 += canvas.width)
					for(var j1 = -canvas.height; j1 <= canvas.height; j1 += canvas.height)
						if(cheapIntersect({x: spaceObjects[j].position.x + i1, y: spaceObjects[j].position.y + j1}, spaceObjects[j].size, spaceObjects[0].position, spaceObjects[0].size))
							if(intersect(spaceObjects[j].getVertices({x: spaceObjects[j].position.x + i1, y: spaceObjects[j].position.y + j1}), ship.getVertices(ship.position)))
								intersected = true;
		
		
		for(var i1 = -canvas.width; i1 <= canvas.width; i1 += canvas.width)
			for(var j1 = -canvas.height; j1 <= canvas.height; j1 += canvas.height) {
				var breaked = true;
				var next = false;
				
				//arr and arr2 data structure - const = O(1) = 1000
				var arr = [];
				let maxSize = 100.0;
				let w = Math.ceil(3 * canvas.width / maxSize);
				let h = Math.ceil(3 * canvas.height / maxSize);
				for(let i = 0; i < w; ++i) {
					let miniArr = [];
					for(let j = 0; j < h; ++j) {
						miniArr.push([]);
					}
					arr.push(miniArr);
				}
				
				var arr2 = [];
				
				
				for(let i = 1; i < spaceObjects.length; ++i) { // push asteroids into arr data structure and bullets into arr2 data structure O(n + m)
					if(spaceObjects[i].type == 0) { // asteroid
						let x = Math.floor((spaceObjects[i].position.x + i1 + canvas.width) / maxSize);
						let y = Math.floor((spaceObjects[i].position.y + j1 + canvas.height) / maxSize);
						arr[x][y].push(i);
					}
					if(spaceObjects[i].type == 1) { // bullet
						let x = Math.floor((spaceObjects[i].position.x + canvas.width) / maxSize);
						let y = Math.floor((spaceObjects[i].position.y + canvas.height) / maxSize);
						arr2.push([i, x, y]);
					}
				}
				
					for(let i = 0; i < arr2.length; ++i) {// for all bullets
						for(let x = Math.max(arr2[i][1] - 1, 0); x <= Math.min(arr2[i][1] + 1, w - 1); ++x) // for all its "neighbours"       //actual detection when points are sparse
							for(let y = Math.max(arr2[i][2] - 1, 0); y <= Math.min(arr2[i][2] + 1, h - 1); ++y) {                             //instead of O(n * m) we get ~ O(n * (m / 1000))
								for(let j = 0; j < arr[x][y].length; ++j) {
									let k = arr[x][y][j];
									let l = arr2[i][0];
									if(!spaceObjects[l].remove && !spaceObjects[k].remove && cheapIntersect({x: spaceObjects[k].position.x + i1, y: spaceObjects[k].position.y + j1}, spaceObjects[k].size, spaceObjects[l].position, spaceObjects[l].size)) {
										spaceObjects[k].hp -= 1;
										spaceObjects[l].hp -= 1;
										
										if(spaceObjects[k].hp <= 0){
											if(Math.random() < 0.015 / (level ** 0.4))
												powerups.push(new HPBoost(32, 32, Imgs.hp, spaceObjects[l].position.x, spaceObjects[l].position.y));
											else if(Math.random() < 0.02 / (level ** 0.4))
												powerups.push(new FireBoost(32, 32, Imgs.fire, spaceObjects[l].position.x, spaceObjects[l].position.y));
											else if(Math.random() < 0.02 / (level ** 0.4))
												powerups.push(new FireBoost2(32, 32, Imgs.fire2, spaceObjects[l].position.x, spaceObjects[l].position.y));
										}
										
										animations.push(new Animation(12, 64, 64, Imgs.expl, 1.0 / 18.0, spaceObjects[l].position.x, spaceObjects[l].position.y, 0, 0));
										explosionSound.play();
										
										if(spaceObjects[k].hp <= 0) {
											spaceObjects[k].remove = true;
											if(spaceObjects[k].size >= 25 && spaceObjects[k].lifeTime > 9999 && spaceObjects[k].sp) {
												for(var n = 0; n < dif2; ++n) {
													spaceObjects.push(new Asteroid(spaceObjects[k].position, spaceObjects[k].size / 2, rnd(0, 2 * Math.PI), rnd(35, 45), rnd(0, 2 * Math.PI), fillStyle, "#777d", 99999));
													let x = Math.floor((spaceObjects[spaceObjects.length - 1].position.x + i1 * 0) / maxSize);
													let y = Math.floor((spaceObjects[spaceObjects.length - 1].position.y + j1 * 0) / maxSize);
													arr[x][y].push(spaceObjects.length - 1);
												}
											}
											
										}
										if(spaceObjects[l].hp <= 0)
											spaceObjects[l].remove = true;
										
									}
								}
							}
								
					}
			}
		
		ctx.font = '18px FR73PixelW00-Regular';
		ctx.fillStyle = "#33CCCC";
		ctx.textAlign = "start"; 
		ctx.fillText("Level: "+level, canvas.width-105, 17);
		ctx.fillText("FPS: "+Math.round(fps), 0, 17);
		
		if(inv >= 0.01)
			ctx.fillText("HP: " + Math.round(ship.hp) + " / " + Math.round(ship.maxHp) + " " + Math.round(inv), 0, 41);
		else
			ctx.fillText("HP: " + Math.round(ship.hp) + " / " + Math.round(ship.maxHp), 0, 41);
		
		if(intersected && inv <= 0.0001) {
			ship.hp -= 1;
			if(Math.random() < ch3)
				ship.hp += 1;
			
			if(ship.hp <= 0) {
				setTimeout(function(){
					paused = true;
					gameState = GameState.GameOver;
					
					ctx.font = '60px FR73PixelW00-Regular';
					ctx.fillStyle = "#44CC44";
					ctx.textAlign = "center"; 
			
					ctx.fillText("You Lose!", canvas.width / 2, 80);
					
					ctx.font = '30px FR73PixelW00-Regular';
					
					ctx.fillText("Click anywhere to go to menu", canvas.width / 2, 150);
					ctx.textAlign = "start"; 
					explosionSound.volume(0.1);
				}, 1500);
				animations.push(new Animation(12, 768, 768, Imgs.expl2, 1.0 / 8.1, ship.position.x, ship.position.y, 0, 0));
				spaceObjects = [];
				explosionSound.volume(1.0 * vol2);
				explosionSound.play();
				
			
			} else {
				inv = 5;
			}
		}
		
		if(astCount == 0 && ship.hp > 0) {
			newLevel();
		}
		spaceObjects.removeIf(function(object, i) {return object.remove;});
		buttons.removeIf(function(object, i) {return object.state == 2;});
		animations.removeIf(function(object, i) {return object.remove;});
		powerups.removeIf(function(object, i) {return object.remove;});
	}
	drawButtons();
	
	if(!loadedAudio)
	{
		ctx.font = '36px FR73PixelW00-Regular';
		ctx.fillStyle = "#EE4444";
		//ctx.textAlign = "start";
		ctx.textAlign = "center"; 
		ctx.fillText("Please click anywhere to allow sounds", canvas.width / 2, 150);
	}
	//stats.end();
	requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', function(event) { 
	if(!loadedAudio)
		return;
	if(gameState != GameState.GameOver){
		for(var i = 0; i < buttons.length; ++i) {
			var btn = buttons[i];
			if(btn.cond()){
				if ((event.offsetX > btn.x - btn.w / 2.0) && (event.offsetX < btn.x + btn.w / 2.0) && (event.offsetY > btn.y - btn.h / 2.0) && (event.offsetY < btn.y + btn.h / 2.0)) {
					btn.func();
				}
			}
		}
	}
	if(gameState == GameState.GameOver) {
		gameState = GameState.MainMenu;
		resetGame();
	} 
});

canvas.addEventListener('mousemove', function(event) { 
	mx = event.offsetX;
	my = event.offsetY;
});

initImages();
//initGame();