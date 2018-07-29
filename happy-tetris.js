var game = {
	canvas: null,
	pixels: [],
	rows: 20,
	cols: 20,
	pixelSize: 30,
	colors: ["red", "blue", "green", "yellow"],
	// tetrominoes start from top and rotate clockwise.
	tetrominoes: {
		"I": [
			[
				[0, 0, 0, 0],
				[1, 1, 1, 1],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
			],
			[
				[0, 0, 1, 0],
				[0, 0, 1, 0],
				[0, 0, 1, 0],
				[0, 0, 1, 0],
			],
			[
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[1, 1, 1, 1],
				[0, 0, 0, 0],
			],
			[
				[0, 1, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 0],
				[0, 1, 0, 0],
			],
		],
		"O": [
			[
				[1, 1],
				[1, 1],
			],
			[
				[1, 1],
				[1, 1],
			],
			[
				[1, 1],
				[1, 1],
			],
			[
				[1, 1],
				[1, 1],
			],
		],
		"T": [
			[
				[1, 1, 1],
				[0, 1, 0],
				[0, 0, 0],
			],
			[
				[0, 0, 1],
				[0, 1, 1],
				[0, 0, 1],
			],
			[
				[0, 0, 0],
				[0, 1, 0],
				[1, 1, 1],
			],
			[
				[1, 0, 0],
				[1, 1, 0],
				[1, 0, 0],
			],
		],
		"J": [
			[
				[1, 1, 1],
				[0, 0, 1],
				[0, 0, 0],
			],
			[
				[0, 0, 1],
				[0, 0, 1],
				[0, 1, 1],
			],
			[
				[0, 0, 0],
				[1, 0, 0],
				[1, 1, 1],
			],
			[
				[1, 1, 0],
				[1, 0, 0],
				[1, 0, 0],
			],
		],
		"L": [
			[
				[1, 1, 1],
				[1, 0, 0],
				[0, 0, 0],
			],
			[
				[0, 1, 1],
				[0, 0, 1],
				[0, 0, 1],
			],
			[
				[0, 0, 0],
				[0, 0, 1],
				[1, 1, 1],
			],
			[
				[1, 0, 0],
				[1, 0, 0],
				[1, 1, 0],
			]
		],
		"S": [
			[
				[0, 1, 1],
				[1, 1, 0],
				[0, 0, 0],
			],
			[
				[0, 1, 0],
				[0, 1, 1],
				[0, 0, 1],
			],
			[
				[0, 0, 0],
				[0, 1, 1],
				[1, 1, 0],
			],
			[
				[1, 0, 0],
				[1, 1, 0],
				[0, 1, 0],
			],
		],
		"Z": [
			[
				[1, 1, 0],
				[0, 1, 1],
				[0, 0, 0],
			],
			[
				[0, 0, 1],
				[0, 1, 1],
				[0, 1, 0],
			],
			[
				[0, 0, 0],
				[1, 1, 0],
				[0, 1, 1],
			],
			[
				[0, 1, 0],
				[1, 1, 0],
				[1, 0, 0],
			],
		],
	},
	currentTetromino: null,

	start: function () {
		this.currentTetromino = 
		this.drawBackground();
		this.tick();
	},

	tick: function () {
		this.drawPixels();
		this.timeout = window.setTimeout(this.tick.bind(this), 1000);
	},

	randomColor: function () {
		return this.randomElement(this.colors);
	},

	randomElement: function (list) {
		return list[Math.floor(Math.random() * list.length)];
	},

	randomTetromino: function () {
		return this.randomElement(this.tetrominoes);
	},	

	drawBackground: function () {
		this.canvas.fillStyle = "black";
		this.canvas.fillRect(0, 0, this.cols * this.pixelSize, this.rows * this.pixelSize);
	},

	drawPixels: function () {
		if (!this.pixels) {
			return;
		}
		
		var pixel, i, x, y, width, height;
		for (i = 0; i < this.pixels.length; i++) {
			pixel = this.pixels[i];

			x = pixel.x * this.pixelSize;
			y = pixel.y * this.pixelSize;
			width = x + this.pixelSize;
			height = y + this.pixelSize;

			this.canvas.fillStyle = pixel.color;
			this.canvas.fillRect(x, y, width, height);
		}
	},
};

window.onload = function () {
	game.canvas = document.querySelector("canvas").getContext("2d");
	game.start();
};
