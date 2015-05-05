angular.module('myApp', ['ngTouch', 'ui.bootstrap']).factory('gameLogic', function () {
  'use strict';
  function isEqual(object1, object2) {
    return angular.equals(object1, object2);
  }

  function copyObject(object) {
    return angular.copy(object);
  }

  function getInitialBoard(){

  	var i,j,board=[];

    for(i=0;i<10;i+=1)
      {
          board[i]=[];
          for(j=0;j<10;j+=1)
            {
              board[i][j]='';
            }
      }

    board[0][3]='A';board[0][6]='A';board[3][0]='A';board[3][9]='A';
    board[6][0]='B';board[6][9]='B';board[9][3]='B';board[9][6]='B';

    return board;
    }

  function init(){

    var board = getInitialBoard();
    return {'turnInfo':{ctr:2,pawn:'A'},'pawnDelta':{row:'',col:''},'board':board};

  }

//function to check if the pawn at i,j can make valid move and return 1 if true else 0
  function canMove(i,j,board){
    var loop = {rowFrom:0,rowTo:0,colFrom:0,colTo:0}, x, y;

    if(i===0 && j===0){loop = {rowFrom:0,rowTo:1,colFrom:0,colTo:1};}
    else if (i===0 && j===9){loop = {rowFrom:0,rowTo:1,colFrom:8,colTo:9};}
    else if (i===9 && j===0){loop = {rowFrom:8,rowTo:9,colFrom:0,colTo:1};}
    else if (i===9 && j===9){loop = {rowFrom:8,rowTo:9,colFrom:8,colTo:9};}
    else if (i===0 && j>0 && j<9){loop = {rowFrom:0,rowTo:1,colFrom:j-1,colTo:j+1};}
    else if (i>0 && i<9 && j===0){loop = {rowFrom:i-1,rowTo:i+1,colFrom:0,colTo:1};}
    else if (i===9 && j>0 && j<9){loop = {rowFrom:8,rowTo:9,colFrom:j-1,colTo:j+1};}
    else if (i>0 && i<9 && j===9){loop = {rowFrom:i-1,rowTo:i+1,colFrom:8,colTo:9};}
    else{loop = {rowFrom:i-1,rowTo:i+1,colFrom:j-1,colTo:j+1};}

    for(x=loop.rowFrom;x<=loop.rowTo;x+=1){
      for(y=loop.colFrom;y<=loop.colTo;y+=1){
        if(board[x][y]===''){return 1;}
      }
    }


    return 0;
  }

  function getWinner(board,turnIndex){
    var Actr=0,Bctr=0,i,j;

    for(i=0;i<10;i+=1){
      for (j=0;j<10;j+=1){
        if(board[i][j] === 'A'){ Actr += canMove(i,j,board);}
          else if(board[i][j] === 'B'){ Bctr += canMove(i,j,board);}
      }
    }

    if (turnIndex==='A' && Bctr === 0){return 'A';}
    if (turnIndex==='B' && Actr === 0){return 'B';}
    return '';

  }

  function createMove(pawnPosition, pawnDelta, turnIndexBeforeMove, stateBeforeMove){

  	if(stateBeforeMove==="{}")
  	{
  		stateBeforeMove = init();
  	}
  	else
  	{
  		var temp = angular.fromJson(stateBeforeMove);
  		stateBeforeMove = temp;
  	}

  	if(turnIndexBeforeMove===0) {turnIndexBeforeMove = {turnIndex:0};}
  	if(turnIndexBeforeMove===1) {turnIndexBeforeMove = {turnIndex:1};}

    var board = stateBeforeMove.board,
    	turnInfo = stateBeforeMove.turnInfo,
    	newTurn = turnIndexBeforeMove,        //copy value of current turn
    	newTurnInfo = turnInfo,
        pp = pawnPosition,
        pd = pawnDelta,
        winner,
        result;


    var boardAfterMove = copyObject(board);

    if (board[pawnDelta.row][pawnDelta.col] !== '') {
      throw new Error("pawn must land in empty position");
    }

	if(turnInfo.ctr===2){
      if(board[pawnPosition.row][pawnPosition.col]!==turnInfo.pawn){
        throw new Error("pawn has to exist at position");
      }
      else{
        boardAfterMove[pawnPosition.row][pawnPosition.col] = '';
      }
    }

    if(turnInfo.ctr===1){
      if(pawnPosition.row===stateBeforeMove.pawnDelta.row &&
      		pawnPosition.col===stateBeforeMove.pawnDelta.col)
      		{
      			if((turnIndexBeforeMove.turnIndex===0 &&
      				board[pawnPosition.row][pawnPosition.col]!=='A') ||
      				(turnIndexBeforeMove.turnIndex===1 &&
      				board[pawnPosition.row][pawnPosition.col]!=='B'))
      				{
        				throw new Error("player has to shoot arrow from the same place");
        			}
      		}
      else{
        throw new Error("Wrong position for shooting arrow");
      }
    }


    boardAfterMove[pawnDelta.row][pawnDelta.col] = turnInfo.pawn;//pawnName can be X,A or B

    if(turnInfo.ctr === 1)
    {
      winner = getWinner(boardAfterMove,boardAfterMove[pawnPosition.row][pawnPosition.col]);
      if(winner==='')
      {
          if(turnIndexBeforeMove.turnIndex===0){newTurn.turnIndex=1;newTurnInfo.ctr=2;newTurnInfo.pawn='B';}
          else if(turnIndexBeforeMove.turnIndex===1){newTurn.turnIndex=0;newTurnInfo.ctr=2;newTurnInfo.pawn='A';}
      }
      else
      {
        result = {endMatch: {endMatchScores:(winner === 'A' ? [1, 0] : (winner === 'B' ? [0, 1] : [0, 0]))}};
        newTurnInfo = {ctr:'',pawn:''};
        var winnerstring = (winner === 'A' ? 'Game Over! White player wins' : 'Game over! Black Player wins');
        window.alert(winnerstring);
        return [result,
                {set: {key: 'turnInfo', value: newTurnInfo}},
                {set: {key: 'pawnPosition', value :{row:pp.row, col:pp.col}}},
                {set: {key: 'pawnDelta', value :{row:pd.row, col:pd.col}}},
                {set: {key: 'board', value: boardAfterMove}}];
      }
    }
    else
    {
      newTurnInfo.ctr = 1;newTurnInfo.pawn = 'X';		//ctr was 2 so make it 1 and change pawn name,player remains same
    }


    return [{setTurn:newTurn},
    		{set: {key: 'turnInfo', value: newTurnInfo}},
            {set: {key: 'pawnPosition', value :{row:pp.row, col:pp.col}}},
            {set: {key: 'pawnDelta', value :{row:pd.row, col:pd.col}}},
            {set: {key: 'board', value: boardAfterMove}}];

  }

  function horizontalMoveCheck(pos1,pos2,board){

    var i,greaterpos,lesserpos;
    if(Math.abs(pos1.row - pos2.row) === 0){
      if(pos2.col > pos1.col){
        greaterpos = pos2;
        lesserpos = pos1;
        for (i=lesserpos.col+1; i<=greaterpos.col; i+=1){
          if(board[greaterpos.row][i] !== ''){
            return false;
          }
        }
      }
      else{
        greaterpos = pos1;
        lesserpos = pos2;
        for (i=greaterpos.col-1; i>=lesserpos.col; i-=1){
          if(board[greaterpos.row][i] !== ''){
            return false;
          }
        }
      }
    }
    else{
      return false;
    }

    return true;
  }											//check to see if move is horizontal, and if all squares between current
                                              //position and new position are unoccupied
  function verticalMoveCheck(pos1,pos2,board){

    var greaterpos,lesserpos,i;
    if(Math.abs(pos1.col - pos2.col) === 0){
      if(pos2.row > pos1.row){
        greaterpos = pos2;
        lesserpos = pos1;
        for (i=lesserpos.row+1; i<=greaterpos.row; i+=1){
          if(board[i][greaterpos.col] !== ''){
            return false;
          }
        }
      }
      else{
        greaterpos = pos1;
        lesserpos = pos2;
        for (i=greaterpos.row-1; i>=lesserpos.row; i-=1){
          if(board[i][greaterpos.col] !== ''){
            return false;
          }
        }
      }
    }
    else{
      return false;
    }
    return true;
  }

  function diagonalMoveCheck(pos1,pos2,board){

    var greaterpos,lesserpos,i,j;
    if(Math.abs(pos1.row - pos2.row) === Math.abs(pos1.col - pos2.col)){
      greaterpos = pos2;
      lesserpos = pos1;

      if(pos2.col > pos1.col && pos2.row < pos1.row){	//NE direction
        i=lesserpos.row-1;j=lesserpos.col+1;
        while(i>=greaterpos.row && j<=greaterpos.col){
          if(board[i][j] !== ''){
            return false;
          }
          i-=1;j+=1;
        }
      }

      else if(pos2.col > pos1.col && pos2.row > pos1.row){								//SE direction
        i=lesserpos.row+1;j=lesserpos.col+1;
        while(i<=greaterpos.row && j<=greaterpos.col){
          if(board[i][j] !== ''){
            return false;
          }
          i+=1;j+=1;
        }
      }
      else if(pos2.col < pos1.col && pos2.row > pos1.row){								//SW direction
        i=lesserpos.row+1;j=lesserpos.col-1;
          while(i<=greaterpos.row && j>=greaterpos.col){
          if(board[i][j] !== ''){
            return false;
          }
          i+=1;j-=1;
        }
      }

      else if(pos2.col < pos1.col && pos2.row < pos1.row){								//NW direction
        i=lesserpos.row-1;j=lesserpos.col-1;
        while(i>=greaterpos.row && j>=greaterpos.col){
          if(board[i][j] !== ''){
            return false;
          }
          i-=1;j-=1;
        }
      }
    }

    else{
        return false;
    }

    return true;
}

  function getExampleGame(){
  	var game = [
  				  {
  				   turnIndexBeforeMove:{turnIndex:0},
  				   stateBeforeMove:{turnInfo:{ctr:2,pawn:'A'},pawnDelta:{row:'',col:''},
  				   											  board:[['','','','A','','','A','','',''],
                                      								['','','','','','','','','',''],
                                      								['','','','','','','','','',''],
                                      								['A','','','','','','','','','A'],
                                      								['','','','','','','','','',''],
                                      								['','','','','','','','','',''],
                                      								['B','','','','','','','','','B'],
                                    								['','','','','','','','','',''],
                                      								['','','','','','','','','',''],
                                      								['','','','B','','','B','','','']]},
                    move:[{setTurn:{turnIndex:0}},
                    	  {set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          				  {set: {key: 'pawnPosition', value: {row:0, col:3}}},
          				  {set: {key: 'pawnDelta', value: {row:0, col:4}}},
          				  {set: {key: 'board', value: [['','','','','A','','A','','',''],
                                      				   ['','','','','','','','','',''],
                                      				   ['','','','','','','','','',''],
                                                       ['A','','','','','','','','','A'],
                                             		   ['','','','','','','','','',''],
                          				               ['','','','','','','','','',''],
                  				                       ['B','','','','','','','','','B'],
                    				                   ['','','','','','','','','',''],
                 				                       ['','','','','','','','','',''],
                				                       ['','','','B','','','B','','','']]}}],
                    comment:"player 0 starts and moves his pawn from (0,3) to (0,4)"
                  },

  				  {
  				   turnIndexBeforeMove:{turnIndex:0},
  				   stateBeforeMove:{turnInfo:{ctr:1,pawn:'X'},pawnDelta:{row:0,col:4},
  				   											  board:[['','','','','A','','A','','',''],
                                      								['','','','','','','','','',''],
                                      								['','','','','','','','','',''],
                                      								['A','','','','','','','','','A'],
                                      								['','','','','','','','','',''],
                                      								['','','','','','','','','',''],
                                      								['B','','','','','','','','','B'],
                                    								['','','','','','','','','',''],
                                      								['','','','','','','','','',''],
                                      								['','','','B','','','B','','','']]},
                    move:[{setTurn:{turnIndex:1}},
                    	  {set: {key: 'turnInfo', value: {ctr:2,pawn:'B'}}},
          				  {set: {key: 'pawnPosition', value: {row:0, col:4}}},
          				  {set: {key: 'pawnDelta', value: {row:9, col:4}}},
          				  {set: {key: 'board', value: [['','','','','A','','A','','',''],
                                      				   ['','','','','','','','','',''],
                                      				   ['','','','','','','','','',''],
                                     				   ['A','','','','','','','','','A'],
                              				           ['','','','','','','','','',''],
                          				               ['','','','','','','','','',''],
              				                           ['B','','','','','','','','','B'],
         				                               ['','','','','','','','','',''],
       					                               ['','','','','','','','','',''],
           					                           ['','','','B','X','','B','','','']]}}],
                    comment:"player 0 shoots arrow from (0,4) to (9,4)"
                  },

            	  {
            	   turnIndexBeforeMove:{turnIndex:1},
  				   stateBeforeMove:{turnInfo:{ctr:2,pawn:'B'},pawnDelta:{row:9,col:4},
  				   											  board:[['','','','','A','','A','','',''],
                                      				   				  ['','','','','','','','','',''],
                                      				   				  ['','','','','','','','','',''],
                                     				   				  ['A','','','','','','','','','A'],
                              					     		          ['','','','','','','','','',''],
                          				               				  ['','','','','','','','','',''],
              				                           				  ['B','','','','','','','','','B'],
         				                               				  ['','','','','','','','','',''],
       					                               				  ['','','','','','','','','',''],
           					                           				  ['','','','B','X','','B','','','']]},
                    move:[{setTurn:{turnIndex:1}},
                    	  {set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          				  {set: {key: 'pawnPosition', value: {row:6, col:0}}},
          				  {set: {key: 'pawnDelta', value: {row:9, col:0}}},
          				  {set: {key: 'board', value: [['','','','','A','','A','','',''],
                                      				   ['','','','','','','','','',''],
                                      	   			   ['','','','','','','','','',''],
                                     				   ['A','','','','','','','','','A'],
                              					       ['','','','','','','','','',''],
                          				               ['','','','','','','','','',''],
              				                           ['','','','','','','','','','B'],
         				                               ['','','','','','','','','',''],
       					                               ['','','','','','','','','',''],
           					                           ['B','','','B','X','','B','','','']]}}],
                    comment:"player 1 now has the turn and moves his pawn from (6,0) to (9,0)"
                  },

            	  {
            	   turnIndexBeforeMove:{turnIndex:1},
  				   stateBeforeMove:{turnInfo:{ctr:1,pawn:'X'},pawnDelta:{row:9, col:0},
  				   											  board:[['','','','','A','','A','','',''],
                                      				   				['','','','','','','','','',''],
                                      	   			   				['','','','','','','','','',''],
                                     				   				['A','','','','','','','','','A'],
                              					       				['','','','','','','','','',''],
                          				          					['','','','','','','','','',''],
              				                           				['','','','','','','','','','B'],
         				                               				['','','','','','','','','',''],
       					                               				['','','','','','','','','',''],
           					                           				['B','','','B','X','','B','','','']]},
                    move:[{setTurn:{turnIndex:0}},
                    	  {set: {key: 'turnInfo', value: {ctr:2,pawn:'A'}}},
          				  {set: {key: 'pawnPosition', value: {row:9, col:0}}},
          				  {set: {key: 'pawnDelta', value: {row:4, col:0}}},
          				  {set: {key: 'board', value: [['','','','','A','','A','','',''],
                                      				   ['','','','','','','','','',''],
                                      	   			   ['','','','','','','','','',''],
                                     				   ['A','','','','','','','','','A'],
                              					       ['X','','','','','','','','',''],
                          				          	   ['','','','','','','','','',''],
              				                           ['','','','','','','','','','B'],
         				                               ['','','','','','','','','',''],
       					                               ['','','','','','','','','',''],
           					                           ['B','','','B','X','','B','','','']]}}],
                    comment:"player 1 shoots arrow from (9,0) to (4,0)"
                  },

            	  {
            	   turnIndexBeforeMove:{turnIndex:0},
  				   stateBeforeMove:{turnInfo:{ctr:2,pawn:'A'},pawnDelta:{row:4, col:0},
  				   											  board:[['','','','','A','','A','','',''],
                                      				   				 ['','','','','','','','','',''],
                                      	   			   				 ['','','','','','','','','',''],
                                     				   				 ['A','','','','','','','','','A'],
                              					       				 ['X','','','','','','','','',''],
                          				          	   				 ['','','','','','','','','',''],
              				                           				 ['','','','','','','','','','B'],
         				                               				 ['','','','','','','','','',''],
       					                               				 ['','','','','','','','','',''],
           					                           				 ['B','','','B','X','','B','','','']]},
                    move:[{setTurn:{turnIndex:0}},
                    	  {set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          				  {set: {key: 'pawnPosition', value: {row:0, col:6}}},
          				  {set: {key: 'pawnDelta', value: {row:0, col:9}}},
          				  {set: {key: 'board', value:[['','','','','A','','','','','A'],
                                      				  ['','','','','','','','','',''],
                                      	   			  ['','','','','','','','','',''],
                                     				  ['A','','','','','','','','','A'],
                              					      ['X','','','','','','','','',''],
                          				          	  ['','','','','','','','','',''],
              				                          ['','','','','','','','','','B'],
         				                              ['','','','','','','','','',''],
       					                              ['','','','','','','','','',''],
           					                          ['B','','','B','X','','B','','','']]}}],
                    comment:"player 0 moves his pawn from (0,6) to (0,9)"
                  }
            	];
    return game;
  }

  function getRiddles(){
  	var riddles = [	{
  					 turnIndexBeforeMove:{turnIndex:1},
  					 stateBeforeMove:{ turnInfo:{ctr:2,pawn:'B'},
  					 				   pawnDelta:{row:'0',col:'2'},
  					 				   board:[['','','X','A','X','X','A','X','',''],
                                      		  ['','','X','X','','X','X','X','',''],
                                      		  ['X','X','','','','','','','X','X'],
                                      		  ['A','X','','','','','','','X','A'],
                                      		  ['X','X','','','','X','','X','X','X'],
                                      		  ['X','X','','','','','','','X','X'],
                                      		  ['B','X','','','','','','','X','B'],
                                    		  ['X','X','','','','','','','X','X'],
                                      		  ['','','X','X','','','','','',''],
                                      		  ['','','X','B','X','X','B','','','']]},

                    move:[{setTurn:{turnIndex:1}},
                    	  {set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          				  {set: {key: 'pawnPosition', value: {row:9, col:3}}},
          				  {set: {key: 'pawnDelta', value: {row:8, col:4}}},
          				  {set: {key: 'board', value: [['','','X','A','X','X','A','X','',''],
                                      		  		   ['','','X','X','','X','X','X','',''],
                                      		  		   ['X','X','','','','','','','X','X'],
                                      		  		   ['A','X','','','','','','','X','A'],
                                      		  		   ['X','X','','','','X','','X','X','X'],
                                      		  		   ['X','X','','','','','','','X','X'],
                                      		  		   ['B','X','','','','','','','X','B'],
                                    		  		   ['X','X','','','','','','','X','X'],
                                      		  		   ['','','X','X','B','','','','',''],
                                      		  		   ['','','X','','X','X','B','','','']]}}],
                    comment:"if B plays a combination of pawn move from 9,3 to 8,4 and then arrow move from 8,4 to 1,4 : B wins"
                  },

                  	{
                  		turnIndexBeforeMove:{turnIndex:0},
  					    stateBeforeMove:{ turnInfo:{ctr:2,pawn:'A'},
  					    				  pawnDelta:{row:'9',col:'3'},
  					 				   board:[['X','','X','','X','X','A','X','',''],
                                      		  ['','','X','X','','X','X','X','',''],
                                      		  ['X','X','','','X','','X','','X','X'],
                                      		  ['A','','','X','A','','','','X','A'],
                                      		  ['X','X','','','','X','','X','X','X'],
                                      		  ['X','','','','X','','','','X','X'],
                                      		  ['B','X','','','','','B','','X',''],
                                    		  ['X','X','','','','','','','X','X'],
                                      		  ['','','X','X','','','','','',''],
                                      		  ['X','','X','B','X','X','B','','','']]},

                    	move:[{setTurn:{turnIndex:0}},
                    		  {set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          				      {set: {key: 'pawnPosition', value: {row:3, col:4}}},
          				      {set: {key: 'pawnDelta', value: {row:5, col:2}}},
          				      {set: {key: 'board', value: [['X','','X','','X','X','A','X','',''],
                                      		  		      ['','','X','X','','X','X','X','',''],
                                      		  		      ['X','X','','','X','','X','','X','X'],
                                      		  		      ['A','','','X','','','','','X','A'],
                                      		  		      ['X','X','','','','X','','X','X','X'],
                                      		  		      ['X','','A','','X','','','','X','X'],
                                      		  		      ['B','X','','','','','B','','X',''],
                                    		  		      ['X','X','','','','','','','X','X'],
                                      		  		      ['','','X','X','','','','','',''],
                                      		  		      ['X','','X','B','X','X','B','','','']]}}],
                    comment:"A moves to 5,2 and can block off pawn B at 6,0 completely by playing his arrow to 5,1"
                }];

        return riddles;
    }

  function createComputerMove(stateBeforeMove, turnIndexBeforeMove){
  	var temp = angular.fromJson(stateBeforeMove);
  	stateBeforeMove = temp;
  	var pawnPosList = [];
  	var pawnDelList = {'1':[],'2':[],'3':[],'4':[]};
  	var pawnPosition,pawnDelta;
  	var i,j,index=1;
  	var board = stateBeforeMove.board;
  	var turnInfo = stateBeforeMove.turnInfo;

//   	console.log(stateBeforeMove);
//   	console.log(turnIndexBeforeMove);

  	if(turnInfo.ctr===2){
  	for(i=0;i<10;i+=1){
  		for(j=0;j<10;j+=1){
  			if((turnIndexBeforeMove===0 && board[i][j]==='A') ||
  				(turnIndexBeforeMove===1 && board[i][j]==='B')){
  				var tempPos = {row:i,col:j};
  				pawnPosList.push(tempPos);
  			}
  		}
  	}
  	}
  	else{
  		pawnPosList.push(stateBeforeMove.pawnDelta);
  	}

  	console.log(pawnPosList);
//   	get list of possible pawndeltas for each pawn positiong and list them as
//   	{1:[{row:..,col:..},{row:..,col:..}..],
//   	 2:[{row:..,col:..},{row:..,col:..}..],
//   	 .
//   	 .
//   	 }
  	for(i = 0; i<pawnPosList.length; i+=1){
  		var pos = pawnPosList[i];
  		for(j=pos.col+1;j<10;j+=1){
  			if(board[pos.row][j] === ''){
  			temp = {row:pos.row,col:j};
  			pawnDelList[index].push(temp);} //East
  			else{break;}}
  		for(j=pos.col-1;j>=0;j-=1){
  			if(board[pos.row][j] === ''){temp = {row:pos.row,col:j};pawnDelList[index].push(temp);} //West
  			else{break;}}
  		for(j=pos.row+1;j<10;j+=1){
  			if(board[j][pos.col] === ''){temp = {row:j,col:pos.col};pawnDelList[index].push(temp);} //south
  			else{break;}}
  		for(j=pos.row-1;j>=0;j-=1){
  			if(board[j][pos.col] === ''){temp = {row:j,col:pos.col};pawnDelList[index].push(temp);} //north
  			else{break;}}

  		var startRow=pos.row+1,startCol=pos.col+1;
  		while(startRow<10 && startCol<10){
  			if(board[startRow][startCol] === ''){
  			temp = {row:startRow,col:startCol};pawnDelList[index].push(temp);startRow+=1;startCol+=1;} //SE
  			else{break;}}

  		startRow=pos.row+1;
      startCol=pos.col-1;
  		while(startRow<10 && startCol>=0){
  			if(board[startRow][startCol] === ''){
  			temp = {row:startRow,col:startCol};pawnDelList[index].push(temp);startRow+=1;startCol-=1;} //SW
  			else{break;}}

  		startRow=pos.row-1;
      startCol=pos.col+1;
  		while(startRow>=0 && startCol<10){
  			if(board[startRow][startCol] === ''){temp = {row:startRow,col:startCol};pawnDelList[index].push(temp);
  			startRow-=1;startCol+=1;} //NE
  			else{break;}}

  		startRow=pos.row-1;
      startCol=pos.col-1;
  		while(startRow>=0 && startCol>=0){
  			if(board[startRow][startCol] === ''){
  			temp = {row:startRow,col:startCol};pawnDelList[index].push(temp);startRow-=1;startCol-=1;} //NW
  			else{break;}}

  		index+=1;
  	}

    var pawnNumber, listLen, pawnDelNumber, tempArray;
    while(1){
            if(turnInfo.ctr===2){
  	             pawnNumber = Math.floor((Math.random()*4)+1);	//get number between 1 and 4
  	        }
  	        else{
  	             pawnNumber = 1;
            }
            pawnPosition = pawnPosList[pawnNumber-1];			    //get pawn Position of that pawn
  	        listLen = pawnDelList[pawnNumber].length;     //get length of array of that pawns possible moves
            if (listLen !== 0){
              break;
            }
    }

    pawnDelNumber = Math.floor((Math.random()*listLen)); // generate a random number between 0 and length from prev step
  	tempArray = pawnDelList[pawnNumber];				//extract the array from the main list
  	pawnDelta = tempArray[pawnDelNumber];				    //get delta position at random index using pawnDelNumber

  	console.log(pawnPosition,pawnDelta);
  	var randomMove = createMove(pawnPosition,pawnDelta,turnIndexBeforeMove,stateBeforeMove);

  	return randomMove;
  }

  function isMoveOk(params){
	var move = params.move,
    turnIndexBeforeMove = params.turnIndexBeforeMove,
    stateBeforeMove = params.stateBeforeMove,
    expectedMove,
    board = stateBeforeMove.board;

//    console.log(params)

 	turnIndexBeforeMove = (turnIndexBeforeMove===0) ? {turnIndex:0} : {turnIndex:1};

	if(board===undefined){
      stateBeforeMove = init();
      board = stateBeforeMove.board;
    }

    var pawnDelta = move[3].set.value,
    pawnPosition = move[2].set.value;

//    var x = new Error();

 	try{
      	if (horizontalMoveCheck(pawnPosition,pawnDelta,board) ||
          	verticalMoveCheck(pawnPosition,pawnDelta,board)  ||
          	diagonalMoveCheck(pawnPosition,pawnDelta,board))
        {

		  		expectedMove = createMove(pawnPosition,pawnDelta,turnIndexBeforeMove,stateBeforeMove);
        		if(isEqual(move,expectedMove))
        		{
        			return true;
        		}
        		else
        		{
        			return false;
        		}
      	}
      	else
      	{
      		return false;
      	}
    }
	catch(x)
	{
	//	console.log(x);
		return false;
	}
	}

  return {
    isMoveOk : isMoveOk,
    createMove : createMove,
    createComputerMove : createComputerMove,
    getInitialBoard : getInitialBoard,
    getExampleGame : getExampleGame,
    getRiddles : getRiddles,
    horizontalMoveCheck : horizontalMoveCheck,
    verticalMoveCheck : verticalMoveCheck,
    diagonalMoveCheck : diagonalMoveCheck,
  };

});
;angular.module('myApp')
  .controller('Ctrl', ['$scope', '$log','$timeout', '$rootScope', 'gameService',
    'gameLogic', 'resizeGameAreaService', 'dragAndDropService', '$translate',
    function ($scope, $log, $timeout, $rootScope, gameService,
      gameLogic, resizeGameAreaService, dragAndDropService, $translate) {

    'use strict';
    console.log('Translation of RULES_OF_AMAZONS is ' + $translate('RULES_OF_AMAZONS'));
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
