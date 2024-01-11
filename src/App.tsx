import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { Player, Piece_t } from '@/types'
import { useGame, useGameDispatch, useOptions } from '@/hooks/game-hooks'
import { WinnerDialog } from './components/winner-dialog'
import { useEffect, useRef, useState } from 'react'
import { SideBar } from './components/SideBar'
import { ai_random_move } from './game-utils'
import { Inventory, Board } from './components/Board'
import { GameWorkerResult } from './workers/game-worker'

type GameProps = {
  gameWorker: Worker
  delay_ref: React.MutableRefObject<number | null>
}

const delayed = (fn: () => void, ms: number) => {
  return setTimeout(fn, ms) as unknown as number
}

const Game = ({ gameWorker, delay_ref }: GameProps) => {
  const dispatch = useGameDispatch()
  const state = useGame()
  const [options] = useOptions()

  const doRandom = () => {
    delay_ref.current = delayed(() => {
      dispatch(ai_random_move(state))
    }, 500)
  }

  const doMinimax = () => {
    delay_ref.current = delayed(() => {
      gameWorker.postMessage({
        type: 'alphaBeta',
        state,
        depth: 1,
        maximizingPlayer: true,
      })
    }, 500)
  }

  const doAlphaBeta = () => {
    gameWorker.postMessage({
      type: 'alphaBeta',
      state,
      depth: 2,
      alpha: Number.NEGATIVE_INFINITY,
      beta: Number.POSITIVE_INFINITY,
      maximizingPlayer: true,
    })
  }

  // @ts-expect-error TODO:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const doIterativeDeepening = () => {
    gameWorker.postMessage({
      type: 'iterativeDeepening',
      state,
      depth: 2,
      alpha: Number.NEGATIVE_INFINITY,
      beta: Number.POSITIVE_INFINITY,
      maximizingPlayer: true,
      timeLimit: 2000,
    })
  }

  console.log('[game state]', state)
  gameWorker.onmessage = function (e: MessageEvent<GameWorkerResult>) {
    const result = e.data
    if (result.move) {
      dispatch(result.move)
    }
  }

  const is_game_running = state.game_started && !state.game_over
  const is_game_against_ai =
    options.game_type === 'PvAI' || options.game_type === 'AIvAI'
  const is_ai_match = options.game_type === 'AIvAI'
  useEffect(() => {
    if (!is_game_running || !is_game_against_ai) return
    if (is_ai_match || state.turn === Player.Blue) {
      const algorithm =
        state.turn === Player.Red ? options.algorithm_1 : options.algorithm_2
      switch (algorithm) {
        case 'Random':
          doRandom()
          break
        case 'Minimax':
          doMinimax()
          break
        case 'AlphaBeta':
          doAlphaBeta()
          break
      }
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

const createWorker = () => {
  const worker = new Worker(new URL('./workers/game-worker', import.meta.url), {
    type: 'module',
  })
  return worker
}

export default function App() {
  console.log('[App]')
  const [gameWorker, setGameWorker] = useState<Worker>(createWorker())
  const delay_ref = useRef<number | null>(0)

  const getNewWorker = () => {
    if (gameWorker) {
      console.log('[getNewWorker] terminate', gameWorker)
      gameWorker.terminate()
    }
    if (delay_ref.current) clearTimeout(delay_ref.current)
    delay_ref.current = 0

    const worker = createWorker()
    setGameWorker(worker)
  }

  return (
    <div data-theme='cupcake'>
      <main className='container flex min-h-screen flex-col items-center justify-center gap-2'>
        <h1 className='text-center text-5xl font-bold'>Gobblet!</h1>
        <div className='flex flex-col gap-2 md:flex-row'>
          <WinnerDialog />
          <Game gameWorker={gameWorker} delay_ref={delay_ref} />
          <SideBar getNewWorker={getNewWorker} />
        </div>
      </main>
    </div>
  )
}
