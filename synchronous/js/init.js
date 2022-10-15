let board = new game.Board()
board.startRefresh()


let ghostsPositions = [{x: 0, y: 0}, {x: 17, y: 8}]
let ghosts = new game.Ghost(3, ghostsPositions, 1)
ghosts.setUpGhosts()

let player = new game.Player(1, ghosts)
player.setUpPlayer()
player.setControls()