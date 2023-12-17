import { game_initial_state } from '@/constants'
import { GameState, GameAction, Move } from '@/types'
import {
  getPossibleMoves,
  isLegalMove,
  is_winning_state,
  switch_turn,
} from '@/utils'
import React from 'react'
import { createContext } from 'react'
import { useImmerReducer } from 'use-immer'

export const GameStateContext = createContext({} as GameState)
export const GameDispatchContext = createContext(
  {} as React.Dispatch<GameAction>,
)

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game_state, dispatch] = useImmerReducer(
    gameReducer,
    game_initial_state,
  )

  return (
    <GameStateContext.Provider value={game_state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  )
}

const gameReducer = (state: GameState, action: GameAction) => {
  switch (action.type) {
    case 'MOVE':
      return doMove(state, action)
    case 'RESTART':
      return doRestart()
  }
}

const doMove = (state: GameState, action: Move) => {
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

  console.log('player won?', is_winning_state(state))
  state.winner = is_winning_state(state) ? state.turn : null
  state.game_over = state.winner !== null
  if (state.game_over) return state
  state.turn = switch_turn(state.turn)
  state.possible_moves = getPossibleMoves(state)
  return state
}

const doRestart = () => {
  return game_initial_state
}

export default GameProvider
