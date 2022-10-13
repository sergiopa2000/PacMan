let board = new game.Board()
board.startRefresh()


let ghostsPositions = [{x: 4, y: 6}, {x: 5, y: 6}]
let ghosts = new game.Ghost(3, ghostsPositions, 1)
ghosts.setUpGhosts()

let player = new game.Player(1, ghosts)
player.setUpPlayer()
player.setControls()