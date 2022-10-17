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

    static refreshBoard(){
        let boardContainer = document.getElementById("board")
        boardContainer.innerHTML = ""
        for (let row of game.boardArray) {
            row = row.toString().replaceAll(',', ' ')
            boardContainer.innerHTML += row + "<br>"
        }
    }
}

game.Player = class{
    constructor(playerSymbol){
        this.playerSymbol = playerSymbol
    }

    setUpPlayer(){
        game.boardArray[game.playerPosition.y][game.playerPosition.x] = this.playerSymbol
    }

    setControls(){
        window.addEventListener("keyup", this.keyListener)
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

        this.movePlayer(direction)
        game.Board.refreshBoard()
    }

    movePlayer(direction){
        let prediction
        game.boardArray[game.playerPosition.y][game.playerPosition.x] = 0
        switch (direction) {
            case "up":
                prediction = game.playerPosition.y - 1
                if(prediction >= 0 && game.boardArray[prediction][game.playerPosition.x] == 0){
                    game.playerPosition.y--
                }
                break;
            case "right":
                prediction = game.playerPosition.x + 1
                if(prediction <= game.boardXLimit && game.boardArray[game.playerPosition.y][prediction] == 0){
                    game.playerPosition.x++
                }
                break;
            case "down":
                prediction = game.playerPosition.y + 1
                if(prediction <= game.boardYLimit && game.boardArray[prediction][game.playerPosition.x] == 0){
                    game.playerPosition.y++
                }
                break;
            case "left":
                prediction = game.playerPosition.x - 1
                if(prediction >= 0 && game.boardArray[game.playerPosition.y][prediction] == 0){
                    game.playerPosition.x--
                }
                break;
        }
        game.boardArray[game.playerPosition.y][game.playerPosition.x] = this.playerSymbol
    }

    checkLose(){
        if(game.boardArray[game.playerPosition.y][game.playerPosition.x] != this.playerSymbol){
            document.getElementById("lose").style.visibility = "visible"
            window.removeEventListener("keyup", this.keyListener)
            ghosts.stopMovement()
        }
    }
}

game.Ghost = class{
    constructor(ghostsSymbol, ghostsPositions, playerSymbol){
        this.playerSymbol = playerSymbol
        this.ghostsSymbol = ghostsSymbol
        this.ghostsPositions = ghostsPositions
    }

    setUpGhosts(){
        for (const ghostPosition of this.ghostsPositions) {
            game.boardArray[ghostPosition.y][ghostPosition.x] = this.ghostsSymbol
        }
        this.setUpdateGhosts()
    }

    stopMovement(){
        for (let ghostPosition of ghostsPositions) {
            clearInterval(ghostPosition.movement)
        }
    }
 
    setUpdateGhosts(){
        for (let ghostPosition of ghostsPositions) {
            ghostPosition.movement = setInterval(() => this.moveGhost(ghostPosition), 500)
        }
    }
    
    moveGhost(ghostPosition){
        let option = this.checkBestRoute(ghostPosition, this.setUpOptions(ghostPosition));
        game.boardArray[ghostPosition.y][ghostPosition.x] = 0
        switch(option){
            case "up":
                ghostPosition.y--;
                break;
                
            case "down":
                ghostPosition.y++;
                break;

            case "left":
                ghostPosition.x--;
                break;

            case "right":
                ghostPosition.x++;
                break;
        }

        game.boardArray[ghostPosition.y][ghostPosition.x] = this.ghostsSymbol
        game.Board.refreshBoard()
        player.checkLose()
    }

    setUpOptions(ghostPosition){
        let options = []
        if(ghostPosition.y != 0 && game.boardArray[ghostPosition.y - 1][ghostPosition.x] != 2 && game.boardArray[ghostPosition.y - 1][ghostPosition.x] != this.ghostsSymbol) options.push("up")
        if(ghostPosition.y < game.boardYLimit && game.boardArray[ghostPosition.y + 1][ghostPosition.x] != 2 && game.boardArray[ghostPosition.y + 1][ghostPosition.x] != this.ghostsSymbol) options.push("down")
        if(ghostPosition.x != 0 && game.boardArray[ghostPosition.y][ghostPosition.x - 1] != 2 && game.boardArray[ghostPosition.y][ghostPosition.x - 1] != this.ghostsSymbol) options.push("left")
        if(ghostPosition.x < game.boardXLimit && game.boardArray[ghostPosition.y][ghostPosition.x + 1] != 2 && game.boardArray[ghostPosition.y][ghostPosition.x + 1] != this.ghostsSymbol) options.push("right")

        return options
    }

    checkBestRoute(ghostPosition, options){
        let selected
        if(game.playerPosition.x < ghostPosition.x && options.includes("left")) selected = "left"
        else if(game.playerPosition.x > ghostPosition.x && options.includes("right")) selected = "right"
        else if(game.playerPosition.y < ghostPosition.y && options.includes("up")) selected = "up"
        else if(game.playerPosition.y > ghostPosition.y && options.includes("down")) selected = "down"
        else selected = options[Math.floor(Math.random() * options.length)];
        return selected
    }
}