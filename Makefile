default: build

build:
	@html-validator --file index.html --verbose
	@jshint happy-tetris.js
