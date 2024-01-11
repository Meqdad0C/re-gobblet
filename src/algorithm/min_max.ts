import {  Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}

export function minimax(
  gameState: GameState,
  depth: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
): MinimaxResult {
  recursionCount++

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  const successorStates = getAllSuccesorStates(gameState)

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    successorStates.forEach((successorState) => {
      successorState.states.forEach((stateMovePair) => {
        const evaluation = minimax(
          stateMovePair.state,
          depth - 1,
          false,
          turn,
          recursionCount,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
      })
    })

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    successorStates.forEach((successorState) => {
      successorState.states.forEach((stateMovePair) => {
        const evaluation = minimax(
          stateMovePair.state,
          depth - 1,
          true,
          turn,
          recursionCount,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
      })
    })

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
