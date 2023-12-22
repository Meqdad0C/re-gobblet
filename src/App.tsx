import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import { Player, Piece_t } from '@/types'
import { useGame, useGameDispatch, useOptions } from '@/hooks/game-hooks'
import { WinnerDialog } from './components/winner-dialog'
import { useEffect, useState } from 'react'
import { SideBar } from './components/SideBar'
import { ai_random_move } from './game-utils'
import { Inventory, Board } from './components/Board'
import { MinimaxResult } from './algorithm/min_max'

interface GameProps {
  worker: Worker
}
const Game = ({ worker }: GameProps) => {
  const dispatch = useGameDispatch()
  const state = useGame()
  const [options] = useOptions()

  worker.onmessage = function (e: MessageEvent<MinimaxResult>) {
    const result = e.data
    console.log('[Best move]', result.move)
    console.log('[Score]', result.score)

    if (result.move) {
      dispatch(result.move)
    }
  }
  // console.log('[game state]', state)

  const is_game_running = state.game_started && !state.game_over
  useEffect(() => {
    if (
      options.game_type === 'PvAI' &&
      state.turn === Player.Blue &&
      is_game_running
    ) {
      worker.postMessage({ state, depth: 2, maximizingPlayer: true })

      // const initialAlpha =Number.NEGATIVE_INFINITY;
      // const initialBeta = Number.POSITIVE_INFINITY;

      // const result = minimax(state, 3, initialAlpha, initialBeta, true, Player.Blue);
      // const result = minimax(state, 2, true, Player.Blue);

      // console.log('[Best move] ', result.move)
      // console.log('[Score]', result.score)

      // const random_move = ai_random_move(state)
      // console.log('AI CHOSE', random_move)
      // console.log('[getSuccesorState]', getSuccesorState(state, random_move))
      // if (result.move) {
      //   dispatch(result.move)
      // }
    }
    if (options.game_type === 'AIvAI' && is_game_running) {
      const initialAlpha = Number.POSITIVE_INFINITY
      const initialBeta = Number.NEGATIVE_INFINITY
      // const result = minimax(state, 1, initialAlpha, initialBeta, true, state.turn);
      // const result = minimax(state, 2, true, state.turn);
      // const random_move = ai_random_move(state)
      // console.log('[Best move] ', result.move)
      // console.log('[Score]', result.score)
      // if(result.move)
      //   dispatch(result.move)
    }
  }, [is_game_running, state.turn])

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e
    const is_game_running = state.game_started && !state.game_over
    const ai_turn =
      (options.game_type === 'PvAI' && state.turn === Player.Blue) ||
      options.game_type === 'AIvAI'
    const not_current_player_piece = active.data.current!.player !== state.turn
    const dont_do_the_drag =
      !is_game_running || ai_turn || not_current_player_piece
    if (dont_do_the_drag) return

    if (over && active) {
      const { player, location, stack_number } = active.data.current as Piece_t
      const { row, col } = over.data.current as { row: number; col: number }
      dispatch({
        type: 'MOVE',
        payload: {
          player,
          stack_number,
          from: location,
          to: [row, col],
        },
      })
    }
  }

  const handleDrageStart = (e: DragStartEvent) => {
    const { active } = e
    const is_game_running = state.game_started && !state.game_over
    const ai_turn =
      (options.game_type === 'PvAI' && state.turn === Player.Blue) ||
      options.game_type === 'AIvAI'
    const not_current_player_piece = active.data.current!.player !== state.turn
    const is_piece_in_inventory = active.data.current!.location[0] === -1
    
    const dont_do_the_drag =
      !is_game_running ||
      ai_turn ||
      not_current_player_piece ||
      is_piece_in_inventory
    if (dont_do_the_drag) return

    const { location } = active.data.current as Piece_t
    dispatch({
      type: 'TOUCH_BOARD_PIECE',
      payload: {
        location,
      },
    })
  }

  return (
    <div className='flex flex-col items-center justify-between gap-2'>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDrageStart}>
        <Inventory player={Player.Red} />
        <Board />
        <Inventory player={Player.Blue} />
      </DndContext>
    </div>
  )
}

export default function App() {
  console.log('[App]')
  const worker = new Worker(
    new URL('./workers/minimaxWorker', import.meta.url),
    { type: 'module' },
  )
  return (
    <>
      <main className='container flex min-h-screen flex-col items-center justify-center gap-2'>
        <h1 className='text-center text-5xl font-bold'>Gobblet!</h1>
        <div className='flex flex-col gap-2 md:flex-row'>
          <WinnerDialog />
          <Game worker={worker} />
          <SideBar />
        </div>
      </main>
    </>
  )
}
