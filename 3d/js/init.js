game.Board.refreshBoard()
let board = new game.Board()
board.setUpStairs()

let player = new game.Player(1)
player.setUpPlayer()
player.setControls()

let ghostsPositions = [{x: 0, y: 0, z: 0, movement: null}, {x: 17, y: 8, z: 0, movement: null}, 
                       {x: 0, y: 0, z: 1, movement: null}, {x: 0, y: 6, z: 1, movement: null},
                       {x: 10, y: 8, z: 2, movement: null}, {x: 10, y: 0, z: 2, movement: null}]
let ghosts = new game.Ghost(3, ghostsPositions, 1)
ghosts.setUpGhosts()

game.Board.refreshBoard()
