import { game_initial_state } from '@/constants'
import { GameState, GameAction, Move } from '@/types'
import {
  isLegalMove,
  is_winning_state,
  switch_turn,
  getPossibleMoves,
} from '@/game-utils'

export const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case 'MOVE':
      return doMove(state, action)
    case 'RESTART':
      return doRestart()
    case 'SHOW_BOARD':
      return show_board(state)
    case 'END':
      return end_game()
  }
}

export const doMove = (state: GameState, action: Move) => {
  const { player, stack_number, from, to } = action.payload
  // console.log('[doMove]', player, stack_number, from, to, size)
  if (!isLegalMove(state, action)) {
    console.log('[doMove] illegal move')
    return state
  }
  const from_stack =
    from[0] === -1
      ? state.inventories[player][stack_number]
      : state.board[from[0]][from[1]]

  const to_cell = state.board[to[0]][to[1]]

  const piece = from_stack.pop()!
  piece.location = to
  to_cell.push(piece)

  state.winner = is_winning_state(state) ? state.turn : null
  state.game_over = state.winner !== null
  if (state.game_over) return state
  state.turn = switch_turn(state.turn)
  state.possible_moves = getPossibleMoves(state)
  return state
}

export const doRestart = () => {
  const state = game_initial_state
  const new_state = { ...state, game_started: true }
  return new_state
}

export const show_board = (state: GameState) => {
  state.game_started = false
  return state
}

export const end_game = () => {
  return game_initial_state
}
