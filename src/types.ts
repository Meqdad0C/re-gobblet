export enum Player {
  Red,
  Blue,
}
export enum Draw {
  False = 2,
  True = 3,
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
  inventories: [Array<Stack>, Array<Stack>]
  turn: Player
  possible_moves: Array<PossibleMovesForPiece>
  winner: Player | null | Draw
  game_over: boolean
  game_started: boolean
  touched_board_piece_location: null | number[]
  boardHistory: Board[] // Array to store the history of moves
}

export interface GameOptions {
  game_type: GameType
  algorithm_1: Algorithm
  algorithm_2: Algorithm
  depth_1: number
  depth_2: number
}

export type GameType = 'PvP' | 'PvAI' | 'AIvAI'
export type Algorithm =
  | 'Random'
  | 'Minimax'
  | 'AlphaBeta'
  | 'AlphaBetaWithIterativeDeepening'

export interface PossibleMovesForPiece {
  id: `piece-${number}-${Player}-${Size}` // `piece-${stack_number}-${player}-${size}`
  from: number[]
  array_of_moves: Array<number[]>
}

export type Move = {
  type: 'MOVE'
  payload: {
    player: Player
    stack_number: number
    from: number[]
    to: number[]
  }
}

export type Restart = {
  type: 'RESTART'
}

export type GameAction =
  | Move
  | Restart
  | { type: 'SHOW_BOARD' }
  | { type: 'END' }
  | { type: 'TOUCH_BOARD_PIECE'; payload: { location: number[] } }
