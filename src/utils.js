/**
 * Create an HTML element.
 * @author [arynthernium](https://github.com/arynthernium)
 * @param {string} tag Can be any valid HTML tag.
 * @param {string} innerHTML String to set as the innerHTML of the returned node.
 * @param {object} attrs An object of attributes to be applied with setAttribute.
 * @param {object} styles Object with valid JS style keys for CSS styles.
 * @returns {HTMLElement}
 */
function createNode(tag = 'div', innerHTML = '', attrs = {}, styles = {}) {
	const node = document.createElement(tag);
	node.innerHTML = innerHTML;
	Object.keys(attrs).forEach(key => {
		node.setAttribute(key, attrs[key]);
	});
	Object.assign(node.style, styles);
	return node;
};