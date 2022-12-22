/**
 * @typedef {object} Random
 */
class Random {
	seed;
	/**
	 * Apply the seed to the class for use in the next method.
	 * This is a slight modification to the Lehmer LCG algorithm.
	 * Burns the first number by [@chriscauley](https://github.com/chriscauley)'s recommendation [here](https://gist.github.com/blixt/f17b47c62508be59987b?permalink_comment_id=2787679#gistcomment-2787679)
	 * @param {number} seed Sets the internal seed used to generate random numbers.
	 */
	constructor(seed) {
		this.seed = seed % 2147483647;
		if (this.seed <= 0) {
			this.seed += 2147483646;
		};
		this.next();
	};
	/**
	 * Generate the next random number.
	 * @returns {number}
	 */
	next() {
		return this.seed = this.seed * 48271 % 2147483647;
	};
	/**
	 * Convenience method for generating floats between 0 and 1, similar to `Math.random()` output.
	 * @returns {number} Float between 0 and 1.
	 */
	nextFloat() {
		return (this.next() - 1) / 2147483646;
	};
};

/**
 * @typedef {Map<string, Cell>} GameMap
 * @property {Array<Array<number>>} data
 * @property {number} sideLength
 * @property {number} seed
 */
class GameMap extends Map {
	/** @type {Array<Array<number>>} */
	data;
	/** @type {number} */
	sideLength;
	/** @type {number} */
	seed;
	/**
	 * Get a value from the map.
	 * @param {any} key Any JSON.stringifiable value.
	 * @returns {Cell} The value at the specified key.
	 */
	get(key) {
		return super.get(JSON.stringify(key));
	};
	/**
	 * 
	 * @param {any} key Any JSON.stringifiable value.
	 * @param {any} value The value to set at the specified key.
	 * @returns {this}
	 */
	set(key, value) {
		return super.set(JSON.stringify(key), value);
	};
	/**
	 * Implements the Diamond-Square algorithm for 2D terrain-like generation.
	 * Seeds are repeatable provided the same other variables.
	 * @param {number} size Scale offset size.
	 * @param {number} length Side length in units.
	 * @param {number} iterations Generation iterations.
	 * @param {number} seed A seed to begin generation on.
	 * @returns {number[][]}
	 */
	generate(size, length, iterations, seed) {
		let map = [];

		const rand = new Random(seed);

		for (let i = 0; i < iterations; i++) {
			map[i] = [];

			for (let y = 0; y < length; y++) {
				map[i][y] = [];

				for (let x = 0; x < length; x++) {
					let neighbours = [];

					if (i === 0) {
						map[i][y][x] = rand.nextFloat();
						continue;
					};

					let radius = (size / 2);
					let x0 = size / 2;
					let y0 = size / 2;
					let x1 = Math.round(size / length) * x;
					let y1 = Math.round(size / length) * y;

					if (Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) > radius && i === 1) {
						map[i][y][x] = rand.nextFloat() * 0.8;
						continue;
					};

					if (map[i - 1][y - 1] && map[i - 1][y - 1][x]) { // top
						neighbours.push(map[i - 1][y][x]);

						if (map[i - 1][y - 1][x - 1]) { // top left
							neighbours.push(map[i - 1][y - 1][x - 1]);
						};

						if (map[i - 1][y - 1][x + 1]) { // top right
							neighbours.push(map[i - 1][y - 1][x + 1]);
						};
					};

					if (map[i - 1][y + 1] && map[i - 1][y + 1][x]) { // bottom
						neighbours.push(map[i - 1][y + 1][x]);

						if (map[i - 1][y + 1][x - 1]) { // bottom left
							neighbours.push(map[i - 1][y + 1][x - 1]);
						};

						if (map[i - 1][y + 1][x + 1]) { // bottom right
							neighbours.push(map[i - 1][y + 1][x + 1]);
						};
					};

					if (map[i - 1][y][x - 1]) { // left
						neighbours.push(map[i - 1][y][x - 1]);
					};

					if (map[i - 1][y][x + 1]) { // right
						neighbours.push(map[i - 1][y][x + 1]);
					};

					let sum = neighbours.reduce((total, value) => total + value);
					let count = neighbours.length;

					map[i][y][x] = (sum / count);
				};
			};
		};
		return map[iterations - 1];
	};
	/**
	 * A cell element for usage in the HTML DOM.
	 * @typedef {object} Cell
	 * @property {number} value Cell value between 0 and 1. Cannot be set directly, always set by inheriting classes.
	 */
	static Cell = class Cell extends HTMLElement {
		connectedCallback() {
			this.classList.add('cell');
		};
	};
	static CellTypes = class CellTypes {
		static Land = class Land extends GameMap.Cell {
			constructor(value) {
				super();
				this.value = value;
			};
		};
		static Water = class Water extends GameMap.Cell {
			constructor(value) {
				super();
				this.value = value;
			};
		};
		static DarkBeach = class DarkBeach extends GameMap.Cell {
			constructor(value) {
				super();
				this.value = value;
			};
		};
		static LightBeach = class LightBeach extends GameMap.Cell {
			constructor(value) {
				super();
				this.value = value;
			};
		};
	};
	/**
	 * Check the cell type from the range it's value is in and return a Cell instance.
	 * @param {number} val The value of the cell. A number between 0 and 1.
	 * @returns {GameMap.Cell} A cell inheriting from the Cell class.
	 */
	createCell(val) {
		switch (true) {
			case Utils.checkRange(val, undefined, 0.41):
				return new GameMap.CellTypes.Land(val);

			case Utils.checkRange(val, 0.41, 0.413):
				return new GameMap.CellTypes.LightBeach(val);

			case Utils.checkRange(val, 0.413, 0.414):
				return new GameMap.CellTypes.DarkBeach(val);

			case Utils.checkRange(val, 0.414, undefined):
				return new GameMap.CellTypes.Water(val);

			default:
				throw new Error("Switch broken at GameMap.createCell()");
		};
	};
	/**
	 * Generate and apply map entries.
	 * @param {number} size The side length in units to generate.
	 * @param {number} seed The seed to generate with.
	 * @returns {GameMap}
	 */
	create(size, seed) {
		this.sideLength = size;
		this.seed = seed;
		// preset values for size and iterations
		this.data = this.generate(20, size, 50, seed);

		this.data.forEach((row, x) => {
			row.forEach((seed, y) => {
				this.set([x, y], this.createCell(seed));
			});
		});

		return this;
	};
};

// Register cells so I can use them as elements in the table.
customElements.define('cell-manual', GameMap.Cell);
customElements.define('cell-land', GameMap.CellTypes.Land);
customElements.define('cell-water', GameMap.CellTypes.Water);
customElements.define('cell-darkbeach', GameMap.CellTypes.DarkBeach);
customElements.define('cell-lightbeach', GameMap.CellTypes.LightBeach);