function playAI(game) {
	if (game.game_over()) {
		alert("Game Over");
		return;
	}
	let timeStart = new Date().getTime();
	// Find the best move and play it
	let move = bestMove(game);
	game.ugly_move(move);
	let timeEnd = new Date().getTime();

	let totalTime = timeEnd - timeStart;

	movesE1.html(movesEvaluated);
	timeE1.html(totalTime + "ms");

	// Update the board position on screen and update game status at the bottom of the page
	board.position(game.fen());
	updateStatus();

	if (game.game_over()) {
		alert('Game Over');
	}
}