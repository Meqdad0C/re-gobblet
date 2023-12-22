import { Board, Stack, Move, Player, GameState } from '@/types'

import { doMove } from '@/reducers/game-reducer'

import { getAllSuccesorStates, switch_turn } from '@/game-utils'
import { Console } from 'console'

const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  move?: Move
}

export function minimax(
  gameState: GameState,
  depth: number,
  isMaximizingPlayer: boolean,
  turn: Player,
): MinimaxResult {
  if (depth === 0 || gameState.game_over) {
    // console.log('turn', gameState.turn)
    return { score: heuristic_value_of(gameState, turn) }
  }
  let playerBestMove

  if (isMaximizingPlayer) {
    let maxEval: number = -INFINITY
    let bestMove: Move | undefined

    const successorStates = getAllSuccesorStates(gameState)
    // console.log('[min_max getAllSuccesorStates]', successorStates)
    successorStates.forEach((successorState) => {
      successorState.states.forEach((stateMovePair) => {
        const evaluation = minimax(stateMovePair.state, depth - 1, false, turn)
        if (stateMovePair.state.game_over) {
          // console.log(
          //   '[winning state]',
          //   heuristic_value_of(stateMovePair.state),
          //   stateMovePair.state.turn,
          // )
        }
        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
          playerBestMove = evaluation.move
        }
      })
    })
    console.log('player best move', playerBestMove)
    return { score: maxEval, move: bestMove }
  } else {
    let minEval: number = INFINITY
    let bestMove: Move | undefined

    const successorStates = getAllSuccesorStates(gameState)
    // console.log(successorStates)
    successorStates.forEach((successorState) => {
      successorState.states.forEach((stateMovePair) => {
        const evaluation = minimax(stateMovePair.state, depth - 1, true, turn)

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
      })
    })

    return { score: minEval, move: bestMove }
  }
}
// export function minimax(
//   gameState: GameState,
//   depth: number,
//   alpha: number,
//   beta: number,
//   isMaximizingPlayer: boolean,
//   turn: Player,
// ): MinimaxResult {
//   if (depth === 0 || gameState.game_over) {
//     return { score: heuristic_value_of(gameState, turn) }
//   }

//   if (isMaximizingPlayer) {
//     let maxEval: number = -INFINITY
//     let bestMove: Move | undefined

//     const successorStates = getAllSuccesorStates(gameState)
//     for (const successorState of successorStates) {
//       for (const stateMovePair of successorState.states) {
//         const evaluation = minimax(
//           stateMovePair.state,
//           depth - 1,
//           alpha,
//           beta,
//           false,
//           turn,
//         )
//         if (evaluation.score > maxEval) {
//           maxEval = evaluation.score
//           bestMove = stateMovePair.move
//         }
//         alpha = Math.max(alpha, evaluation.score)
//         if (beta <= alpha) {
//           break // Beta cut-off
//         }
//       }
//       if (beta <= alpha) {
//         break // Beta cut-off
//       }
//     }
//     return { score: maxEval, move: bestMove }
//   } else {
//     let minEval: number = INFINITY
//     let bestMove: Move | undefined

//     const successorStates = getAllSuccesorStates(gameState)
//     for (const successorState of successorStates) {
//       for (const stateMovePair of successorState.states) {
//         const evaluation = minimax(
//           stateMovePair.state,
//           depth - 1,
//           alpha,
//           beta,
//           true,
//           turn,
//         )
//         if (evaluation.score < minEval) {
//           minEval = evaluation.score
//           bestMove = stateMovePair.move
//         }
//         beta = Math.min(beta, evaluation.score)
//         if (beta <= alpha) {
//           break // Alpha cut-off
//         }
//       }
//       if (beta <= alpha) {
//         break // Alpha cut-off
//       }
//     }
//     return { score: minEval, move: bestMove }
//   }
// }
export function heuristic_value_of(
  gameState: GameState,
  currentPlayer: Player,
): number {
  let score = 0

  // Evaluate lines for scoring potential

  //Here the turn represents the player color who plays as AI
  let turn = currentPlayer
  score += evaluateLines(gameState.board, turn)

  // Additional heuristic

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
  const playerBonus = 10 // Bonus score for each piece of the current player
  const opponentPenalty = -1 // Penalty score for each piece of the opponent
  const bigNegative = -100 // Big negative score if the opponent is about to win

  if (playerCount > 0 && opponentCount === 0) {
    // Line has only the current player's pieces
    lineScore += playerBonus * playerCount
    if (playerCount === winningThreshold) {
      lineScore += 150 // Big bonus for a winning line
    }
  } else if (opponentCount > 0 && playerCount === 0) {
    // Line has only the opponent's pieces
    lineScore += opponentPenalty * opponentCount
    if (opponentCount === winningThreshold) {
      // Opponent is winning
      lineScore += bigNegative
    }
  }

  // No additional score for mixed lines (both players' pieces present)

  return lineScore
}

// Helper functions to extract rows, columns, and diagonals
function getRow(board: Board, rowIndex: number): Array<Stack> {
  return board[rowIndex]
}

function getColumn(board: Board, colIndex: number): Array<Stack> {
  return board.map((row) => row[colIndex])
}

function getDiagonal(board: Board, mainDiagonal: boolean): Array<Stack> {
  let diagonal = []
  for (let i = 0; i < 4; i++) {
    diagonal.push(mainDiagonal ? board[i][i] : board[i][3 - i])
  }
  return diagonal
}
