import { Board, Stack, Player, Size, PossibleMovesForPiece, GameState } from '@/types'

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
      location: [-1, i],
    })),
  ),
)
const grid_indecies = [0, 1, 2, 3]
  .map((i) => [0, 1, 2, 3].map((j) => [i, j]))
  .flat(1)
const possible_moves_initial_state: Array<PossibleMovesForPiece> = [0, 1, 2].map(
  (i) => ({
    id: `piece-${i}-0-3`,
    from: [-1, i],
    array_of_moves: grid_indecies,
  }),
)
export const game_initial_state: GameState = {
  board: board_initial_state,
  inventories: [inventory_initial_state[0], inventory_initial_state[1]],
  turn: Player.Red,
  possible_moves: possible_moves_initial_state,
  winner: null,
  game_over: false,
}
