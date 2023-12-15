export enum Player {
  Red,
  Blue,
}

export enum Size {
  Small,
  Medium,
  Large,
  XLarge,
}
export type Piece_t = {
  stack_number: number
  player: Player
  size: Size
  location: number[]
}
export type Stack = Array<Piece_t>
export type Board = Array<Array<Stack>>

export interface GameState {
  board: Board
  inventory_0: Array<Stack>
  inventory_1: Array<Stack>
  turn : Player
}

export type Move = {
  type: 'MOVE'
  payload: {
    player: Player
    stack_number: number
    from: number[]
    to: number[]
    size: Size
  }
}
export type GameAction = Move
