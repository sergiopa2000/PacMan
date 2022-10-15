var game = game || {}
game.boardArray = [
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 0, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0]
    ]
game.boardYLimit = game.boardArray.length - 1
game.boardXLimit = game.boardArray[0].length - 1
game.playerPosition = {
    x: 8,
    y: 2
}
game.Board = class{
    constructor(){
        this.refresh = null
    }

    startRefresh(){
        let boardContainer = document.getElementById("board")
        this.refresh = setInterval(() =>{
            boardContainer.innerHTML = ""
            for (let row of game.boardArray) {
                row = row.toString().replaceAll(',', ' ')
                boardContainer.innerHTML += row + "<br>"
            }
        }, 33.333)
    }
}

game.Player = class{
    constructor(playerSymbol, ghosts){
        this.playerSymbol = playerSymbol
        this.ghost = ghosts
    }

    setUpPlayer(){
        game.boardArray[game.playerPosition.y][game.playerPosition.x] = this.playerSymbol
    }

    setControls(){
        window.addEventListener("keydown", this.keyListener)
    }

    keyListener = (event) =>{
        let direction
        switch (event.code) {
            case "ArrowUp":
                direction = "up"
                break;
            case "ArrowRight":
                direction = "right"
                break;
            case "ArrowDown":
                direction = "down"
                break;
            case "ArrowLeft":
                direction = "left"
                break;
        }
        let moved = this.movePlayer(direction)
        if(moved){
            this.ghost.updateGhosts()
        }
        this.checkLose()
    }

    movePlayer(direction){
        let prediction
        let moved = false
        game.boardArray[game.playerPosition.y][game.playerPosition.x] = 0
        switch (direction) {
            case "up":
                prediction = game.playerPosition.y - 1
                if(prediction >= 0 && game.boardArray[prediction][game.playerPosition.x] == 0){
                    game.playerPosition.y--
                    moved = true
                }
                break;
            case "right":
                prediction = game.playerPosition.x + 1
                if(game.boardArray[game.playerPosition.y][prediction] == 0){
                    game.playerPosition.x++
                    moved = true
                }
                break;
            case "down":
                prediction = game.playerPosition.y + 1
                if(game.boardArray[prediction][game.playerPosition.x] == 0){
                    game.playerPosition.y++
                    moved = true
                }
                break;
            case "left":
                prediction = game.playerPosition.x - 1
                if(prediction >= 0 && game.boardArray[game.playerPosition.y][prediction] == 0){
                    game.playerPosition.x--
                    moved = true
                }
                break;
        }
        game.boardArray[game.playerPosition.y][game.playerPosition.x] = this.playerSymbol
        return moved
    }

    checkLose(){
        if(game.boardArray[game.playerPosition.y][game.playerPosition.x] != this.playerSymbol){
            document.getElementById("lose").style.visibility = "visible"
            window.removeEventListener("keydown", this.keyListener)
        }
    }
}

game.Ghost = class{
    constructor(ghostsSymbol, ghostsPositions, playerSymbol){
        this.playerSymbol = playerSymbol
        this.ghostsSymbol = ghostsSymbol
        this.ghostsPositions = ghostsPositions
        this.ghostMoved = 1
        this.ghostNotMoved = 0
        this.ghostStopped = -1
    }

    setUpGhosts(){

        for (const ghost of this.ghostsPositions) {
            game.boardArray[ghost.y][ghost.x] = this.ghostsSymbol
        }
    }
 
    updateGhosts(){
        for (let ghost of ghostsPositions) {
            this.moveGhost(ghost)
        }
    }
    
    moveGhost(ghost){
        let option = this.checkBestRoute(ghost, this.setUpOptions(ghost));
        game.boardArray[ghost.y][ghost.x] = 0
        switch(option){
            case "up":
                ghost.y--;
                break;
                
            case "down":
                ghost.y++;
                break;

            case "left":
                ghost.x--;
                break;

            case "right":
                ghost.x++;
                break;
        }

        game.boardArray[ghost.y][ghost.x] = this.ghostsSymbol
    }

    setUpOptions(ghost){
        let options = []
        if(ghost.y != 0 && game.boardArray[ghost.y - 1][ghost.x] != 2 && game.boardArray[ghost.y - 1][ghost.x] != this.ghostsSymbol) options.push("up")
        if(ghost.y < game.boardYLimit && game.boardArray[ghost.y + 1][ghost.x] != 2 && game.boardArray[ghost.y + 1][ghost.x] != this.ghostsSymbol) options.push("down")
        if(ghost.x != 0 && game.boardArray[ghost.y][ghost.x - 1] != 2 && game.boardArray[ghost.y][ghost.x - 1] != this.ghostsSymbol) options.push("left")
        if(ghost.x < game.boardXLimit && game.boardArray[ghost.y][ghost.x + 1] != 2 && game.boardArray[ghost.y][ghost.x + 1] != this.ghostsSymbol) options.push("right")

        return options
    }

    checkBestRoute(ghost, options){
        let selected
        if(game.playerPosition.x < ghost.x && options.includes("left")) selected = "left"
        else if(game.playerPosition.x > ghost.x && options.includes("right")) selected = "right"
        else if(game.playerPosition.y < ghost.y && options.includes("up")) selected = "up"
        else if(game.playerPosition.y > ghost.y && options.includes("down")) selected = "down"
        else selected = options[Math.floor(Math.random() * options.length)];
        return selected
    }
}