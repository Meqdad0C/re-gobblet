import { GameState, Move } from '@/types'
import { iterativeDeepeningMinimax } from '@/algorithm/iterativeDeepening'
import { minimax } from '@/algorithm/min_max'
import { minimax_with_pruning } from '@/algorithm/alphaBeta'

export type MinimaxProps = {
  type: 'minimax'
  state: GameState
  depth: number
  maximizingPlayer: boolean
}
export type AlphaBetaProps = {
  type: 'alphaBeta'
  state: GameState
  depth: number
  alpha: number
  beta: number
  maximizingPlayer: boolean
}
export type IterativeDeepeningProps = {
  type: 'iterativeDeepening'
  state: GameState
  depth: number
  maximizingPlayer: boolean
  timeLimit: number
}

export type GameWorkerProps =
  | MinimaxProps
  | AlphaBetaProps
  | IterativeDeepeningProps

export type GameWorkerResult = {
  score: number
  move?: Move
  recursionCount: number
}

self.onmessage = (e: MessageEvent<GameWorkerProps>) => {
  console.log('[worker] received', e.data)
  let result
  const { type } = e.data
  if (type === 'minimax') {
    const { state, depth, maximizingPlayer } = e.data
    result = minimax(state, depth, maximizingPlayer, state.turn)
  } else if (type === 'alphaBeta') {
    const { state, depth, alpha, beta, maximizingPlayer } = e.data
    result = minimax_with_pruning(
      state,
      depth,
      alpha,
      beta,
      maximizingPlayer,
      state.turn,
    )
  } else if (type === 'iterativeDeepening') {
    const { state, depth, maximizingPlayer, timeLimit } = e.data
    result = iterativeDeepeningMinimax(
      state,
      depth,
      maximizingPlayer,
      state.turn,
      timeLimit,
    )
  } else {
    throw new Error('Invalid type')
  }

  // Send the result back to the main thread
  self.postMessage(result)
}
