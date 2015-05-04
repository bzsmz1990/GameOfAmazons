angular.module('myApp')
  .controller('Ctrl', ['$scope', '$log','$timeout', '$rootScope', 'gameService',
    'gameLogic', 'resizeGameAreaService', 'dragAndDropService',
    function ($scope, $log, $timeout, $rootScope, gameService,
      gameLogic, resizeGameAreaService, dragAndDropService) {

    'use strict';
    resizeGameAreaService.setWidthToHeight(1);

    var gameArea = document.getElementById('gameArea');
    var NUM = 10; // num of rows and cols
    var draggingStartedRowCol = null;
    var draggingPiece = null;
    var nextZIndex = 61;

    function handleDragEvent(type, clientX, clientY) {
      // Center point in gameArea
      var x = clientX - gameArea.offsetLeft;
      var y = clientY - gameArea.offsetTop;

      // Is outside gameArea?
      if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
        if (!draggingPiece) {
          return;
        }
          // Drag the piece where the touch is (without snapping to a square).
        var size = getSquareWidthHeight();
        setDraggingPieceTopLeft({top: y - size.height / 2, left: x - size.width / 2}, $scope.typeExpected);
        if (type === "touchend"){
          if ($scope.typeExpected === 'X') {
            draggingPiece.style.display = 'none';
          }
        }
      } else {
        // Inside gameArea
        var col = Math.floor(NUM * x / gameArea.clientWidth);
        var row = Math.floor(NUM * y / gameArea.clientHeight);

        if (type === "touchstart" && !draggingStartedRowCol) {
          if ($scope.board[row][col] === $scope.typeExpected && $scope.isYourTurn && $scope.typeExpected !== 'X') {
            draggingStartedRowCol = {row: row, col: col};
            draggingPiece = document.getElementById("piece"+$scope.typeExpected+"_"+row+"x"+col);
            draggingPiece.style['z-index'] = ++nextZIndex;
          }else if ($scope.isYourTurn && $scope.typeExpected === 'X') {
              draggingStartedRowCol = pawnDelta;
              draggingPiece = document.getElementById("pieceX_drag");
              setDraggingPieceTopLeft(getSquareTopLeft(row, col), $scope.typeExpected);
              draggingPiece.style['z-index'] = ++nextZIndex;
              draggingPiece.style.display = 'inline';
           }
        }
        if (!draggingPiece) {
          return;
        }

        if (type === "touchend") {
          var frompos = draggingStartedRowCol;
          var topos = {row: row, col: col};
          dragDone(frompos, topos);
        } else {
            setDraggingPieceTopLeft(getSquareTopLeft(row, col), $scope.typeExpected);
        }
      }

      if (type === "touchend" ||
          type === "touchcancel" || type === "touchleave") {
        // drag ended
        // return the piece to it's original style (then angular will take care to hide it).
        setDraggingPieceTopLeft(getSquareTopLeft(draggingStartedRowCol.row, draggingStartedRowCol.col), $scope.typeExpected);

        if (type !== 'touchend' && $scope.typeExpected === 'X') {
          draggingPiece.style.display = 'none';
        }
        draggingStartedRowCol = null;
        //draggingPiece.removeAttribute("style"); // trying out
        draggingPiece = null;
      }

    }
    dragAndDropService.addDragListener("gameArea", handleDragEvent);

    function isInvalidPos(topLeft) {
      var size = getSquareWidthHeight();
      var row = Math.floor(topLeft.top / size.height);
      var col = Math.floor(topLeft.left / size.width);
      return row >= 0 && row <= 9 && col >= 0 && col <= 9 && $scope.board[row][col] !== '';
    }

    function setDraggingPieceTopLeft(topLeft, mType) {
      var originalSize;
      var row = draggingStartedRowCol.row;
      var col = draggingStartedRowCol.col;

      if (isInvalidPos(topLeft)) {
        return;
      }

      originalSize = mType !== 'X' ? getSquareTopLeft(row, col) : getSquareTopLeft(0, 0);
      draggingPiece.style.left = topLeft.left - originalSize.left + 'px';
      draggingPiece.style.top = topLeft.top - originalSize.top + 'px';
    }

    function getSquareWidthHeight() {
      return {
        width: gameArea.clientWidth / NUM,
        height: gameArea.clientHeight / NUM
      };
    }

    function getSquareTopLeft(row, col) {
      var size = getSquareWidthHeight();
      return {top: row * size.height, left: col * size.width};
    }

    function dragDone(frompos, topos) {
      $rootScope.$apply(function() {
        var msg = 'Dragged piece ' + frompos.row + 'x' + frompos.col + ' to square ' +
          topos.row + 'x' + topos.col;
        $log.info(msg);
        $scope.msg = msg;

        if (!$scope.isYourTurn) {
          return;
        }

        try {
          if (gameLogic.horizontalMoveCheck(frompos,topos,$scope.board)||
            	gameLogic.verticalMoveCheck(frompos,topos,$scope.board)  ||
            	gameLogic.diagonalMoveCheck(frompos,topos,$scope.board)) {
                var move = gameLogic.createMove(frompos, topos, $scope.turnIndex, $scope.jsonState);
                lastSelected = {row: topos.row, col: topos.col};
                gameService.makeMove(move);
                $scope.isYourTurn = false;
                pawnDelta = topos;
                if ($scope.typeExpected === 'X') {
                  draggingPiece.style.display = 'none';
                }
              }
        } catch (e) {
          $log.info(['Illegal Move ', frompos, topos]);
        }
      });
    }

    function getIntegersTill(number) {
      var res = [];
      for (var i = 0; i < number; i++) {
        res.push(i);
      }
      return res;
    }
    $scope.rows = getIntegersTill(NUM);
    $scope.cols = getIntegersTill(NUM);
    $scope.rowsNum = NUM;
    $scope.colsNum = NUM;

    //Globals to detect 2 clicks then make move
    //var pawnPosition = {row:'',col:''};
    var pawnDelta = {row:'',col:''};
    var lastSelected = {row:'', col:''};
    //var movCtr = 2;
    //var moveType = 2;

    function sendComputerMove() {
      gameService.makeMove(
          gameLogic.createComputerMove($scope.jsonState,$scope.turnIndex));
    }

    $scope.isPawn = function(row,col,pawn){
    	if($scope.board[row][col]===pawn){
    		return true;}
    };

    $scope.isNotPawn = function(row,col){
      if($scope.board[row][col]==='A' ||
        $scope.board[row][col]==='B' ||
        $scope.board[row][col]==='X'){
        return false;
      }
      else {
        return true;
      }
    };

    $scope.isWTurn = function(){
    	if($scope.turnIndex===0){
    	return true;
    	}
    	else{
    	return false;
    	}
    };

    $scope.isSelected = function(row,col){
    	if(row===lastSelected.row && col===lastSelected.col){
//     		console.log('Found true');
    		return true;
    	}
    	else{
//     		console.log('Found false');
    		return false;
    	}
    };

    $scope.isBTurn = function(){
    	if($scope.turnIndex===1){
    	return true;
    	}
    	else{
    	return false;
    	}
    };


    //initialise the game using this function call to updateUI
    //updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    function updateUI(params) {
      $scope.jsonState = angular.toJson(params.stateAfterMove, true);
      $scope.board = params.stateAfterMove.board;
      $scope.typeExpected = params.move && params.move[1] && params.move[1].set && params.move[1].set.value ? params.move[1].set.value.pawn : 'A';

      if ($scope.board === undefined) {
        $scope.board = gameLogic.getInitialBoard();
      }
      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove &&
        params.endMatchScores === null; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;

     // Is it the computer's turn?
      if ($scope.isYourTurn &&
          params.playersInfo[params.yourPlayerIndex].playerId === '') {
        $scope.isYourTurn = false;
        // Wait 500 milliseconds until animation ends.
        $timeout(sendComputerMove, 1000);
      }
    }

    gameService.setGame({
      gameDeveloperEmail: "hy821@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame(),
      riddles: gameLogic.getRiddles(),
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  }]);
