import { GameState, GameAction } from '@/types'
import React from 'react'
import { createContext } from 'react'

export const GameStateContext = createContext({} as GameState)
export const GameDispatchContext = createContext(
  {} as React.Dispatch<GameAction>,
)
