var game = {
	canvas: null,
	cols: 20,
	rows: 20,
	pixelSize: 20, // canvas.width / cols
	colors: ["red", "blue", "green", "yellow"],
	tetrominoes: ["I", "O", "T", "J", "L", "S", "Z"],
	tetrominoPixels: {
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
	tetromino: null,

	start: function (canvas) {
		this.c = canvas.getContext("2d");
		this.tetromino = this.randomTetromino();
		this.tick();
	},

	tick: function () {
		this.draw();
		this.moveTetromino();
		this.timeout = window.setTimeout(this.tick.bind(this), 1000);
	},

	draw: function () {
		this.drawBackground();
		this.drawGrid();
		this.drawTetromino();
	},

	moveTetromino: function () {
		this.tetromino.row = this.tetromino.row + 1;
	},

	randomTetromino: function () {
		var tetromino = this.randomElement(this.tetrominoes),
			pixels = this.tetrominoPixels[tetromino];

		return {
			color: this.randomElement(this.colors),
			tetromino: tetromino,
			direction: 0, // 0-3
			col: Math.floor(this.cols / 2) - Math.floor(pixels[0][0].length / 2),
			row: 0,
		};
	},

	randomElement: function (list) {
		return list[Math.floor(Math.random() * list.length)];
	},

	drawBackground: function () {
		this.c.fillStyle = "black";
		this.c.fillRect(0, 0, this.cols * this.pixelSize, this.rows * this.pixelSize);
	},

	drawGrid: function () {
		this.c.strokeStyle = "white";
		this.c.lineWidth = 1;
		this.c.beginPath();
		
		for (var row = 0; row < this.rows; row++) {
			this.c.moveTo(0, row * this.pixelSize);
			this.c.lineTo(this.cols * this.pixelSize, row * this.pixelSize);
		}

		for (var col = 0; col < this.cols; col++) {
			this.c.moveTo(col * this.pixelSize, 0);
			this.c.lineTo(col * this.pixelSize, row * this.rows);
		}

		this.c.stroke();
	},

	newPixels: function (rows, cols) {
		var pixels = new Array(rows);
		for (var row = 0; row < pixels.length; row++) {
			pixels[row] = new Array(cols);
		}

		return pixels;
	},

	drawTetromino: function () {
		var tetrominoPixels = this.tetrominoPixels[this.tetromino.tetromino][this.tetromino.direction];
		for (var row = 0; row < tetrominoPixels.length; row++) {
			for (var col = 0; col < tetrominoPixels[row].length; col++) {
				if (tetrominoPixels[row][col]) {
					this.drawPixel({
						row: this.tetromino.row + row,
						col: this.tetromino.col + col,
						color: this.tetromino.color,
					});
				}
			}
		}
	},

	drawPixel: function (pixel) {
		var x = pixel.col * this.pixelSize,
			y = pixel.row * this.pixelSize;

		this.c.fillStyle = pixel.color;
		this.c.fillRect(x, y, this.pixelSize, this.pixelSize);
	}
};

window.onload = function () {
	game.start(document.querySelector("canvas"));
};
