# power

A game about generating electricity. Starting with basic dynamo arrays and building up to fusion power, this is a game about the progression of electricity in an RTS style.

### Roadmap
- [x] Implement game map (2d array, html table?)
- [ ] Render graphics on a grid (using placeholders)
- [ ] Create game stages (dynamos to fusion)
- [ ] Create research system to throttle gameplay
- [ ] Create numeric systems (money, electricity)
- [ ] Implement random terrain generation (resources)
- [ ] Create city system (population, energy demand)

### Developers

All Javascript types will have full JSDoc comments.

#### `Random`
```js
const firstrand = new Random(938475);
firstrand.next(); // 203970138
firstrand.next(); // 1777493550
firstrand.next(); // 829519812

const secondrand = new Random(938475);
secondrand.next(); // 203970138
secondrand.next(); // 1777493550
secondrand.next(); // 829519812
```
Create a seeded pseudo-random number generator. Numbers generate sequentially with the `next()` method. Provides a convenience method `nextFloat()` to get a number between 0 and 1. This is NOT cryptographically secure, nor is it guaranteed to be random.

Uses a slight modification to the Lehmer LCG algorithm. May get updated in the future to use Mulberry32 as according to [this write-up](https://github.com/bryc/code/blob/master/jshash/PRNGs.md) by @bryc.

#### `GameMap` extends `Map`
```js
const map = new GameMap().create();
```
Synchronously creates a map. Contains a two-dimensional array under the `data` property. Also contains the individual cells as `Cell` instances in coordinate location properties such as `'[x,y]'`

Keys in `set()` and `get()` method calls are JSON stringified and then passed to the super methods. I'm doing this so I can use coordinate arrays like `[5, 7]` or with variables such as `[x, y]` and not have to use string builders or any weird custom string formats. This may become a `Key` or `Coordinate` class with a `from(x, y)` method later on, depending on my usage.