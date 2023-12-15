import { Board, GameState, GameAction } from '@/types'
import React from 'react'
import { createContext, useReducer } from 'react'

const board_initial_state: Board = Array.from({ length: 4 }, () =>
  Array(4).fill([]),
)

const game_initial_state = {
  board: board_initial_state,
}

export const GameStateContext = createContext({} as GameState)
export const GameDispatchContext = createContext({} as React.Dispatch<GameAction>)

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game_state, dispatch] = useReducer(gameReducer, game_initial_state)

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
  const { payload } = action
  return {
    ...state,
    board: payload,
  }
}

export default GameProvider
