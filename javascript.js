const board = document.getElementById("board");
const restartBtn = document.getElementById("restartBtn");
const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");

let currentPlayer = "X";
let gameState = ["","","","","","","","",""];
let isGameActive = true;
let vsAI = false;

let xScore=0, oScore=0, drawScore=0;

const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function createBoard(){
    board.innerHTML="";
    gameState = ["","","","","","","","",""];
    isGameActive = true;
    currentPlayer = "X";

    for(let i=0;i<9;i++){
        const cell=document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index=i;
        cell.addEventListener("click", handleClick);
        board.appendChild(cell);
    }
}

function handleClick(e){
    const index=e.target.dataset.index;

    if(gameState[index]!=="" || !isGameActive) return;

    gameState[index]=currentPlayer;
    e.target.textContent=currentPlayer;

    if(checkWinner()){
        updateScore(currentPlayer);
        isGameActive=false;
        return;
    }

    if(!gameState.includes("")){
        drawScore++;
        document.getElementById("drawScore").textContent=drawScore;
        isGameActive=false;
        return;
    }

    currentPlayer = currentPlayer==="X"?"O":"X";

    if(vsAI && currentPlayer==="O"){
        let bestMove = minimax(gameState,"O").index;
        gameState[bestMove]="O";
        document.querySelector(`[data-index='${bestMove}']`).textContent="O";

        if(checkWinner()){
            updateScore("O");
            isGameActive=false;
            return;
        }

        if(!gameState.includes("")){
            drawScore++;
            document.getElementById("drawScore").textContent=drawScore;
            isGameActive=false;
            return;
        }

        currentPlayer="X";
    }
}

function checkWinner(){
    return winConditions.some(condition=>{
        const [a,b,c]=condition;
        if(gameState[a] && gameState[a]===gameState[b] && gameState[a]===gameState[c]){
            return true;
        }
        return false;
    });
}

function updateScore(player){
    if(player==="X"){
        xScore++;
        document.getElementById("xScore").textContent=xScore;
    }else{
        oScore++;
        document.getElementById("oScore").textContent=oScore;
    }
}

function minimax(newBoard,player){
    const availSpots = newBoard.map((v,i)=>v===""?i:null).filter(v=>v!==null);

    if(checkStaticWinner(newBoard,"X")) return {score:-10};
    if(checkStaticWinner(newBoard,"O")) return {score:10};
    if(availSpots.length===0) return {score:0};

    const moves=[];

    for(let i=0;i<availSpots.length;i++){
        let move={};
        move.index=availSpots[i];
        newBoard[availSpots[i]]=player;

        if(player==="O"){
            let result=minimax(newBoard,"X");
            move.score=result.score;
        }else{
            let result=minimax(newBoard,"O");
            move.score=result.score;
        }

        newBoard[availSpots[i]]="";
        moves.push(move);
    }

    let bestMove;
    if(player==="O"){
        let bestScore=-Infinity;
        for(let i=0;i<moves.length;i++){
            if(moves[i].score>bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    }else{
        let bestScore=Infinity;
        for(let i=0;i<moves.length;i++){
            if(moves[i].score<bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    }

    return moves[bestMove];
}

function checkStaticWinner(board,player){
    return winConditions.some(condition=>{
        const [a,b,c]=condition;
        return board[a]===player && board[b]===player && board[c]===player;
    });
}

restartBtn.addEventListener("click",createBoard);

pvpBtn.addEventListener("click",()=>{
    vsAI=false;
    pvpBtn.classList.add("active");
    aiBtn.classList.remove("active");
    createBoard();
});

aiBtn.addEventListener("click",()=>{
    vsAI=true;
    aiBtn.classList.add("active");
    pvpBtn.classList.remove("active");
    createBoard();
});

createBoard();
