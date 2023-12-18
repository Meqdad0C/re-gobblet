import React from "react";
import { GameStateContext, GameDispatchContext } from './game-context';
import { game_initial_state } from "@/constants";
import { useImmerReducer } from "use-immer";
import { gameReducer } from "@/reducers/game-reducer";


export const GameProvider = ({ children }: { children: React.ReactNode} ) => {
  const [game_state, dispatch] = useImmerReducer(
    gameReducer,
    game_initial_state
  )

  return (
    <GameStateContext.Provider value={game_state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  )
};

export default GameProvider
