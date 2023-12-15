import { Board, GameState, GameAction, Stack, Player, Size } from '@/types'
import { isLegalMove } from '@/utils'
import React from 'react'
import { createContext } from 'react'
import { useImmerReducer } from 'use-immer'

const board_initial_state: Board = Array.from({ length: 4 }, () =>
  Array(4).fill([]),
)

const inventory_initial_state: Array<Array<Stack>> = [
  Player.Red,
  Player.Blue,
].map((p) =>
  [0, 1, 2].map((i) =>
    [Size.Small, Size.Medium, Size.Large, Size.XLarge].map((s) => ({
      player: p,
      size: s,
      stack_number: i,
      location: [-1, -1],
    })),
  ),
)

const game_initial_state: GameState = {
  board: board_initial_state,
  inventory_0: inventory_initial_state[0],
  inventory_1: inventory_initial_state[1],
}

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
  console.log('[doMove]', player, stack_number, from, to, size)

  if (!isLegalMove(state, action)) {
    console.log('[doMove] illegal move')
    return state
  }
  const from_stack = from[0] === -1
    ? player
      ? state.inventory_1[stack_number]
      : state.inventory_0[stack_number]
    : state.board[from[0]][from[1]]

  const to_cell = state.board[to[0]][to[1]]

  const piece = from_stack.pop()!
  to_cell.push(piece)
  return state
}

export default GameProvider
