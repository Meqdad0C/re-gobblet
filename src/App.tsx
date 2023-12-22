import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Player, Piece_t } from '@/types'
import { useGame, useGameDispatch, useOptions } from '@/hooks/game-hooks'
import { WinnerDialog } from './components/winner-dialog'
import { useEffect } from 'react'
import { SideBar } from './components/SideBar'
import { ai_random_move } from './game-utils'
import { Inventory, Board } from './components/Board'
import { MinimaxResult } from './algorithm/min_max'
import { worker_url } from './constants'

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
  console.log('[game state]', state)

  const is_game_running = state.game_started && !state.game_over
  useEffect(() => {
    if (
      options.game_type === 'PvAI' &&
      state.turn === Player.Blue &&
      is_game_running
    ) {
      worker.postMessage({ state, depth: 2, maximizingPlayer: true })
    }
    if (options.game_type === 'AIvAI' && is_game_running) {
      const random_move = ai_random_move(state)
      dispatch(random_move)
    }
  }, [is_game_running, state.turn])

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e
    const is_game_running = state.game_started && !state.game_over
    const dont_do_the_drag =
      active.data.current!.player !== state.turn || !is_game_running
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

  return (
    <div className='flex flex-col items-center justify-between gap-2'>
      <DndContext onDragEnd={handleDragEnd}>
        <Inventory player={Player.Red} />
        <Board />
        <Inventory player={Player.Blue} />
      </DndContext>
    </div>
  )
}

export default function App() {
  console.log('[App]')
  const worker = new Worker(new URL(worker_url, import.meta.url), {
    type: 'module',
  })
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
