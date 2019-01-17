let movesEvaluated = 0;

// Finds the best move of the current position by searching possible moves the AI could take
function bestMove(game) {
	if (game.game_over()) {
		alert("Game Over");
	}

	let possibleMoves = game.ugly_moves;
	let bestMove;
	let bestValue = -9999;
	let values = ""; // For debugging

	console.log("Current Value " + evaluateBoard(game.board));

	// For each move the AI can take, evaluate the board position after
	for (let i = 0; i < possibleMoves.length; i++) {
		let testMove = possibleMoves[i];
		game.ugly_move(testMove); // Make a move via the current move we are evaluating

		let depth = parseInt($('#search-depth').find(':selected').text());

		//let testValue = optDig(depth-1,game,-10000,10000);
		let testValue = digdeep(depth-1,game,false,-10000,10000);// Evaluate the board as a number value based on the move we just made to depth moves ahead
		//let testValue = evaluateBoard(game); // Evaluate the board as a number value based on the move we just made

		// If we can checkmate in one move, then that is the best possible move
		if (game.in_checkmate() === true) {
			bestValue = 9999;
			bestMove = testMove;
			break;
		}


		// If moves are equal, give preference to the ones that put the opponent in check and limits the moves they can take
		if (game.in_check() === true) {
			testValue = testValue + 0.5;
		}

		values = values + testValue + "\n"; // For debugging

		game.undo(); // Undo the move we just made so we can check another one

		// Set the best move and best board value for that move
		if (testValue > bestValue) {
			bestMove = testMove;
			bestValue = testValue;
		}
	}
	console.log(values); // For debugging
	console.log("Expcted Value " + bestValue);

	return bestMove;

}

//minmax + alpha/beta search
//basically same as FreeCodeCamp
function digdeep(depth, game, ismax, alpha, beta) {

	movesEvaluated++;

	let pv = false;

	if (depth === 0) {
        return evaluateBoard(game.board());
    }

	let possibleMoves = game.ugly_moves();


    if (ismax) {
        let bestMove = -9999;
        for (let i = 0; i < possibleMoves.length; i++) {
            game.ugly_move(possibleMoves[i]);
            bestMove = Math.max(bestMove, digdeep(depth - 1, game, !ismax,alpha,beta));
			game.undo();

			//update alpha and check
			alpha = Math.max(alpha,bestMove);
			if(beta <= alpha){return bestMove;}
        }
        return bestMove;

    } else {
        let bestMove = 9999;
        for (let i = 0; i < possibleMoves.length; i++) {

            game.ugly_move(possibleMoves[i]);
            bestMove = Math.min(bestMove, digdeep(depth - 1, game, !ismax,alpha,beta));
            game.undo();

			//update beta and check
			beta = Math.min(beta, bestMove);
			if(beta <= alpha) {return bestMove;}

        }
        return bestMove;
}
}



//optimized Dig
//negamax + alpha/beta + principle letiation search
function saveMove(cmove,argmove,lastmove){
	this.cmove = cmove;
	this.argmove = argmove;
	//this.lastmove = lastmove;
}
//prepping for iterative deep
function optDig(depth, game, alpha, beta, savedMove) {

	movesEvaluated++;
	let newMove = new saveMove(0,[]);

	if (depth === 0)
	{
		savedMove.cmove = 0;
        return evaluateBoard(game.board());
	}

	let possibleMoves = game.ugly_moves();

	let val = 0;

	for (let i = 0; i < possibleMoves.length; i++)
	{


        game.ugly_move(possibleMoves[i]);
				/* legacy pv
				if(pv)
				{
					val = - optDig(depth - 1, game,-alpha - 1,-alpha,newMove);

					if((val > alpha) && (val < beta)){ val = - optDig(depth - 1, game, - beta, - alpha, newMove ); }
				}
				else
				{
					val = - optDig(depth - 1, game, - beta, - alpha, newMove );
				}
				*/

				val = - optDig(depth - 1, game, - beta, - alpha, newMove );

				game.undo();

				if(val >= beta){	return beta;}

				if(val >= alpha)
				{
						alpha = val;

						//don't now if this works but creating chain of moves to pv move
						savedMove.argmove = [possibleMoves[i]];
						savedMove.push.apply(newMove.argmove);
						savedMove.cmove = newMove.cmove + 1;

				}
    }
        return alpha;
}

// Iterate through the board and calculate a score for the positions of each piece
function evaluateBoard(board) {
	let score = 0;
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
				score = score + evaluatePiece(board[i][j],i,j);
		}
	}
	return score;
}

// Evaluate the score of a specific piece on the board
function evaluatePiece(piece, x, y) {

	if (piece === null) {
		return 0;
	}

	let getAbsoluteValue = function (piece, isWhite, x ,y) {
		if (piece.type === 'p') {
			return 10 + ( isWhite ? pawnEvalWhite[x][y] : pawnEvalBlack[x][y] );
		} else if (piece.type === 'r') {
			return 50 + ( isWhite ? rookEvalWhite[x][y] : rookEvalBlack[x][y] );
		} else if (piece.type === 'n') {
			return 30 + knightEval[x][y];
		} else if (piece.type === 'b') {
			return 30 + ( isWhite ? bishopEvalWhite[x][y] : bishopEvalBlack[x][y] );
		} else if (piece.type === 'q') {
			return 90 + queenEval[x][y];
		} else if (piece.type === 'k') {
			return 900 + ( isWhite ? kingEvalWhite[x][y] : kingEvalBlack[x][y] );
		}
		throw "Unknown piece type: " + piece.type;
	};

	let absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
	return piece.color === 'w' ? -absoluteValue : absoluteValue;
}

// Reverse the array for black pieces because they are looking from the other side of the board (some pieces are the same no matter what, so don't reverse those)
let reverseArray = function(array) {
    return array.slice().reverse();
};

//// Piece ratings based on their position on the board ////
let pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

let pawnEvalBlack = reverseArray(pawnEvalWhite);

let knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

let bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

let bishopEvalBlack = reverseArray(bishopEvalWhite);

let rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

let rookEvalBlack = reverseArray(rookEvalWhite);

let queenEval = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

let kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0]
];

let kingEvalBlack = reverseArray(kingEvalWhite);
//// End piece ratings ////