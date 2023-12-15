import { GameState, Move, Piece_t, Player } from '@/types'

export const switch_turn = (turn : Player): Player => {
    return turn === Player.Red ? Player.Blue : Player.Red
}

export const is_a_bigger_than_b = (a: Piece_t, b: Piece_t): boolean => {
  return a.size > b.size
}

export const isLegalMove = (state: GameState, move: Move): boolean => {
  const { from, to, player, stack_number } = move.payload
  const isMoveFromInventory = from[0] === -1
  const from_stack = isMoveFromInventory
    ? player
      ? state.inventory_1[stack_number]
      : state.inventory_0[stack_number]
    : state.board[from[0]][from[1]]

  const to_stack = state.board[to[0]][to[1]]
  if (to_stack.length === 0) {
    return true
  }
  const to_piece = to_stack[to_stack.length - 1]
  const piece = from_stack[from_stack.length - 1]
  return is_a_bigger_than_b(piece, to_piece)
}
