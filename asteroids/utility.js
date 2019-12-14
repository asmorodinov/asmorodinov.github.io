var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

document.getElementById('mn').style.width = (window.innerWidth - 20).toString() + "px";
document.getElementById('mn').style.height = (window.innerHeight - 20).toString() + "px";
document.body.style.backgroundColor = "#555577";

canvas.width = document.getElementById('pg').offsetWidth;
canvas.height = document.getElementById('pg').offsetHeight;


Array.prototype.removeIf = function(callback) {
    var i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};

function rnd(a, b) {
	return (Math.random() * (b - a) + a);
}

function cheapIntersect(pos, r, pos2, r2) {
	var len = (pos.x - pos2.x) ** 2 + (pos.y - pos2.y) ** 2;
	
	return len < (r + r2) ** 2;
}

function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(obj[i] != null &&  typeof(obj[i])=="object")
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
}

var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  D: 68,
  W: 87,
  A: 65,
  S: 83,
  Enter: 13,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

document.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
document.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);