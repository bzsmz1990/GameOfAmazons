describe("In Game of the Amazons", function() {

	'use strinct';

	var gameOfAmazonsLogic;

	beforeEach(module("myApp.gameLogic"));

	beforeEach(inject(function(gameLogic){
		gameOfAmazonsLogic = gameLogic;
	}));


  function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
    expect(gameOfAmazonsLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: stateBeforeMove,
      move: move})).toBe(true);
  }

  function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
    expect(gameOfAmazonsLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: stateBeforeMove,
      move: move})).toBe(false);
  }

  it("moving pawn A from (0,3) to (3,3) initially", function() {
    expectMoveOk({turnIndex:0}, {},
      [{setTurn:{turnIndex:0}},
      	{set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          {set: {key: 'pawnPosition', value :{row:0, col:3}}},
          {set: {key: 'pawnDelta', value :{row:3, col:3}}},
          {set: {key: 'board', value: [['','','','','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','A','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']]}}]);

});


it("moving pawn A diagonally from (8,4) to (3,9)", function() {
    expectIllegalMove({turnIndex:0},{ turnInfo:{ctr:2,pawn:'A'},
    								  pawnDelta:{row:3,col:3},
    								  board:[['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','X'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','A','','','','',''],
                                      ['','','','B','','','B','','','']] },
      [{setTurn:{turnIndex:0}},
      	{set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          {set: {key: 'pawnPosition', value: {row:8, col:4}}},
          {set: {key: 'pawnDelta', value: {row:3, col:9}}},
          {set: {key: 'board', value: [['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']]}}]);


});

it("moving pawn B diagonally from (9,3) to (6,0)", function() {
    expectIllegalMove({turnIndex:1},{turnInfo:{ctr:2,pawn:'B'},
    								 pawnDelta:{row:0,col:3},
    								 board:[['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','',''],
                                      ['X','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']] },
      [{setTurn:{turnIndex:1}},
      	{set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          {set: {key: 'pawnPosition', value: {row:9, col:3}}},
          {set: {key: 'pawnDelta', value: {row:6, col:0}}},
          {set: {key: 'board', value: [['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','B','','','']]}}]);


});


it("board mismatch", function() {
    expectIllegalMove({turnIndex:0},{ turnInfo:{ctr:2,pawn:'A'},
    								  pawnDelta:{row:'',col:''},
    								  board:[['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']] },
      [{setTurn:{turnIndex:0}},
      	{set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          {set: {key: 'pawnPosition', value: {row:0, col:3}}},
          {set: {key: 'pawnDelta', value: {row:3, col:3}}},
          {set: {key: 'board', value: [['','','','X','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','A','','','X','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','2','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['1','','','X','','','B','','','']]}}]);

});


it("Wrong player's turn", function() {
    expectIllegalMove({turnIndex:0},{ turnInfo:{ctr:1,pawn:'X'},
    								  pawnDelta:{row:3,col:3},
    								  board:[['','','','','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','A','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']] },
      [{setTurn:{turnIndex:0}},
       {set: {key: 'turnInfo', value: {ctr:2,pawn:'A'}}},
          {set: {key: 'pawnPosition', value: {row:3, col:3}}},
          {set: {key: 'pawnDelta', value: {row:0, col:4}}},
          {set: {key: 'board', value: [['','','','','X','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','A','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']]}}]);

});

it("Arrow not shot from correct position by 'A'", function() {
    expectIllegalMove({turnIndex:0},{ turnInfo:{ctr:1,pawn:'X'},
    								  pawnDelta:{row:3,col:3},
    								  board:[['','','','','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','A','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']] },
      [{setTurn:{turnIndex:1}},
       {set: {key: 'turnInfo', value: {ctr:2,pawn:'B'}}},
          {set: {key: 'pawnPosition', value: {row:0, col:6}}},
          {set: {key: 'pawnDelta', value: {row:0, col:4}}},
          {set: {key: 'board', value: [['','','','','X','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','A','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']]}}]);

});

it("Arrow not shot by correct player from correct position", function() {
    expectIllegalMove({turnIndex:1},{ turnInfo:{ctr:1,pawn:'X'},
    								  pawnDelta:{row:9,col:0},
    								  board:[['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','B','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','B','','','']] },
      [{setTurn:{turnIndex:0}},
      	{set: {key: 'turnInfo', value: {ctr:2,pawn:'A'}}},
          {set: {key: 'pawnPosition', value: {row:9, col:0}}},
          {set: {key: 'pawnDelta', value: {row:9, col:3}}},
          {set: {key: 'board', value: [['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','B','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','X','','','B','','','']]}}]);

});

it("B has last turn from SE corner", function() {
    expectMoveOk({turnIndex:1},{ turnInfo:{ctr:1,pawn:'X'},
    							 pawnDelta:{row:9,col:9},
    							 board:[['X','X','X','X','X','X','X','A','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['A','X','X','A','X','X','X','X','X','A'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['B','X','X','X','X','X','X','X','X','B'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','B','X','X','X','X','','B']] },
      [{setTurn:{GameOver : {WinnerIs: 'B'}}},
      	{set: {key: 'turnInfo', value: {ctr:'',pawn:''}}},
          {set: {key: 'pawnPosition', value: {row:9, col:9}}},
          {set: {key: 'pawnDelta', value: {row:9, col:8}}},
          {set: {key: 'board', value: [['X','X','X','X','X','X','X','A','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['A','X','X','A','X','X','X','X','X','A'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['B','X','X','X','X','X','X','X','X','B'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','B','X','X','X','X','X','B']]}}]);

});

it("A has last turn from NE corner", function() {
    expectMoveOk({turnIndex:0},{ turnInfo:{ctr:1,pawn:'X'},
    							 pawnDelta:{row:0,col:9}, board:[['X','X','X','X','X','X','X','X','','A'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['A','X','X','A','X','X','X','X','X','A'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['B','X','X','X','X','X','X','X','X','B'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','B','X','X','X','X','X','B']] },
      [{setTurn:{GameOver : {WinnerIs: 'A'}}},
          {set: {key: 'turnInfo', value: {ctr:'',pawn:''}}},
          {set: {key: 'pawnPosition', value: {row:0, col:9}}},
          {set: {key: 'pawnDelta', value: {row:0, col:8}}},
          {set: {key: 'board', value: [['X','X','X','X','X','X','X','X','X','A'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['A','X','X','A','X','X','X','X','X','A'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['B','X','X','X','X','X','X','X','X','B'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','B','X','X','X','X','X','B']]}}]);

});

it("Both A and B have turns from corners", function() {
    expectMoveOk({turnIndex:0},{ turnInfo:{ctr:1,pawn:'X'},
    							 pawnDelta:{row:0,col:0},
    							 board:[['A','','X','X','X','X','X','X','X','A'],
                                      ['X','','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['A','X','','A','X','','X','X','X','A'],
                                      ['X','X','X','X','X','X','','X','X','X'],
                                      ['X','X','X','','','','X','X','X','X'],
                                      ['B','X','X','X','X','X','X','X','X','B'],
                                      ['X','X','X','X','X','X','','X','X','X'],
                                      ['','','X','X','X','','X','X','X','X'],
                                      ['B','X','X','','','','X','X','X','B']] },
      [{setTurn:{turnIndex:1}},
      {set: {key: 'turnInfo', value: {ctr:2,pawn:'B'}}},
          {set: {key: 'pawnPosition', value: {row:0, col:0}}},
          {set: {key: 'pawnDelta', value: {row:1, col:1}}},
          {set: {key: 'board', value: [['A','','X','X','X','X','X','X','X','A'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['X','X','X','X','X','X','X','X','X','X'],
                                      ['A','X','','A','X','','X','X','X','A'],
                                      ['X','X','X','X','X','X','','X','X','X'],
                                      ['X','X','X','','','','X','X','X','X'],
                                      ['B','X','X','X','X','X','X','X','X','B'],
                                      ['X','X','X','X','X','X','','X','X','X'],
                                      ['','','X','X','X','','X','X','X','X'],
                                      ['B','X','X','','','','X','X','X','B']] }}]);

});

it("Moving wrong pawn", function() {
    expectIllegalMove({turnIndex:0},{ turnInfo:{ctr:2,pawn:'A'},
    								  pawnDelta:{row:9,col:4},
    								  board:[['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','B','X','','','B','','','']] },
      [{setTurn:{turnIndex:0}},
      {set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          {set: {key: 'pawnPosition', value: {row:0, col:0}}},
          {set: {key: 'pawnDelta', value: {row:0, col:1}}},
          {set: {key: 'board', value: [['','','','A','','','A','','',''],
                                      ['','A','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','B','X','','','B','','','']]}}]);

});

it("Switching turns from player 2 to 1", function() {
    expectMoveOk({turnIndex:1},{ turnInfo:{ctr:1,pawn:'X'},
    							 pawnDelta:{row:9,col:3},
    							 board:[['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']] },
      [{setTurn:{turnIndex:0}},
      {set: {key: 'turnInfo', value: {ctr:2,pawn:'A'}}},
          {set: {key: 'pawnPosition', value: {row:9, col:3}}},
          {set: {key: 'pawnDelta', value: {row:9, col:0}}},
          {set: {key: 'board', value: [['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['X','','','B','','','B','','','']]}}]);


});

it("moving pawn horizontally to place occupied on the left", function() {
    expectIllegalMove({turnIndex:0},
    			 { turnInfo:{ctr:1,pawn:'X'},
    			   pawnDelta:{row:3,col:3}, board:[['','','','','','','A','','',''],
                                                   ['','','','','','','','','',''],
                                      			   ['','','','','','','','','',''],
                                      			   ['','','A','A','','','','','','A'],
                                                   ['','','','','','','','','',''],
                                                   ['','','','','','','','','',''],
                                                   ['B','','','','','','','','','B'],
                                                   ['','','','','','','','','',''],
                                                   ['','','','','','','','','',''],
                                                   ['','','','B','','','B','','','']] },
      			[{setTurn:{turnIndex:1}},
      			{set: {key: 'turnInfo', value: {ctr:2,pawn:'B'}}},
          		 {set: {key: 'pawnPosition', value: {row:3, col:3}}},
          		 {set: {key: 'pawnDelta', value: {row:3, col:2}}},
          		 {set: {key: 'board', value: [['','','','','','','A','','',''],
                                      		  ['','','','','','','','','',''],
                                       			['','','','','','','','','',''],
                                      			['','','X','A','','','','','','A'],
                                      			['','','','','','','','','',''],
                                      			['','','','','','','','','',''],
                                      			['B','','','','','','','','','B'],
                                      			['','','','','','','','','',''],
                                      			['','','','','','','','','',''],
                                      			['','','','B','','','B','','','']]}}]);


});

it("moving pawn horizontally to place occupied on the right", function() {
    expectIllegalMove({turnIndex:0},
    			 { turnInfo:{ctr:1,pawn:'X'},
    			   pawnDelta:{row:3,col:3}, board:[['','','','','','','A','','',''],
                                                   ['','','','','','','','','',''],
                                      			   ['','','','','','','','','',''],
                                      			   ['','','A','A','','','','','','A'],
                                                   ['','','','','','','','','',''],
                                                   ['','','','','','','','','',''],
                                                   ['B','','','','','','','','','B'],
                                                   ['','','','','','','','','',''],
                                                   ['','','','','','','','','',''],
                                                   ['','','','B','','','B','','','']] },
      			[{setTurn:{turnIndex:1}},
      			{set: {key: 'turnInfo', value: {ctr:2,pawn:'B'}}},
          		 {set: {key: 'pawnPosition', value: {row:3, col:3}}},
          		 {set: {key: 'pawnDelta', value: {row:3, col:9}}},
          		 {set: {key: 'board', value: [['','','','','','','A','','',''],
                                      		  ['','','','','','','','','',''],
                                       			['','','','','','','','','',''],
                                      			['','','X','A','','','','','','X'],
                                      			['','','','','','','','','',''],
                                      			['','','','','','','','','',''],
                                      			['B','','','','','','','','','B'],
                                      			['','','','','','','','','',''],
                                      			['','','','','','','','','',''],
                                      			['','','','B','','','B','','','']]}}]);


});

it("moving pawn vertically below to place occupied", function() {
    expectIllegalMove({turnIndex:0},
											{turnInfo:{ctr:1,pawn:'X'},
    								  pawnDelta:{row:3,col:3}, board:[['','','','','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','A','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']] },
      [{setTurn:{turnIndex:1}},
       {set: {key: 'turnInfo', value: {ctr:2,pawn:'B'}}},
          {set: {key: 'pawnPosition', value: {row:3, col:3}}},
          {set: {key: 'pawnDelta', value: {row:9, col:3}}},
          {set: {key: 'board', value: [['','','','','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','A','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','X','','','B','','','']]}}]);


});

it("moving pawn vertically above place occupied", function() {
    expectIllegalMove({turnIndex:0},{ turnInfo:{ctr:1,pawn:'X'},
    								  pawnDelta:{row:3,col:3}, board:[['','','','B','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','A','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','B','','','']] },
      [{setTurn:{turnIndex:1}},
      {set: {key: 'turnInfo', value: {ctr:2,pawn:'B'}}},
          {set: {key: 'pawnPosition', value: {row:3, col:3}}},
          {set: {key: 'pawnDelta', value: {row:0, col:3}}},
          {set: {key: 'board', value: [['','','','X','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','A','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','B','','','']]}}]);


});

it("moving pawn A diagonally from (3,9) to (8,4) which is already occupied", function() {
    expectIllegalMove({turnIndex:0},{ turnInfo:{ctr:2,pawn:'A'},
    								  pawnDelta:{row:3,col:3}, board:[['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','X','','','','',''],
                                      ['','','','B','','','B','','','']] },
      [{setTurn:{turnIndex:0}},
      {set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          {set: {key: 'pawnPosition', value: {row:3, col:9}}},
          {set: {key: 'pawnDelta', value: {row:8, col:4}}},
          {set: {key: 'board', value: [['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','A','','','','',''],
                                      ['','','','B','','','B','','','']]}}]);


});

it("moving pawn A diagonally from (3,0) to (9,6) which is already occupied", function() {
    expectIllegalMove({turnIndex:0},{ turnInfo:{ctr:2,pawn:'A'},
    								  pawnDelta:{row:3,col:3}, board:[['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']] },
      [{setTurn:{turnIndex:0}},
      {set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          {set: {key: 'pawnPosition', value: {row:3, col:0}}},
          {set: {key: 'pawnDelta', value: {row:9, col:6}}},
          {set: {key: 'board', value: [['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','A','','','']]}}]);


});

it("Not providing correct parameters in move", function() {
    expectIllegalMove({turnIndex:0},{ turnInfo:{ctr:2,pawn:'A'},
    								  pawnDelta:{row:3,col:3}, board:[['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['A','','','','','','','','','A'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','B','','','']] },
      [{setTurn:{turnIndex:0}},
      {set: {key: 'turnInfo', value: {ctr:1,pawn:'X'}}},
          {set: {key: 'pawnPosition', value: {row:3, col:0}}},
          {set: {key: 'pawnDelta'}},
          {set: {key: 'board', value: [['','','','A','','','A','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['B','','','','','','','','','B'],
                                      ['','','','','','','','','',''],
                                      ['','','','','','','','','',''],
                                      ['','','','B','','','A','','','']]}}]);


});

// 	function expectLegalHistory(history) {
// 		var i;
//     	for (i = 0; i < history.length; i++) {
//       		expectMoveOk(history[i].turnIndexBeforeMove,
//         	history[i].stateBeforeMove,
//         	history[i].move);
//     	}
//
//     }
//
//   	it("getExampleGame returns a legal history of the first few moves of game", function() {
//     	var exampleGame = gameOfAmazonsLogic.getExampleGame();
//     	expect(exampleGame.length).toBe(5);
//     	expectLegalHistory(exampleGame);
//   	});
//
//   	it("getRiddles returns legal histories which describes some moves to play to win game", function() {
//     var riddles = gameOfAmazonsLogic.getRiddles();
//     expect(riddles.length).toBe(2);
//     for (var i = 0; i < riddles.length; i++) {
//       expectLegalHistory(riddles[i]);
//     }
//   });

});
