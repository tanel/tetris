/* global document,window,Audio,console */
"use strict";

var game = {
	cols: 10,
	rows: 20,
	pixelSize: 20, // canvas.width / cols
	colors: ["red", "violet", "green", "gold"],
	keyDelay: 50,
	drawSpeed: 100,
	gameSpeed: 1000,
	keyAt: 0,
	droppedPixels: [],
	dropSound: new Audio('drop.wav'),
	clearSound: new Audio('clear.wav'),
	soundEnabled: true,
	score: 0,
	scoreEl: null,
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

	start: function (opts) {
		window.onkeydown = game.onkeydown.bind(game);

		this.c = opts.canvas.getContext("2d");

		this.scoreEl = opts.scoreEl;
		this.highScoreEl = opts.highScoreEl;
		if (window.localStorage) {
			this.highScoreEl.textContent = window.localStorage.getItem('highScore');
		}

		this.enableSoundEl = opts.enableSoundEl;
		opts.enableSoundEl.onclick = this.enableSound.bind(this);
		if (window.localStorage) {
			this.soundEnabled = (window.localStorage.getItem('soundEnabled') === 'true');
			this.enableSoundEl.checked = this.soundEnabled;
		}

		this.tetromino = this.randomTetromino();

		this.draw();
		this.setTickTimeout();
	},

	enableSound: function (event) {
		this.soundEnabled = event.target.checked;
		if (window.localStorage) {
			window.localStorage.setItem('soundEnabled', this.soundEnabled);
		}
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

		this.drawTimeout = window.setTimeout(this.draw.bind(this), this.drawSpeed);
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
			this.c.lineTo(col * this.pixelSize, this.rows * this.pixelSize);
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
		while (this.moveDown());
		this.playSound(this.dropSound);
	},

	playSound: function (sound) {
		if (this.soundEnabled) {
			sound.play();
		}
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
		if (this.moveTo(clone)) {
			return true;
		}

		this.addToDroppedPixels();
		this.clearRows();
		return false;
	},

	moveTo: function (clone) {
		var canMove = true,
			isOutOfBounds = this.isOutOfBounds.bind(this),
			isDroppedPixel = this.isDroppedPixel.bind(this);

		this.visitTetrominoPixels(clone, function (row, col) {
			if (isOutOfBounds(row, col)) {
				canMove = false;
			} else if (isDroppedPixel(row, col)) {
				canMove = false;
			}
		});

		if (canMove) {
			this.tetromino = clone;
		}

		return canMove;
	},

	isOutOfBounds: function (row, col) {
		return ((col < 0) || (col >= this.cols) || (row >= this.rows));
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

		this.moveTo(this.randomTetromino());
	},

	clearRows: function () {
		this.removeFullRows();
		this.removeEmptyRows();
	},

	removeFullRows: function () {
		while (this.removeRow(this.findFullRow.bind(this)));
	},

	removeRow: function (finder) {
		var row = finder(),
			remaining = [],
			pixel = null,
			i;

		if (!row) {
			return null;
		}

		for (i = 0; i < this.droppedPixels.length; i++) {
			pixel = this.droppedPixels[i];
			if (pixel.row !== row) {
				remaining.push(pixel);
			}
		}

		this.droppedPixels = remaining;
		this.playSound(this.clearSound);
		
		this.increaseScore(1);

		return row;
	},

	increaseScore: function (increment) {
		this.score = this.score + increment;

		this.scoreEl.textContent = String(this.score);

		if (window.localStorage) {
			var highScore = parseInt(window.localStorage.getItem('highScore'), 10);
			if (highScore < this.score) {
				window.localStorage.setItem('highScore', this.score);
			}
		}
	},

	countCols: function () {
		var pixel = null,
			cols = {},
			i,
			result = [];

		for (i = 0; i < this.droppedPixels.length; i++) {
			pixel = this.droppedPixels[i];
			cols[pixel.row] = (cols[pixel.row] || 0) + 1;
		}

		for (i = 0; i < this.rows; i++) {
			result.push(cols[i]);
		}

		return result;
	},

	findFullRow: function () {
		var rows = this.countCols(),
			i;

		for (i = 0; i < rows.length; i++) {
			if (rows[i] >= this.cols) {
				return i;
			}
		}

		return null;
	},

	findEmptyRow: function () {
		var rows = this.countCols(),
			i,
			firstNonEmpty = null;

		for (i = 0; i < rows.length; i++) {
			if (rows[i]) {
				firstNonEmpty = i;
				break;
			}
		}

		if (!firstNonEmpty) {
			return null;
		}

		for (i = firstNonEmpty + 1; i < rows.length; i++) {
			if (!rows[i]) {
				return i;
			}
		}

		return null;
	},

	removeEmptyRows: function () {
		var empty,
			remaining,
			i,
			pixel = null;

		while (true) {
			empty = this.findEmptyRow();
			if (!empty) {
				return;
			}

			for (i = 0; i < this.droppedPixels.length; i++) {
				pixel = this.droppedPixels[i];
				if (pixel.row < empty) {
					pixel.row = pixel.row + 1;
					this.droppedPixels[i] = pixel;
				}
			}
		}
	},
};

window.onload = function () {
	game.start({
		canvas: document.querySelector("canvas"),
		scoreEl: document.getElementById('score'),
		highScoreEl: document.getElementById('highScore'),
		enableSoundEl: document.getElementById('enableSound'),
	});
};
