import { minimax } from '@/algorithm/min_max'
import { GameState } from '@/types'

export type MinimaxProps = {
  state: GameState
  depth: number
  maximizingPlayer: boolean
}

self.onmessage = (e: MessageEvent<MinimaxProps>) => {
  console.log('[minimaxWorker] received message')
  const { state, depth, maximizingPlayer } = e.data

  // Execute the minimax algorithm
  const result = minimax(state, depth, maximizingPlayer, state.turn)

  // Send the result back to the main thread
  self.postMessage(result)
}
