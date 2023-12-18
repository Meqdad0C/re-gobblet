import { GameStateContext, GameDispatchContext } from '@/contexts/game-context'
import { OptionsContext } from '@/contexts/options-context'
import { useContext } from 'react'

export const useGame = () => {
  return useContext(GameStateContext)
}

export const useGameDispatch = () => {
  return useContext(GameDispatchContext)
}

export const useOptions = () => {
  return useContext(OptionsContext)
}
