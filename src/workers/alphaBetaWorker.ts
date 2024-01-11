import { minimax_with_pruning } from '@/algorithm/alphaBeta'
import { GameState } from '@/types'

export type AlphaBetaProps = {
  state: GameState
  depth: number
  alpha: number
  beta: number
  maximizingPlayer: boolean
}

self.onmessage = (e: MessageEvent<AlphaBetaProps>) => {
  console.log('[alphaBetaWorker] received message')
  const { state, depth, alpha, beta, maximizingPlayer } = e.data

  // Execute the AlphaBeta algorithm
  const result = minimax_with_pruning(
    state,
    depth,
    alpha,
    beta,
    maximizingPlayer,
    state.turn,
  )

  // Send the result back to the main thread
  self.postMessage(result)
}
