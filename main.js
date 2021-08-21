var map = new Map(128, 8); //size, cellSize
var seed = parseInt(Math.random() * 10000000);

map.generateMap(seed, 16); //seed, zoom
map.render();
//map.printTiles();



/*
 *		Class Map
 *	  How to use : 
 *   1. Instanciation of map : var map = new Map(myWidth, myHeight, myCellSize);
 *   2. Generate the map : map.generateMap(mySeed, myZoom);
 *   3. Render the map : map.render();
 */
function Map(mapSize, cellSize) {
  this.width = mapSize;
  this.height = mapSize;
  this.cellSize = cellSize;

  this.tiles = [];

  this.generateNoise = function(seed) {
    var x = 0.0;

    for (i = 0; i < this.width; i++) {
      this.tiles[i] = new Array(this.height)
      for (j = 0; j < this.height; j++) {
        x = Math.sin(seed++) * 10000;
        this.tiles[i][j] = x - Math.floor(x);
      }
    }
  }

  this.smoothNoise = function(x, y) {
    var fractX = x - parseInt(x);
    var fractY = y - parseInt(y);

    x1 = parseInt(parseInt(parseInt(x) + this.width) % this.width);
    y1 = parseInt(parseInt(parseInt(y) + this.height) % this.height);

    x2 = parseInt((x1 + this.width - 1) % this.width)
    y2 = parseInt((y1 + this.height - 1) % this.height)

    var value = 0.0
    value += fractX * fractY * this.tiles[y1][x1]
    value += (1 - fractX) * fractY * this.tiles[y1][x2]
    value += fractX * (1 - fractY) * this.tiles[y2][x1]
    value += (1 - fractX) * (1 - fractY) * this.tiles[y2][x2]

    return parseFloat(value);
  }

  this.turbulence = function(x, y, size) {
    var value = 0.0
    var initSize = size;

    while (size >= 1) {
      value += this.smoothNoise(x / size, y / size) * size
      size /= 2.0;
    }

    return 1.0 * value / (2.0 * initSize)
  }

  this.generateMap = function(seed, size) {
    this.generateNoise(seed);
    var oldTiles = new Array(this.width);
    for (i = 0; i < this.width; i++) {
      oldTiles[i] = new Array(this.height);
      for (j = 0; j < this.height; j++) {
        oldTiles[i][j] = this.turbulence(i, j, size);
      }
    }
    this.tiles = oldTiles;
  }

  this.render = function() {
    var canvas = document.getElementById('tuto');
    canvas.width = this.width * this.cellSize;
    canvas.height = this.height * this.cellSize;
    var ctx = canvas.getContext('2d');
    canvas.style.border = "1px solid black";
    ctx.clearRect(0, 0, this.width, this.height);

    for (i = 0; i < this.width; i++) {
      for (j = 0; j < this.height; j++) {
        if (this.tiles[i][j] < 0.2) {
          ctx.fillStyle = "rgb(0,0,255)";
        } else if (this.tiles[i][j] < 0.4) {
          ctx.fillStyle = "rgb(0,255,0)";
        } else if (this.tiles[i][j] < 0.6) {
          ctx.fillStyle = "rgb(255,190,0)";
        } else if (this.tiles[i][j] < 0.8) {
          ctx.fillStyle = "rgb(255,128,0)";
        } else {
          ctx.fillStyle = "rgb(255,0,0)";
        }
        ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }

  this.printTiles = function() {
    var st = "";
    for (i = 0; i < this.width; i++) {
      for (j = 0; j < this.height; j++) {
        if (j == 0) {
          st += "" + Math.round(this.tiles[i][j] * 10000) / 10000;
        } else {
          st += ", " + Math.round(this.tiles[i][j] * 10000) / 10000;
        }
      }
      st += "<br/>"
    }
    var printDiv = document.getElementById('print');
    printDiv.innerHTML = st;
  }
};
