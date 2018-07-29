var game = {
	canvas: null,
	pixels: [], // pixels are (x,y)
	rows: 20,
	cols: 20,
	pixelSize: 30,
	colors: ["red", "blue", "green", "yellow"],

	start: function () {
		this.drawBackground();
		this.tick();
	},

	tick: function () {
		this.drawPixels();
		this.timeout = window.setTimeout(this.tick.bind(this), 1000);
	},

	randomColor: function () {
		return this.colors[Math.floor(Math.random() * this.colors.length)];
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
