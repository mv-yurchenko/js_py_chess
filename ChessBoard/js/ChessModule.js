let board,
    game = new Chess(),
    statusEl = $('#status'),
    fenEl = $('#fen'),
    pgnEl = $('#pgn');

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
let onDragStart = function(source, piece, position, orientation) {
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
};

let onDrop = function(source, target) {
    // see if the move is legal
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return 'snapback';

    updateStatus();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
let onSnapEnd = function() {
    board.position(game.fen());
};

let updateStatus = function() {
    let status = '';

    let moveColor = 'White';
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    // checkmate?
    if (game.in_checkmate() === true) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }

    // draw?
    else if (game.in_draw() === true) {
        status = 'Game over, drawn position';
    }

    // game still on
    else {
        status = moveColor + ' to move';

        // check?
        if (game.in_check() === true) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    statusEl.html(status);
    pgnEl.html(game.pgn());

};




// Highlight possible moves
/// --------------------------------------------------
let removeGreySquares= function () {
    $('#board .square-55d63').css('background', '');
};

let greySquare = function (square) {
    let squareEl = $('#board .square-' + square);

    let background = '#FF4500';

    if (squareEl.hasClass('nack-3c85d') === true){
        background = "#696969";
    }

    squareEl.css('background', background);
};

let onMouseoverSquare = function (square, piece) {
    let moves = game.moves({
        square : square,
        verbose : true
    });

    // If no moves available for this square
    if (moves.length === 0) return;

    // Highlight square
    greySquare(square);

    // Highlight possible squares
    for (let i = 0; i < moves.length; i++){
        greySquare(moves[i].to);
    }
};

let onMouseoutSquare = function () {
    removeGreySquares()
};
/// --------------------------------------------------

// Output to console figure coordinates
function clickGetPositionBtn(){
    console.log(board.position())
}

$('#getPositionBtn').on('click', clickGetPositionBtn)

let cfg = {
    draggable: true,
    dropOffBoard : 'trash',
    sparePieces : true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare : onMouseoutSquare,
    onMouseoverSquare : onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);

// Start Button
$("#startGameBtn").on('click', board.start);

updateStatus();
