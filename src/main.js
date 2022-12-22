
/**
 * Generate a game world.
*/
function buildMap(seeder) {
	const map = new GameMap().create(100, seeder.value);

	const table = Utils.createNode('table');
	const tbody = Utils.createNode('tbody');

	map.data.forEach((arr, x) => {
		const row = Utils.createNode('tr');
		arr.forEach((type, y) => {
			const cell = map.get([x, y]);
			row.appendChild(cell);
		});
		tbody.appendChild(row);
	});

	table.appendChild(tbody);
	return [table, map];
};

function rerun(seeder) {
	document?.querySelector('table')?.remove();
	const map = buildMap(seeder);
	console.log(map[1]);
	document.body.appendChild(map[0]);
};

window.onload = () => {
	const seeder = document.querySelector('input');
	const map = buildMap(seeder);
	console.log(map[1]);
	document.body.appendChild(map[0]);
};