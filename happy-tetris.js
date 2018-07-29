var game = {
	cols: 20,
	rows: 20,
	pixelSize: 20, // canvas.width / cols
	colors: ["red", "blue", "green", "yellow"],
	keyDelay: 100,
	gameSpeed: 1000,
	keyAt: 0,
	droppedPixels: [],
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

	start: function (canvas) {
		this.c = canvas.getContext("2d");
		this.tetromino = this.randomTetromino();
		this.draw();
		this.setTickTimeout();
	},

	tick: function () {
		this.moveDown();
		this.setTickTimeout();
	},

	setTickTimeout: function () {
		this.timeout = window.setTimeout(this.tick.bind(this), this.gameSpeed);
	},

	cloneTetromino: function () {
		return Object.assign({}, this.tetromino);
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

	draw: function () {
		this.drawBackground();
		this.drawGrid();
		this.drawTetromino();
		this.drawDroppedPixels();

		this.drawTimeout = window.setTimeout(this.draw.bind(this), this.keyDelay);
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

	drawTetromino: function () {
		var draw = this.drawPixel.bind(this),
			tetromino = this.tetromino;
		this.visitTetrominoPixels(tetromino, function (row, col) {
			draw({
				row: row,
				col: col,
				color: tetromino.color,
			});
		});
	},

	drawDroppedPixels: function () {
		for (var i = 0; i < this.droppedPixels.length; i++) {
			this.drawPixel(this.droppedPixels[i]);
		}
	},

	drawPixel: function (pixel) {
		var x = pixel.col * this.pixelSize,
			y = pixel.row * this.pixelSize;

		this.c.fillStyle = pixel.color;
		this.c.fillRect(x, y, this.pixelSize, this.pixelSize);
	},

	visitTetrominoPixels: function (tetromino, visitor) {
		var pixels = this.tetrominoPixels[tetromino.tetromino][tetromino.direction];
		for (var row = 0; row < pixels.length; row++) {
			for (var col = 0; col < pixels[row].length; col++) {
				if (pixels[row][col]) {
					visitor(tetromino.row + row, tetromino.col + col);
				}
			}
		}
	},

	onkeydown: function (key) {
		var now = new Date().getTime(),
			since = now - this.keyAt;

		if (since < this.keyDelay) {
			return;
		}

		this.keyAt = now;

		switch (key.keyCode) {
			case 32:
				this.drop();
				break;
			case 37:
				this.moveLeft();
				break;
			case 38:
				this.nextDirection();
				break;
			case 39:
				this.moveRight();
				break;
			case 40:
				this.moveDown();
				break;
		}
	},

	moveLeft: function () {
		var clone = this.cloneTetromino();
		clone.col = clone.col - 1;
		this.moveTo(clone);
	},

	moveRight: function () {
		var clone = this.cloneTetromino();
		clone.col = clone.col + 1;
		this.moveTo(clone);
	},

	drop: function () {
		
	},

	nextDirection: function () {
		var clone = this.cloneTetromino();
		if (clone.direction === 3) {
			clone.direction = 0;
		} else {
			clone.direction = clone.direction + 1;
		}

		this.moveTo(clone);
	},

	moveDown: function () {
		var clone = this.cloneTetromino();
		clone.row = clone.row + 1;
		if (!this.moveTo(clone)) {
			this.addToDroppedPixels();
		}
	},

	addToDroppedPixels: function () {
		var droppedPixels = this.droppedPixels,
			tetromino = this.tetromino;

		this.visitTetrominoPixels(tetromino, function (row, col) {
			droppedPixels.push({
				row: row,
				col: col,
				color: tetromino.color,
			});
		});

		this.tetromino = this.randomTetromino();
	},

	moveTo: function (clone) {
		var canMove = true,
			maxRows = this.rows,
			maxCols = this.cols,
			isDroppedPixel = this.isDroppedPixel.bind(this);

		this.visitTetrominoPixels(clone, function (row, col) {
			if (col < 0) {
				canMove = false;
			}

			if (col >= maxCols) {
				canMove = false;
			}

			if (row >= maxRows) {
				canMove = false;
			}

			if (isDroppedPixel(row, col)) {
				canMove = false;
			}
		});

		if (canMove) {
			this.tetromino = clone;
			return true;
		}

		return false;
	},

	isDroppedPixel: function (row, col) {
		for (var i = 0; i < this.droppedPixels.length; i++) {
			var pixel = this.droppedPixels[i];
			if (pixel.row === row && pixel.col === col) {
				return true;
			}
		}

		return false;
	},
};

window.onload = function () {
	game.start(document.querySelector("canvas"));
	window.onkeydown = game.onkeydown.bind(game);
};
