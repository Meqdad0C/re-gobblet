import { cn } from '@/lib/utils'
import {
  useDroppable,
  useDraggable,
  DndContext,
  DragEndEvent,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Player, Size, Piece_t } from '@/types'
import { useGame, useGameDispatch, useOptions } from '@/hooks/game-hooks'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from './components/ui/separator'
import { Button } from './components/ui/button'
import { MainMenu } from './components/MainMenu'
import { WinnerDialog } from './components/winner-dialog'

/**
 * Piece has a size and a color
 * Color is either red or blue
 * Size is either small, medium, or large
 */
const Piece = ({ player, size, stack_number, location }: Piece_t) => {
  const ref_data: Piece_t = { player, size, stack_number, location }
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `piece-${stack_number}-${player}-${size}`,
    data: ref_data,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        ['absolute rounded-full border-2 border-black '],
        {
          'bg-red-500': player === Player.Red,
          'bg-blue-500': player === Player.Blue,
        },
        {
          'h-8 w-8': size === Size.Small,
          'h-12 w-12': size === Size.Medium,
          'h-16 w-16': size === Size.Large,
          'h-24 w-24': size === Size.XLarge,
        },
        {
          'hover:bg-red-400': player === Player.Red,
          'hover:bg-blue-400': player === Player.Blue,
        },
        {
          'text-sm': size === Size.Small,
          'text-base': size === Size.Medium,
          'text-lg': size === Size.Large,
          'text-xl': size === Size.XLarge,
        },
        {
          'text-white': player === Player.Red,
          'text-black': player === Player.Blue,
        },
        {
          'z-20 opacity-50': transform,
        },
      )}
    />
  )
}

const Inventory = ({ player }: { player: Player }) => {
  const game_state = useGame()
  const inventory = game_state.inventories[player]

  return (
    <div className='grid h-40 w-full grid-cols-3 rounded-2xl border-2 border-black bg-gradient-to-r from-red-300 to-blue-300 dark:border-white'>
      {inventory.map((stack, i) => (
        <div key={i} className='grid items-center justify-items-center'>
          {stack.map((p, idx) => (
            <Piece
              location={p.location}
              key={idx}
              player={p.player}
              size={p.size}
              stack_number={p.stack_number}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

const Board = () => {
  return (
    <div className='board relative flex flex-col gap-2'>
      {[0, 1, 2, 3].map((row) => (
        <Row key={row} row={row} />
      ))}
    </div>
  )
}

const Row = ({ row }: { row: number }) => {
  return (
    <div className='flex gap-2'>
      {[0, 1, 2, 3].map((col) => (
        <Cell key={col} row={row} col={col} />
      ))}
    </div>
  )
}

const Cell = ({ row, col }: { row: number; col: number }) => {
  const { isOver, setNodeRef } = useDroppable({
    data: { row, col },
    id: `cell-${row}-${col}`,
  })
  const { board } = useGame()
  const cell_stack = board[row][col]
  // console.log(cell_stack)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'h-32 w-32 border-2 border-black',
        'bg-gradient-to-r from-green-400 to-blue-500',
        'hover:from-pink-500 hover:to-yellow-500',
        'rounded-2xl',
        'flex items-center justify-center',
        'text-2xl font-bold',
        {
          'border-4 border-red-500': isOver,
        },
      )}
    >
      {cell_stack.map((p, idx) => (
        <Piece
          player={p.player}
          size={p.size}
          stack_number={p.stack_number}
          location={[row, col]}
          key={idx}
        />
      ))}
    </div>
  )
}

const Game = () => {
  const dispatch = useGameDispatch()
  const state = useGame()
  console.log('[game state]', state)

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e
    const dont_do_the_drag =
      active.data.current!.player !== state.turn ||
      state.game_over ||
      !state.game_started
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

const SideBar = () => {
  const state = useGame()
  const dispatch = useGameDispatch()
  const [options] = useOptions()

  return (
    <div className='flex flex-col '>
      <Card className='flex flex-col rounded-2xl border-2 border-black md:w-96'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold'>
            Game Info
          </CardTitle>
          <Separator className='border-2 border-black ' />
          <CardDescription>
            <span className='font-bold'>You Can Edit Game Options Bellow</span>
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col'>
          <p className='text-center'>
            <span className='text-lg font-bold'>Turn:</span> Player{' '}
            {state.turn + 1} {state.turn === Player.Red ? '🔴' : '🔵'}
          </p>
          <p className='text-center'>
            <span className='text-lg font-bold'>Game Type:</span>{' '}
            {options.game_type}
          </p>
          <p className='text-center'>
            <span className='text-lg font-bold'>Algorithm 1:</span>{' '}
            {options.algorithm_1}
          </p>
          <p className='text-center'>
            <span className='text-lg font-bold'>Algorithm 2:</span>{' '}
            {options.algorithm_2}
          </p>
          <p>
            <span className='text-lg font-bold'>Game Started:</span>{' '}
            {state.game_started ? 'Yes' : 'No'}
          </p>
          <p>
            <span className='text-lg font-bold'>Game Over:</span>{' '}
            {state.game_over ? 'Yes' : 'No'}
          </p>
          <p>
            <span className='text-lg font-bold'>Winner:</span>{' '}
            {state.winner !== null ? `Player ${state.winner + 1}` : 'None'}
          </p>
        </CardContent>
        <CardFooter className='mt-auto flex justify-between gap-2'>
          {state.game_started !== true ? (
            <Button
              className='bg-green-500 hover:bg-green-600'
              onClick={() => dispatch({ type: 'START' })}
            >
              Start Game
            </Button>
          ) : (
            <Button
              variant='destructive'
              onClick={() => dispatch({ type: 'RESTART' })}
            >
              Restart Game
            </Button>
          )}
          {state.game_started !== true ? (
            <MainMenu />
          ) : (
            <Button
              onClick={() => dispatch({ type: 'END' })}
            >
              End Game
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default function App() {
  return (
    <>
      <main className='container flex min-h-screen flex-col items-center justify-center gap-2'>
        <h1 className='text-center text-5xl font-bold'>Gobblet!</h1>
        <div className='flex flex-col gap-2 md:flex-row'>
          <WinnerDialog />
          <Game />
          <SideBar />
        </div>
      </main>
    </>
  )
}
