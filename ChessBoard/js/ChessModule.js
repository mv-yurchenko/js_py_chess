let board,
    game = new Chess(),
    statusEL = $("#status"),
    fenEL = $("#fen"),
    pgnEL = $("#pgn");

let onDragStart = function (source, piece, position, orientation) {
    if (game.game_over() === true ||
        // If its white turn and figure belongs to black
        (game.turn() === 'w' && piece.search('/^b/') !== -1) ||
        // If its black turn and figure belongs to white
        (game.turn() === 'b' && piece.search('/^w/') !== -1)) {
        return false;
    }
};

let onDrop = function (source, target) {
    // Check if move is legal
    let move = game.move({
        from : source, to: target, promotion: 'q'
    });

    // If move is Illegal
    if (move) return 'snapback';

    updateStatus();
};

let onSnapEnd = function () {
    board.position(game.fen());
};

let updateStatus = function () {
    let status = '';

    let moveColor = "White";

    if (game.turn() === 'b') {
        moveColor = "Black";
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

  statusEL.html(status);
  fenEL.html(game.fen());
  pgnEL.html(game.pgn());
};



let cfg = {
    draggable : true,
    position : 'start',
    onDragStart : onDragStart,
    onDrop : onDrop,
    onSnapEnd : onSnapEnd
};

board = ChessBoard('board', cfg);

updateStatus();