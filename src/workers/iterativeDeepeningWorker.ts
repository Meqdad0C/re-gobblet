import { iterativeDeepeningMinimax } from '@/algorithm/iterativeDeepening'
import { GameState, Player } from '@/types'

export type IterativeDeepeningProps = {
  state: GameState
  depth: number
  maximizingPlayer: boolean
  timeLimit: number
}

self.onmessage = (e: MessageEvent<IterativeDeepeningProps>) => {
  console.log('[alphaBetaWorker] received message')
  const { state, depth, maximizingPlayer, timeLimit } = e.data
  // Execute the AlphaBeta algorithm
  const result = iterativeDeepeningMinimax(
    state,
    depth,
    maximizingPlayer,
    state.turn,
    timeLimit,
  )

  // Send the result back to the main thread
  self.postMessage(result)
}
