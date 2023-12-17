import { game_initial_state } from '@/constants'
import {
  GameState,
  GameAction,
} from '@/types'
import { getPossibleMoves, isLegalMove, switch_turn } from '@/utils'
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
  }
}

const doMove = (state: GameState, action: GameAction) => {
  const { player, stack_number, from, to, size } = action.payload
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

  state.turn = switch_turn(state.turn)
  getPossibleMoves(state)
  return state
}

export default GameProvider
