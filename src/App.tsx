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
import { MinimaxResult} from './algorithm/min_max'


interface GameProps {
  minimaxWorker: Worker
  alphaBetaWorker :Worker
  iterativeDeepeningWorker: Worker
}
const Game = ({ minimaxWorker, alphaBetaWorker, iterativeDeepeningWorker}: GameProps) => {
  const dispatch = useGameDispatch()
  const state = useGame()
  const [options] = useOptions()
  console.log(state)
  minimaxWorker.onmessage = function (e: MessageEvent<MinimaxResult>) {
    const result = e.data
    console.log('[Best move]', result.move)
    console.log('[Score]', result.score)
    console.log('[Recursion Count]',result.recursionCount)

    if (result.move) {
      dispatch(result.move)
    }
  }
  alphaBetaWorker.onmessage = function (e: MessageEvent<MinimaxResult>) {
    const result = e.data
    console.log('[Best move]', result.move)
    console.log('[Score]', result.score)
    console.log('[Recursion Count]',result.recursionCount)

    if (result.move) {
      dispatch(result.move)
    }
  }

  iterativeDeepeningWorker.onmessage = function (e: MessageEvent<MinimaxResult>) {
    const result = e.data
    console.log('[Best move]', result.move)
    console.log('[Score]', result.score)
    console.log('[Recursion Count]',result.recursionCount)

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

      if(options.algorithm_1 === 'Random'){  

        const random_move = ai_random_move(state)
        setTimeout(() => {
          dispatch(random_move);
        }, 500);

      }
      else if(options.algorithm_1 === 'Minimax'){
        
        // Initialize alpha and beta
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;

        // alphaBetaWorker.postMessage({state,depth:1 ,alpha,beta, maximizingPlayer: true})
        minimaxWorker.postMessage({ state, depth: 1, maximizingPlayer: true })      
      }
      else if(options.algorithm_1 === 'AlphaBeta'){
        // Initialize alpha and beta
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;
        // minimaxWorker.postMessage({ state, depth: 3, maximizingPlayer: true })  


        alphaBetaWorker.postMessage({state,depth:2 ,alpha,beta, maximizingPlayer: true})

        // //time limit in milli seconds
        // iterativeDeepeningWorker.postMessage({state,depth:2 ,alpha,beta, maximizingPlayer: true, timeLimit:2000 })
     
      }
      
    }
    if (options.game_type === 'AIvAI' && is_game_running) {

      if(state.turn === Player.Red){

        if(options.algorithm_1 === 'Random' ){

          const random_move = ai_random_move(state);

          setTimeout(() => {
            dispatch(random_move);
          }, 500);

        }

        else if(options.algorithm_1 === 'Minimax'){

          // Initialize alpha and beta
          let alpha = Number.NEGATIVE_INFINITY;
          let beta = Number.POSITIVE_INFINITY;
          // minimaxWorker.postMessage({ state, depth: 3, maximizingPlayer: true })  
          setTimeout(() => {
            alphaBetaWorker.postMessage({state,depth:1 ,alpha,beta, maximizingPlayer: true}) 
          }, 500);
        }
        else if(options.algorithm_1 === 'AlphaBeta'){
          // Initialize alpha and beta
          let alpha = Number.NEGATIVE_INFINITY;
          let beta = Number.POSITIVE_INFINITY;
          // minimaxWorker.postMessage({ state, depth: 3, maximizingPlayer: true })  
          setTimeout(() => {
            alphaBetaWorker.postMessage({state,depth:2 ,alpha,beta, maximizingPlayer: true}) 
          }, 500);
        }
      }
    
    else if(state.turn === Player.Blue){

      if(options.algorithm_2 === 'Random' ){

        const random_move = ai_random_move(state);
        setTimeout(() => {
          dispatch(random_move);
        }, 500);

      }

      else if(options.algorithm_2 === 'Minimax'){

        // Initialize alpha and beta
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;
        // minimaxWorker.postMessage({ state, depth: 3, maximizingPlayer: true })  
        setTimeout(() => {
          alphaBetaWorker.postMessage({state,depth:1 ,alpha,beta, maximizingPlayer: true}) 
        }, 500);

          

      }
      else if(options.algorithm_2 === 'AlphaBeta'){
        // Initialize alpha and beta
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;
        // minimaxWorker.postMessage({ state, depth: 3, maximizingPlayer: true })  
        alphaBetaWorker.postMessage({state,depth:2 ,alpha,beta, maximizingPlayer: true}) 
      }
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

// export default function App() {
//   console.log('[App]')
//   const worker = new Worker(
//     new URL('./workers/minimaxWorker', import.meta.url),
//     { type: 'module' },
//   )
//   return (
//   <>
//       <main className='container flex min-h-screen flex-col items-center justify-center gap-2'>
//         <h1 className='text-center text-5xl font-bold'>Gobblet!</h1>
//         <div className='flex flex-col gap-2 md:flex-row'>
//           <WinnerDialog />
//           <Game worker={worker} />
//           <SideBar />
//         </div>
//       </main>
//     </>
//   )
// }
export default function App() {
  const [minimaxWorker, setMinimaxWorker] = useState<Worker | null>(null);
  const [alphaBetaWorker, setAlphaBetaWorker] = useState<Worker | null>(null);
  const [iterativeDeepeningWorker, setIterativeDeepeningWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const newMinimaxWorker = new Worker(
      new URL('./workers/minimaxWorker', import.meta.url),
      { type: 'module' },
    );
    setMinimaxWorker(newMinimaxWorker);

    const newAlphaBetaWorker = new Worker(
      new URL('./workers/alphaBetaWorker', import.meta.url),
      { type: 'module' },
    );
    setAlphaBetaWorker(newAlphaBetaWorker);

    const newIterativeDeepeningWorker = new Worker(
      new URL('./workers/iterativeDeepeningWorker', import.meta.url),
      { type: 'module' },
    );
    setIterativeDeepeningWorker(newIterativeDeepeningWorker);

    return () => {
      if (newMinimaxWorker) newMinimaxWorker.terminate();
      if (newAlphaBetaWorker) newAlphaBetaWorker.terminate();
      if (newIterativeDeepeningWorker) newIterativeDeepeningWorker.terminate();
    };
  }, []);

  return (
    <div data-theme='cupcake'>
      <main className='container flex min-h-screen flex-col items-center justify-center gap-2'>
        <h1 className='text-center text-5xl font-bold'>Gobblet!</h1>
        <div className='flex flex-col gap-2 md:flex-row'>
          <WinnerDialog />
          {minimaxWorker && alphaBetaWorker && iterativeDeepeningWorker && (
            <Game 
              minimaxWorker={minimaxWorker} 
              alphaBetaWorker={alphaBetaWorker}
              iterativeDeepeningWorker={iterativeDeepeningWorker}
            />
          )}
          <SideBar />
        </div>
      </main>
    </div>
  )
}