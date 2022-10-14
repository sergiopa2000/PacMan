var game = game || {}
game.boardArray = [
        [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 2, 2, 2, 0, 2, 2, 0],
        [0, 2, 0, 2, 2, 2, 0, 2, 2, 0],
        [0, 0, 0, 2, 2, 2, 0, 2, 2, 0],
        [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 2, 2, 2, 2, 0, 2, 0],
        [0, 2, 0, 0, 0, 0, 0, 0, 2, 0],
        [0, 2, 0, 0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ]
game.playerPosition = {
    x: 0,
    y: 0
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
        game.boardArray[0][0] = this.playerSymbol
    }

    setControls(){
        window.addEventListener("keydown", (event) =>{
            let direction
            switch (event.code) {
                case "ArrowUp":
                    direction = 1
                    break;
                case "ArrowRight":
                    direction = 2
                    break;
                case "ArrowDown":
                    direction = 3
                    break;
                case "ArrowLeft":
                    direction = 4
                    break;
            }
            let moved = this.movePlayer(direction)
            if(moved){
                this.ghost.updateGhosts()
            }
        })
    }

    movePlayer(direction){
        let prediction
        let moved = false
        switch (direction) {
            case 1:
                prediction = game.playerPosition.y - 1
                if(prediction >= 0 && game.boardArray[prediction][game.playerPosition.x] == 0){
                    game.boardArray[game.playerPosition.y][game.playerPosition.x] = 0
                    game.playerPosition.y--
                    game.boardArray[game.playerPosition.y][game.playerPosition.x] = this.playerSymbol
                    moved = true
                }
                break;
            case 2:
                prediction = game.playerPosition.x + 1
                if(game.boardArray[game.playerPosition.y][prediction] == 0){
                    game.boardArray[game.playerPosition.y][game.playerPosition.x] = 0
                    game.playerPosition.x++
                    game.boardArray[game.playerPosition.y][game.playerPosition.x] = this.playerSymbol
                    moved = true
                }
                break;
            case 3:
                prediction = game.playerPosition.y + 1
                if(game.boardArray[prediction][game.playerPosition.x] == 0){
                    game.boardArray[game.playerPosition.y][game.playerPosition.x] = 0
                    game.playerPosition.y++
                    game.boardArray[game.playerPosition.y][game.playerPosition.x] = this.playerSymbol
                    moved = true
                }
                break;
            case 4:
                prediction = game.playerPosition.x - 1
                if(prediction >= 0 && game.boardArray[game.playerPosition.y][prediction] == 0){
                    game.boardArray[game.playerPosition.y][game.playerPosition.x] = 0
                    game.playerPosition.x--
                    game.boardArray[game.playerPosition.y][game.playerPosition.x] = this.playerSymbol
                    moved = true
                }
                break;
        }
        return moved
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
        let attempt = 1
        let moved
        let coordsBefore
        for (let ghost of ghostsPositions) {
            coordsBefore = {x: ghost.x, y: ghost.y}
            attempt = 1
            moved = this.ghostNotMoved
            while(moved == 0 && attempt < 6){
                moved = this.moveGhost(attempt, ghost)
                attempt++
            }
            if(moved != this.ghostStopped){
                game.boardArray[coordsBefore.y][coordsBefore.x] = 0
            }
        }
    }
    
    moveGhost(attempt, ghost){
        let prediction
        switch (attempt) {
            case 1:
                prediction = ghost.x + 1
                if(game.boardArray[ghost.y][prediction] == this.playerSymbol){
                    
                    return this.ghostStopped
                }

                if(game.boardArray[ghost.y][prediction] != 0){
                    return this.ghostNotMoved
                }

                if(game.playerPosition.x > ghost.x){
                    ghost.x++
                    game.boardArray[ghost.y][ghost.x] = this.ghostsSymbol
                    return this.ghostMoved
                }
                break;
        
            case 2:
                prediction = ghost.x - 1
                if(game.boardArray[ghost.y][prediction] == this.playerSymbol){
                    return this.ghostStopped
                }

                if(game.boardArray[ghost.y][prediction] != 0 || prediction < 0){
                    return this.ghostNotMoved
                }

                if(game.playerPosition.x < ghost.x){
                    ghost.x--
                    game.boardArray[ghost.y][ghost.x] = this.ghostsSymbol
                    return this.ghostMoved
                }
                break;
            case 3:
                prediction = ghost.y + 1
                if(game.boardArray[prediction][ghost.x] == this.playerSymbol){
                    return this.ghostStopped
                }

                if(game.boardArray[prediction][ghost.x] != 0){
                    return this.ghostNotMoved
                }

                if(game.playerPosition.y > ghost.y){
                    ghost.y++
                    game.boardArray[ghost.y][ghost.x] = this.ghostsSymbol
                    return this.ghostMoved
                }

                break;
            case 4:
                prediction = ghost.y - 1

                if(game.boardArray[prediction][ghost.x] == this.playerSymbol){
                    return this.ghostStopped
                }

                if(game.boardArray[prediction][ghost.x] != 0 || prediction < 0){
                    return this.ghostNotMoved
                }

                if(game.playerPosition.y < ghost.y){
                    ghost.y--
                    game.boardArray[ghost.y][ghost.x] = this.ghostsSymbol
                    return this.ghostMoved
                }
                break;
            case 5:
                this.moveWhereYouCan(ghost)
                break;
        }

        return this.ghostNotMoved
    }

    moveWhereYouCan(ghost){
        let prediction

        prediction = ghost.x + 1
        if(game.boardArray[ghost.y][prediction] == 0){
            ghost.x++
            game.boardArray[ghost.y][ghost.x] = this.ghostsSymbol
            return this.ghostMoved
        }

        prediction = ghost.x - 1
        if(prediction >= 0 && game.boardArray[ghost.y][prediction] == 0){
            ghost.x--
            game.boardArray[ghost.y][ghost.x] = this.ghostsSymbol
            return this.ghostMoved
        }

        prediction = ghost.y + 1
        if(game.boardArray[prediction][ghost.x] == 0){
            ghost.y++
            game.boardArray[ghost.y][ghost.x] = this.ghostsSymbol
            return this.ghostMoved
        }

        prediction = ghost.y - 1
        if(prediction >= 0 && game.boardArray[prediction][ghost.x] == 0){
            ghost.y--
            game.boardArray[ghost.y][ghost.x] = this.ghostsSymbol
            return this.ghostMoved
        }
    }
}