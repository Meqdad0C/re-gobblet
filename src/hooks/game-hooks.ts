import { GameStateContext, GameDispatchContext } from '@/contexts/game-context'
import { useContext } from 'react'

export const useGame = () => {
  return useContext(GameStateContext)
}

export const useGameDispatch = () => {
  return useContext(GameDispatchContext)
}
