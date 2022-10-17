

let player = new game.Player(1)
player.setUpPlayer()
player.setControls()

let ghostsPositions = [{x: 0, y: 0, movement: null}, {x: 17, y: 8, movement: null}]
let ghosts = new game.Ghost(3, ghostsPositions, 1)
ghosts.setUpGhosts()

game.Board.refreshBoard()
