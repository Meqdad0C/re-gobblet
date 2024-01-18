import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
