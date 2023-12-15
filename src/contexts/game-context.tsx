import { Board, GameState, GameAction, Stack, Player, Size } from '@/types'
import React from 'react'
import { createContext, useReducer } from 'react'

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
  const { player, stack_number, from, to } = action.payload
  console.log('[doMove]', player, stack_number, from, to)

  if (from[0] === -1) {
    const old_inventory =
      player === Player.Red ? state.inventory_0 : state.inventory_1
    const old_stack = old_inventory[stack_number]
    const new_stack = old_stack.slice(1)
    const new_inventory = old_inventory.slice()
    new_inventory[stack_number] = new_stack
    const new_state = { ...state }
    if (player === Player.Red) {
      new_state.inventory_0 = new_inventory
    } else {
      new_state.inventory_1 = new_inventory
    }
    const old_board = state.board.slice()
    const old_cell = old_board[to[0]][to[1]]
    const moved_piece = old_stack[0]
    const new_cell = [
      ...old_cell,
      { player, size: moved_piece.size, stack_number, location: to },
    ]
    const new_board = old_board.slice()
    new_board[to[0]][to[1]] = new_cell
    new_state.board = new_board

    return new_state
  }

  const old_board = state.board.slice()
  const old_cell = old_board[from[0]][from[1]]
  const new_cell = old_cell.slice(1)
  const new_board = old_board.slice()
  new_board[from[0]][from[1]] = new_cell
  const new_state = { ...state }
  new_state.board = new_board

  return new_state
}

export default GameProvider
