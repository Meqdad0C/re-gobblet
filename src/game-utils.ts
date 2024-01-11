import {
  Board,
  GameState,
  Move,
  Piece_t,
  Player,
  PossibleMovesForPiece,
  Size,
} from '@/types'

import { produce } from 'immer'
import { doMove } from './reducers/game-reducer'

export const switch_turn = (turn: Player): Player => {
  return turn === Player.Red ? Player.Blue : Player.Red
}

export const is_a_bigger_than_b = (a: Piece_t, b: Piece_t): boolean => {
  return a.size > b.size
}

export const isLegalMove = (state: GameState, move: Move): boolean => {
  const { from, to, player, stack_number } = move.payload
  const isMoveFromInventory = from[0] === -1
  const from_stack = isMoveFromInventory
    ? state.inventories[player][stack_number]
    : state.board[from[0]][from[1]]

  const to_stack = state.board[to[0]][to[1]]
  if (to_stack.length === 0) {
    return true
  }

  const to_piece = to_stack[to_stack.length - 1]
  const piece = from_stack[from_stack.length - 1]

  if (isMoveFromInventory) {
    if (to_piece.player === player) {
      return false
    }
    const oneToComplete = find_three_in_a_row(state)
    const move_if_to_one_to_complete = oneToComplete.find(
      (location) => location[0] === to[0] && location[1] === to[1],
    )

    if (move_if_to_one_to_complete === undefined) {
      return false
    }
  }

  return is_a_bigger_than_b(piece, to_piece)
}

// Loop once over grid -> save pieces location & empty spaces -> foreach piece check if it can move over other pieces
export const getPossibleMoves = (state: GameState) => {
  const player = state.turn
  const possible_moves: Array<PossibleMovesForPiece> = []

  // Loop once over grid -> save pieces location & empty spaces
  const player_grid_pieces: Array<Piece_t> = []
  const all_pieces_on_grid: Array<Piece_t> = []
  const inventory = state.inventories[player]
  const empty_spaces: Array<number[]> = []

  state.board.forEach((row, i) => {
    row.forEach((stack, j) => {
      if (stack.length > 0) {
        if (stack[stack.length - 1].player === player) {
          player_grid_pieces.push(stack[stack.length - 1])
        }
        all_pieces_on_grid.push(stack[stack.length - 1])
      } else {
        empty_spaces.push([i, j])
      }
    })
  })

  // foreach piece check if it can move over other pieces
  player_grid_pieces.forEach((player_piece) => {
    const possible_moves_for_piece: Array<number[]> = []
    all_pieces_on_grid.forEach((piece_on_grid) => {
      const move: Move = {
        type: 'MOVE',
        payload: {
          player: player_piece.player,
          stack_number: player_piece.stack_number,
          from: player_piece.location,
          to: piece_on_grid.location,
        },
      }
      if (isLegalMove(state, move)) {
        possible_moves_for_piece.push(piece_on_grid.location)
      }
    })
    possible_moves.push({
      id: `piece-${player_piece.stack_number}-${player_piece.player}-${player_piece.size}`,
      from: player_piece.location,
      array_of_moves: possible_moves_for_piece.concat(empty_spaces),
    })
  })

  // check inventory
  inventory.forEach((stack, i) => {
    if (stack.length === 0) {
      return
    }
    const inventory_piece = stack[stack.length - 1]
    const possible_moves_for_piece: Array<number[]> = []

    all_pieces_on_grid.forEach((piece_on_grid) => {
      const move: Move = {
        type: 'MOVE',
        payload: {
          player: inventory_piece.player,
          stack_number: inventory_piece.stack_number,
          from: inventory_piece.location,
          to: piece_on_grid.location,
        },
      }
      if (isLegalMove(state, move)) {
        possible_moves_for_piece.push(piece_on_grid.location)
      }
    })
    possible_moves.push({
      id: `piece-${i}-${player}-${inventory_piece.size}`,
      from: [-1, i],
      array_of_moves: possible_moves_for_piece.concat(empty_spaces),
    })
  })

  return possible_moves
}

const find_three_in_a_row = (state: GameState) => {
  const opponent = switch_turn(state.turn)
  const board = state.board
  const result: Array<number[]> = []

  // Check horizontal
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      if (
        board[i][j].length > 0 &&
        board[i][j + 1].length > 0 &&
        board[i][j + 2].length > 0
      ) {
        const piece1 = board[i][j][board[i][j].length - 1]
        const piece2 = board[i][j + 1][board[i][j + 1].length - 1]
        const piece3 = board[i][j + 2][board[i][j + 2].length - 1]
        if (
          piece1.player === opponent &&
          piece2.player === opponent &&
          piece3.player === opponent
        ) {
          result.push([i, j], [i, j + 1], [i, j + 2])
        }
      }
    }
  }

  // Check vertical
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      if (
        board[i][j].length > 0 &&
        board[i + 1][j].length > 0 &&
        board[i + 2][j].length > 0
      ) {
        const piece1 = board[i][j][board[i][j].length - 1]
        const piece2 = board[i + 1][j][board[i + 1][j].length - 1]
        const piece3 = board[i + 2][j][board[i + 2][j].length - 1]
        if (
          piece1.player === opponent &&
          piece2.player === opponent &&
          piece3.player === opponent
        ) {
          result.push([i, j], [i + 1, j], [i + 2, j])
        }
      }
    }
  }

  // Check diagonal
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      if (
        board[i][j].length > 0 &&
        board[i + 1][j + 1].length > 0 &&
        board[i + 2][j + 2].length > 0
      ) {
        const piece1 = board[i][j][board[i][j].length - 1]
        const piece2 = board[i + 1][j + 1][board[i + 1][j + 1].length - 1]
        const piece3 = board[i + 2][j + 2][board[i + 2][j + 2].length - 1]
        if (
          piece1.player === opponent &&
          piece2.player === opponent &&
          piece3.player === opponent
        ) {
          result.push([i, j], [i + 1, j + 1], [i + 2, j + 2])
        }
      }
    }
  }

  // Check diagonal
  for (let i = 0; i < 2; i++) {
    for (let j = 2; j < 4; j++) {
      if (
        board[i][j].length > 0 &&
        board[i + 1][j - 1].length > 0 &&
        board[i + 2][j - 2].length > 0
      ) {
        const piece1 = board[i][j][board[i][j].length - 1]
        const piece2 = board[i + 1][j - 1][board[i + 1][j - 1].length - 1]
        const piece3 = board[i + 2][j - 2][board[i + 2][j - 2].length - 1]
        if (
          piece1.player === opponent &&
          piece2.player === opponent &&
          piece3.player === opponent
        ) {
          result.push([i, j], [i + 1, j - 1], [i + 2, j - 2])
        }
      }
    }
  }

  return result
}

/**
 *
 * @param state - the current game state
 * @returns the player who won the game or null if no one won
 */
const find_four_in_a_row = (state: GameState) => {
  const player = state.turn
  const opponent = switch_turn(state.turn)
  const board = state.board

  // Check horizontal
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 1; j++) {
      if (
        board[i][j].length > 0 &&
        board[i][j + 1].length > 0 &&
        board[i][j + 2].length > 0 &&
        board[i][j + 3].length > 0
      ) {
        const piece1 = board[i][j][board[i][j].length - 1]
        const piece2 = board[i][j + 1][board[i][j + 1].length - 1]
        const piece3 = board[i][j + 2][board[i][j + 2].length - 1]
        const piece4 = board[i][j + 3][board[i][j + 3].length - 1]
        const has_player_won =
          piece1.player === player &&
          piece2.player === player &&
          piece3.player === player &&
          piece4.player === player
        const has_opponent_won =
          piece1.player === opponent &&
          piece2.player === opponent &&
          piece3.player === opponent &&
          piece4.player === opponent

        if (has_player_won) {
          return player
        }
        if (has_opponent_won) {
          return opponent
        }
      }
    }
  }

  // Check vertical
  for (let i = 0; i < 1; i++) {
    for (let j = 0; j < 4; j++) {
      if (
        board[i][j].length > 0 &&
        board[i + 1][j].length > 0 &&
        board[i + 2][j].length > 0 &&
        board[i + 3][j].length > 0
      ) {
        const piece1 = board[i][j][board[i][j].length - 1]
        const piece2 = board[i + 1][j][board[i + 1][j].length - 1]
        const piece3 = board[i + 2][j][board[i + 2][j].length - 1]
        const piece4 = board[i + 3][j][board[i + 3][j].length - 1]

        const has_player_won =
          piece1.player === player &&
          piece2.player === player &&
          piece3.player === player &&
          piece4.player === player
        const has_opponent_won =
          piece1.player === opponent &&
          piece2.player === opponent &&
          piece3.player === opponent &&
          piece4.player === opponent

        if (has_player_won) {
          return player
        }
        if (has_opponent_won) {
          return opponent
        }
      }
    }
  }

  // Check diagonal
  for (let i = 0; i < 1; i++) {
    for (let j = 0; j < 1; j++) {
      if (
        board[i][j].length > 0 &&
        board[i + 1][j + 1].length > 0 &&
        board[i + 2][j + 2].length > 0 &&
        board[i + 3][j + 3].length > 0
      ) {
        const piece1 = board[i][j][board[i][j].length - 1]
        const piece2 = board[i + 1][j + 1][board[i + 1][j + 1].length - 1]
        const piece3 = board[i + 2][j + 2][board[i + 2][j + 2].length - 1]
        const piece4 = board[i + 3][j + 3][board[i + 3][j + 3].length - 1]

        const has_player_won =
          piece1.player === player &&
          piece2.player === player &&
          piece3.player === player &&
          piece4.player === player
        const has_opponent_won =
          piece1.player === opponent &&
          piece2.player === opponent &&
          piece3.player === opponent &&
          piece4.player === opponent

        if (has_player_won) {
          return player
        }
        if (has_opponent_won) {
          return opponent
        }
      }
    }
  }

  // Check diagonal
  for (let i = 0; i < 1; i++) {
    for (let j = 3; j < 4; j++) {
      if (
        board[i][j].length > 0 &&
        board[i + 1][j - 1].length > 0 &&
        board[i + 2][j - 2].length > 0 &&
        board[i + 3][j - 3].length > 0
      ) {
        const piece1 = board[i][j][board[i][j].length - 1]
        const piece2 = board[i + 1][j - 1][board[i + 1][j - 1].length - 1]
        const piece3 = board[i + 2][j - 2][board[i + 2][j - 2].length - 1]
        const piece4 = board[i + 3][j - 3][board[i + 3][j - 3].length - 1]

        const has_player_won =
          piece1.player === player &&
          piece2.player === player &&
          piece3.player === player &&
          piece4.player === player
        const has_opponent_won =
          piece1.player === opponent &&
          piece2.player === opponent &&
          piece3.player === opponent &&
          piece4.player === opponent

        if (has_player_won) {
          return player
        }
        if (has_opponent_won) {
          return opponent
        }
      }
    }
  }

  return null
}

export const is_winning_state = (state: GameState): Player | null => {
  const has_player_won = find_four_in_a_row(state)
  return has_player_won
}

/**
 *
 * @param state - the current game state
 * @param move - the move to be made
 * @returns the new game state after the move has been made
 */
export const getSuccesorState = (state: GameState, move: Move) => {
  const cloned_state = produce(state, (draft) => {
    doMove(draft, move)
  })
  return cloned_state
}

interface SuccesorState {
  state: GameState
  move: Move
}
interface SuccesorStates {
  id: `piece-${number}-${Player}-${Size}` // `piece-${stack_number}-${player}-${size}
  states: SuccesorState[]
}
export const getAllSuccesorStates = (state: GameState): SuccesorStates[] => {
  const possible_moves = state.possible_moves
  const succesor_states: SuccesorStates[] = []

  possible_moves.forEach((possible_move) => {
    const states: { state: GameState; move: Move }[] = []
    possible_move.array_of_moves.forEach((move) => {
      const succesor_state = getSuccesorState(state, {
        type: 'MOVE',
        payload: {
          player: state.turn,
          stack_number: Number(possible_move.id.split('-')[1]),
          from: possible_move.from,
          to: move,
        },
      })
      states.push({
        state: succesor_state,
        move: {
          type: 'MOVE',
          payload: {
            player: state.turn,
            stack_number: Number(possible_move.id.split('-')[1]),
            from: possible_move.from,
            to: move,
          },
        },
      })
    })
    succesor_states.push({
      id: possible_move.id,
      states: states,
    })
  })

  return succesor_states
}

export const ai_random_move = (state: GameState) => {
  const possible_moves = getPossibleMoves(state)
  const number_of_pieces = possible_moves.length
  const random_piece =
    possible_moves[Math.floor(Math.random() * number_of_pieces)]
  const number_of_moves = random_piece.array_of_moves.length
  const random_grid_place =
    random_piece.array_of_moves[Math.floor(Math.random() * number_of_moves)]
  const random_move: Move = {
    type: 'MOVE',
    payload: {
      player: state.turn,
      stack_number: Number(random_piece.id.split('-')[1]),
      from: random_piece.from,
      to: random_grid_place,
    },
  }

  return random_move
}

export function isRepeatedState(state: GameState): boolean {
  const boardHistory = state.boardHistory

  // Check if there are at least 10 moves in the moveHistory
  if (boardHistory.length < 6) {
    return false
  }

  // Get the last 10 boards from the moveHistory
  const lastEightBoards = boardHistory

  // let identicalsNumber

  // Check if there are 3 identical boards in the lastSixBoards array
  return (
    areBoardsIdentical(lastEightBoards[0], lastEightBoards[2]) &&
    areBoardsIdentical(lastEightBoards[2], lastEightBoards[4]) &&
    areBoardsIdentical(lastEightBoards[1], lastEightBoards[3]) &&
    areBoardsIdentical(lastEightBoards[3], lastEightBoards[5])
  )
  // for (let i = 0; i < lastEightBoards.length - 1; i++) {
  //   identicalsNumber = 0
  //   for (let j = i + 1; j < lastEightBoards.length; j++) {
  //     if (areBoardsIdentical(lastEightBoards[i], lastEightBoards[j])) {
  //       identicalsNumber++
  //       console.log(identicalsNumber)
  //     }
  //   }
  //   if (identicalsNumber >= 2) {
  //     return true
  //   }
  // }
  return false
}

function areBoardsIdentical(board1: Board, board2: Board): boolean {
  // Check if the number of rows and columns is the same
  if (
    board1.length !== board2.length ||
    board1[0].length !== board2[0].length
  ) {
    return false
  }

  // Iterate through each cell in the board
  for (let row = 0; row < board1.length; row++) {
    for (let col = 0; col < board1[row].length; col++) {
      const stack1 = board1[row][col]
      const stack2 = board2[row][col]

      // Check if the lengths of the stacks are the same
      if (stack1.length !== stack2.length) {
        return false
      }

      // Iterate through each piece in the stack
      for (let i = 0; i < stack1.length; i++) {
        const piece1 = stack1[i]
        const piece2 = stack2[i]

        // Compare the pieces for equality
        if (!arePiecesEqual(piece1, piece2)) {
          return false
        }
      }
    }
  }
  // If all elements are equal, the boards are identical
  return true
}
function arePiecesEqual(piece1: Piece_t, piece2: Piece_t): boolean {
  // Compare the properties of the two pieces for equality
  return (
    piece1.stack_number === piece2.stack_number &&
    piece1.player === piece2.player &&
    piece1.size === piece2.size &&
    areLocationsEqual(piece1.location, piece2.location)
  )
}

function areLocationsEqual(location1: number[], location2: number[]): boolean {
  // Compare two location arrays for equality
  if (location1.length !== location2.length) {
    return false
  }

  for (let i = 0; i < location1.length; i++) {
    if (location1[i] !== location2[i]) {
      return false
    }
  }

  return true
}

