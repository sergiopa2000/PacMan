var game = game || {}
game.boardArray = [
        ["x", 1, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0],
        [1, 1, 0, 0, 0],
    ]
game.playerPosition = {
    x: 0,
    y: 0
}
game.board = class{
    constructor(){
        this.refresh = null
    }

    startRefresh(){
        let boardContainer = document.getElementById("board")
        this.refresh = setInterval(() =>{
            boardContainer.innerHTML = ""
            for (const row of game.boardArray) {
                boardContainer.innerHTML += row + "<br>"
            }
        }, 16.6)
    }

    setControls(){
        document.getElementById("testButton").onclick = function(){
            
            let text = document.getElementById("testInput").value
            console.log(text);
            if(text == 1){
                game.boardArray[game.playerPosition.y][game.playerPosition.x] = 0
                game.playerPosition.y--
                game.boardArray[game.playerPosition.y][game.playerPosition.x] = "x"
            }
            if(text == 2){
                game.boardArray[game.playerPosition.y][game.playerPosition.x] = 0
                game.playerPosition.x++
                game.boardArray[game.playerPosition.y][game.playerPosition.x] = "x"
            }
            if(text == 3){
                game.boardArray[game.playerPosition.y][game.playerPosition.x] = 0
                game.playerPosition.y++
                game.boardArray[game.playerPosition.y][game.playerPosition.x] = "x"
            }
            if(text == 4){
                game.boardArray[game.playerPosition.y][game.playerPosition.x] = 0
                game.playerPosition.x--
                game.boardArray[game.playerPosition.y][game.playerPosition.x] = "x"
            }
        }   
        
    }
}