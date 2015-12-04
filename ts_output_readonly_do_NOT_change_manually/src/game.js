var turnIndex;
var gameArea;
var animationEnded = false;
var isComputerTurn = false;
var isYourTurn;
var state = null;
// let board: Board;
var jsonState;
//Globals to detect 2 clicks then make move
//var pawnPosition = {row:'',col:''};
var pawnDelta = { row: -1, col: -1 };
var lastSelected = { row: -1, col: -1 };
var NUM = 10; // num of rows and cols
var draggingStartedRowCol = { row: -1, col: -1 };
var draggingPiece = null;
var nextZIndex = 61;
var typeExpected;
var msg;
var rowsNum = NUM;
var colsNum = NUM;
var game;
(function (game) {
    //end drag and drop
    function animationEndedCallback() {
        $rootScope.$apply(function () {
            log.info("Animation ended");
            animationEnded = true;
            if (isComputerTurn) {
                sendComputerMove();
            }
        });
    }
    function init() {
        resizeGameAreaService.setWidthToHeight(1);
        gameService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            // exampleGame: gameLogic.getExampleGame,
            // riddles: gameLogic.getRiddles(),
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
        // See http://www.sitepoint.com/css3-animation-javascript-event-handlers/
        document.addEventListener("animationend", animationEndedCallback, false); // standard
        document.addEventListener("webkitAnimationEnd", animationEndedCallback, false); // WebKit
        document.addEventListener("oanimationend", animationEndedCallback, false); // Opera
        dragAndDropService.addDragListener("gameArea", handleDragEvent);
    }
    game.init = init;
    function handleDragEvent(type, clientX, clientY) {
        gameArea = document.getElementById('gameArea');
        // Center point in gameArea
        var x = clientX - gameArea.offsetLeft;
        var y = clientY - gameArea.offsetTop;
        var moveType = typeExpected;
        // Is outside gameArea?
        if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
            if (!draggingPiece) {
                return;
            }
            // Drag the piece where the touch is (without snapping to a square).
            var size = getSquareWidthHeight();
            setDraggingPieceTopLeft({ top: y - size.height / 2, left: x - size.width / 2 }, moveType);
            if (type === "touchend") {
                if (moveType === 'X') {
                    draggingPiece.style.display = 'none';
                }
            }
        }
        else {
            // Inside gameArea
            var col = Math.floor(NUM * x / gameArea.clientWidth);
            var row = Math.floor(NUM * y / gameArea.clientHeight);
            if (type === "touchstart" && draggingStartedRowCol.row < 0 && draggingStartedRowCol.col < 0) {
                if (state.board[row][col] === moveType && isYourTurn && moveType !== 'X') {
                    draggingStartedRowCol = { row: row, col: col };
                    draggingPiece = document.getElementById("piece" + moveType + "_" + row + "x" + col);
                    draggingPiece.style['z-index'] = ++nextZIndex;
                }
                else if (isYourTurn && moveType === 'X') {
                    draggingStartedRowCol = pawnDelta;
                    draggingPiece = document.getElementById("pieceX_drag");
                    setDraggingPieceTopLeft(getSquareTopLeft(row, col), moveType);
                    draggingPiece.style['z-index'] = ++nextZIndex;
                    draggingPiece.style.display = 'inline';
                }
            }
            if (!draggingPiece) {
                return;
            }
            if (type === "touchend") {
                var frompos = draggingStartedRowCol;
                var topos = { row: row, col: col };
                dragDone(frompos, topos);
            }
            else {
                setDraggingPieceTopLeft(getSquareTopLeft(row, col), moveType);
            }
        }
        if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
            // drag ended
            // return the piece to it's original style (then angular will take care to hide it).
            setDraggingPieceTopLeft(getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col), moveType);
            if (moveType === typeExpected && typeExpected === 'X') {
                draggingPiece.style.display = 'none';
            }
            draggingStartedRowCol = { row: -1, col: -1 };
            draggingPiece = null;
        }
    }
    function setDraggingPieceTopLeft(topLeft, mType) {
        var originalSize;
        if (mType === 'X') {
            originalSize = getSquareTopLeft(0, 0);
            draggingPiece.style.left = (topLeft.left - originalSize.left) + 'px';
            draggingPiece.style.top = (topLeft.top - originalSize.top) + 'px';
        }
        else {
            originalSize = getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col);
            draggingPiece.style.left = (topLeft.left - originalSize.left) + 'px';
            draggingPiece.style.top = (topLeft.top - originalSize.top) + 'px';
        }
    }
    function getSquareWidthHeight() {
        return {
            width: gameArea.clientWidth / NUM,
            height: gameArea.clientHeight / NUM
        };
    }
    function getSquareTopLeft(row, col) {
        var size = getSquareWidthHeight();
        return { top: row * size.height, left: col * size.width };
    }
    function dragDone(frompos, topos) {
        $rootScope.$apply(function () {
            var msg = 'Dragged piece ' + frompos.row + 'x' + frompos.col + ' to square ' +
                topos.row + 'x' + topos.col;
            log.info(msg);
            msg = msg;
            if (!isYourTurn) {
                return;
            }
            try {
                if (gameLogic.horizontalMoveCheck(frompos, topos, state.board) ||
                    gameLogic.verticalMoveCheck(frompos, topos, state.board) ||
                    gameLogic.diagonalMoveCheck(frompos, topos, state.board)) {
                    var move = gameLogic.createMove(frompos, topos, turnIndex, jsonState);
                    var lastSelected = { row: topos.row, col: topos.col };
                    gameService.makeMove(move);
                    isYourTurn = false;
                    pawnDelta = topos;
                    if (typeExpected === 'X') {
                        draggingPiece.style.display = 'none';
                    }
                }
            }
            catch (e) {
                log.info(['Illegal Move ', frompos, topos]);
            }
        });
    }
    function getIntegersTill(num) {
        var res = [];
        for (var i = 0; i < num; i++) {
            res.push(i);
        }
        return res;
    }
    game.getIntegersTill = getIntegersTill;
    var rows = getIntegersTill(NUM);
    var cols = getIntegersTill(NUM);
    //initialise the game using this function call to updateUI
    //updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    function updateUI(params) {
        jsonState = angular.toJson(params.stateAfterMove, true);
        state = params.stateAfterMove;
        // var board = state.board;
        typeExpected = params.move && params.move[1] && params.move[1].set && params.move[1].set.value ? params.move[1].set.value.pawn : 'A';
        if (state.board === undefined) {
            state.board = gameLogic.getInitialBoard();
        }
        isYourTurn = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove &&
            params.endMatchScores === null; // it's my turn
        turnIndex = params.turnIndexAfterMove;
        // Is it the computer's turn?
        if (isYourTurn &&
            params.playersInfo[params.yourPlayerIndex].playerId === '') {
            isYourTurn = false;
            $timeout(sendComputerMove, 1000);
        }
    }
    function sendComputerMove() {
        gameService.makeMove(gameLogic.createComputerMove(jsonState, turnIndex));
    }
    function isPawn(row, col, pawn) {
        if (state.board[row][col] === pawn) {
            return true;
        }
        return false;
    }
    game.isPawn = isPawn;
    function isNotPawn(row, col) {
        if (state.board[row][col] === 'A' ||
            state.board[row][col] === 'B' ||
            state.board[row][col] === 'X') {
            return false;
        }
        else {
            return true;
        }
    }
    game.isNotPawn = isNotPawn;
    function isWTurn() {
        if (turnIndex === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    game.isWTurn = isWTurn;
    function isSelected(row, col) {
        if (row === lastSelected.row && col === lastSelected.col) {
            return true;
        }
        else {
            return false;
        }
    }
    game.isSelected = isSelected;
    function isBTurn() {
        if (turnIndex === 1) {
            return true;
        }
        else {
            return false;
        }
    }
    game.isBTurn = isBTurn;
})(game || (game = {}));
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    translate.setLanguage('en', {
        "AMAZONS_GAME": "Game of the Amazons",
        "RULES_OF_AMAZONS": "Rules of Amazons",
        "RULES_SLIDE0": "Each player has four amazons, and a supply of arrows. White moves first, and the players alternate moves thereafter.",
        "RULES_SLIDE1": "1. Move one amazon one or more empty squares in a straight line (orthogonally or diagonally).",
        "RULES_SLIDE2": "2. The amazon shoots an arrow from its landing square to another square, using another queenlike move.",
        "RULES_SLIDE3": "An arrow and an amazon cannot cross or enter a square where another arrow or an amazon of either color occupies.",
        "RULES_SLIDE4": "When you play, try to block the other player. The last player to be able to make a move wins.",
        "CLOSE": "Start Game"
    });
    game.init();
});
