import { game_options_initial_state } from '@/constants'
import { GameOptions } from '@/types'
import { createContext } from 'react'
import { Updater, useImmer } from 'use-immer'

export const OptionsContext = createContext(
  {} as [GameOptions, Updater<GameOptions>],
)

const OptionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [options, setOptions] = useImmer(game_options_initial_state)

  return (
    <OptionsContext.Provider value={[options, setOptions]}>
      {children}
    </OptionsContext.Provider>
  )
}

export default OptionsProvider
