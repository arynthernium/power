class Utils {
	/**
	 * Create an HTML element.
	 * @link [From my gist](https://gist.github.com/arynthernium/0070c4d68909723f7bd9b65204d5b4cc)
	 * @author [arynthernium](https://github.com/arynthernium)
	 * @param {string} tag Can be any valid HTML tag.
	 * @param {string} innerHTML String to set as the innerHTML of the returned node.
	 * @param {object} attrs An object of attributes to be applied with setAttribute.
	 * @param {object} styles Object with valid JS style keys for CSS styles.
	 * @returns {HTMLElement}
	 */
	static createNode(tag = 'div', innerHTML = '', attrs = {}, styles = {}) {
		const node = document.createElement(tag);
		node.innerHTML = innerHTML;
		Object.keys(attrs).forEach(key => {
			node.setAttribute(key, attrs[key]);
		});
		Object.assign(node.style, styles);
		return node;
	};
	/**
	 * Check if a number is within a range.
	 * @param {number} num The number to check.
	 * @param {number} min Minimum possible value.
	 * @param {number} max Maximum possible value.
	 * @returns {bool}
	 */
	static checkRange(num, min, max) {
		if (min === undefined) return num < max;
		if (max === undefined) return num > min;
		return num > min && num < max;
	};
}