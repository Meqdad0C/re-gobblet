import { Board, Stack, Player, GameState } from '@/types'
// const INFINITY: number = Number.POSITIVE_INFINITY

export function heuristic_value_of(
  gameState: GameState,
  currentPlayer: Player,
): number {
  let score = 0

  //Here the turn represents the player color who plays as AI
  const turn = currentPlayer
  score += evaluateLines(gameState.board, turn)

  return score
}

function evaluateLines(board: Board, currentPlayer: Player): number {
  let score = 0
  // console.log(score)

  // Evaluate rows, columns, and diagonals
  for (let i = 0; i < 4; i++) {
    score += evaluateLine(getRow(board, i), currentPlayer)
    // console.log(score)
    score += evaluateLine(getColumn(board, i), currentPlayer)
    // console.log(score)
  }
  // console.log('diagonals')
  score += evaluateLine(getDiagonal(board, true), currentPlayer) // Main diagonal
  // console.log(score)
  score += evaluateLine(getDiagonal(board, false), currentPlayer) // Anti-diagonal
  // console.log(score)

  return score
}

function evaluateLine(line: Array<Stack>, currentPlayer: Player): number {
  let score = 0
  let playerCount = 0 // Count of the current player's pieces in the line
  let opponentCount = 0 // Count of the opponent's pieces in the line

  line.forEach((stack) => {
    if (stack.length > 0) {
      const topPiece = stack[stack.length - 1]
      const value = topPiece.size + 1 // Scoring based on size
      if (topPiece.player === currentPlayer) {
        score += value // Favorable for current player
        playerCount++
      } else {
        score -= value // Unfavorable for current player
        opponentCount++
      }
    }
  })

  // Additional scoring based on the number of pieces in the line
  score += evaluateLinePotential(playerCount, opponentCount)

  return score
}

function evaluateLinePotential(
  playerCount: number,
  opponentCount: number,
): number {
  let lineScore = 0

  const winningThreshold = 4 // Number of pieces needed to win
  const playerBonus = 15 // Bonus score for each piece of the current player
  const opponentPenalty = 10 // Penalty score for each piece of the opponent
  const bigNegative = -100 // Big negative score if the opponent is about to win

  if (playerCount > 0) {
    // Line has only the current player's pieces
    lineScore += playerBonus * playerCount
    if (playerCount === winningThreshold) {
      lineScore += 1000 // Big bonus for a winning line
    }
  } else if (opponentCount > 0) {
    // Line has only the opponent's pieces
    lineScore += opponentPenalty * opponentCount
    if (opponentCount === winningThreshold) {
      // Opponent is winning
      lineScore += bigNegative
    }
  }

  return lineScore
}

function getRow(board: Board, rowIndex: number): Array<Stack> {
  return board[rowIndex]
}

function getColumn(board: Board, colIndex: number): Array<Stack> {
  return board.map((row) => row[colIndex])
}

function getDiagonal(board: Board, mainDiagonal: boolean): Array<Stack> {
  const diagonal = []
  for (let i = 0; i < 4; i++) {
    diagonal.push(mainDiagonal ? board[i][i] : board[i][3 - i])
  }
  return diagonal
}
