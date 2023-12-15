export enum Player {
  Red,
  Blue
}

export enum Size {
  Small,
  Medium,
  Large,
  XLarge
}
export type Board = Array<Array<Size>>
export interface GameState {
  board: Board
}
export type Move = {
  type: 'MOVE'
  payload: Board
}
export type GameAction = Move

