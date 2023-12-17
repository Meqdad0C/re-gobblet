import { Board, GameState, Move, Piece_t, Player, PossibleMoves } from '@/types'

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

  if (isMoveFromInventory) {
    const oneToComplete = find_three_in_a_row(state)
    const move_if_to_one_to_complete = oneToComplete.filter(
      (location) => location[0] === to[0] && location[1] === to[1],
    )
    if (move_if_to_one_to_complete.length === 0) {
      return false
    }
  }

  const to_piece = to_stack[to_stack.length - 1]
  const piece = from_stack[from_stack.length - 1]
  return is_a_bigger_than_b(piece, to_piece)
}


// Loop once over grid -> save pieces location & empty spaces -> foreach piece check if it can move over other pieces
export const getPossibleMoves = (state: GameState) => {
  const player = state.turn
  const inventory = state.inventories[player]

  const possible_moves: Array<PossibleMoves> = []

  inventory.forEach((stack, stack_number) => {
    if (stack.length === 0) {
      return
    }
    const piece = stack[stack.length - 1]
    const { size } = piece
    const id = `piece-${stack_number}-${player}-${size}` as const
    const array_of_moves: Array<number[]> = []

    state.board.forEach((row, row_index) => {
      row.forEach((stack, stack_index) => {
        if (stack.length === 0) {
          array_of_moves.push([row_index, stack_index])
          return
        }
      })
    })

    const oneToComplete = find_three_in_a_row(state)
    oneToComplete.forEach((location) => {
      const s = state.board[location[0]][location[1]]
      const p = s[s.length - 1]
      if (is_a_bigger_than_b(piece, p)) {
        array_of_moves.push(location)
      }
    })

    possible_moves.push({ id, from: [-1, stack_number], array_of_moves })
  })


  console.log('Bedonzy san', possible_moves)
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
