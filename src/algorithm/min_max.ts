import {
    Board,
    Stack,
    Move,
    Player,
    Size,
    PossibleMovesForPiece,
    GameState,
    GameAction,
    GameOptions,
    
   
  }from '@/types'


  
  const INFINITY: number = Number.POSITIVE_INFINITY;
  
  function minimax(gameState: GameState, depth: number, isMaximizingPlayer: boolean): number {
    if (depth === 0 || gameState.game_over) {
        return heuristic_value_of(gameState);
    }

    if (isMaximizingPlayer) {
        let maxEval: number = -INFINITY;
        for (const possible_move of gameState.possible_moves) {
            
            make_move(gameState, gameAction);
            const evaluation: number = minimax(gameState, depth - 1, false);
            maxEval = Math.max(maxEval, evaluation);
        }
        return maxEval;
    } else {
        let minEval: number = INFINITY;
        for (const possible_move of gameState.possible_moves) {
            make_move(gameState, possible_move);
            const evaluation: number = minimax(gameState, depth - 1, true);
            minEval = Math.min(minEval, evaluation);
            undo_move(gameState, possible_move);
        }
        return minEval;
    }
}

  
  function heuristic_value_of(gameState: GameState): number {
      // Implement your heuristic evaluation here
      return 0; // Placeholder
  }

  
  function make_move(gameState: GameState, action: GameAction): void {
    
    if (action.type !== 'MOVE') {
      return;
    }
  
    const { player, stack_number, from, to } = action.payload;
  
    // Check if move is from inventory
    if (from.length === 0) {

      // Move from inventory to board. Assuming top piece of the stack is moved.
      const piece = gameState.inventories[player][stack_number].pop();
      if (piece === undefined) {
        return;
      }
      if (!gameState.board[to[0]][to[1]]) {
        gameState.board[to[0]][to[1]] = [];
      }
      gameState.board[to[0]][to[1]].push(piece);
    } else {

      // Move from one board position to another
      const stack = gameState.board[from[0]][from[1]];
      if (!stack || stack.length === 0) {
        // Handle case where no piece is available at the source
        return;
      }
      const piece = stack.pop();
      if (piece === undefined) {

        return;
      }
      if (!gameState.board[to[0]][to[1]]) {
        gameState.board[to[0]][to[1]] = [];
      }
      gameState.board[to[0]][to[1]].push(piece);
    }
  
  }
  
  
  function undo_move(gameState: GameState, action: GameAction): void {
    
    if (action.type !== 'MOVE') {
      return;
    }
  
    const { player, stack_number, from, to } = action.payload;
  
    // Check if move was from inventory
    if (from.length === 0) {
      // Undo move from inventory to board
      const piece = gameState.board[to[0]][to[1]].pop();
      if (!piece) {

        return;
      }
      gameState.inventories[player][stack_number].push(piece);
    } else {
      // Undo move from one board position to another
      const stack = gameState.board[to[0]][to[1]];
      if (!stack || stack.length === 0) {
        return;
      }
      const piece = stack.pop();
      if (piece === undefined) {
        return;
      }
      if (!gameState.board[from[0]][from[1]]) {
        gameState.board[from[0]][from[1]] = [];
      }
      gameState.board[from[0]][from[1]].push(piece);
    }
  }
  