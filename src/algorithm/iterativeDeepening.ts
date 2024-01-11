import { Board, Stack, Move, Player, GameState } from '@/types'
import { minimax_with_pruning } from './alphaBeta'
const INFINITY: number = Number.POSITIVE_INFINITY

export function iterativeDeepeningMinimax(
  gameState: GameState,
  maxDepth: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  timeLimit: number,
) {
  let bestMove = null
  let startTime = Date.now()
  let bestScore = isMaximizingPlayer ? -Infinity : Infinity
  let totalRecursionCount = 0

  for (let depth = 1; depth <= maxDepth; depth++) {
    const { score, move, recursionCount } = minimax_with_pruning(
      gameState,
      depth,
      -Infinity,
      Infinity,
      isMaximizingPlayer,
      turn,
      0,
      startTime,
      timeLimit,
    )

    totalRecursionCount += recursionCount

    //if the move come from the break then return the last best move
    if (score === Infinity || score === -Infinity) {
      return {
        score: bestScore,
        move: bestMove,
        recursionCount: totalRecursionCount,
      }
    }

    if (isMaximizingPlayer ? score > bestScore : score < bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return {
    score: bestScore,
    move: bestMove,
    recursionCount: totalRecursionCount,
  }
}
