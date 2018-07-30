default: lint

lint:
	@html-validator --file index.html --verbose
	@jshint --config jshint.json happy-tetris.js
