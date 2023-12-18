import { ModeToggle } from '@/components/mode-toggle'
import { cn } from '@/lib/utils'
import {
  useDroppable,
  useDraggable,
  DndContext,
  DragEndEvent,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Player, Size, Piece_t } from '@/types'
import { useGame, useGameDispatch } from '@/hooks/game-hooks'
import { WinnerDialog } from '@/components/winner-dialog'
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
      active.data.current!.player !== state.turn || state.game_over
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

  return (
    <Card
      className='flex flex-col gap-2 rounded-2xl border-2 border-black bg-gradient-to-r
     p-2 dark:border-white md:h-96 md:w-96'
    >
      <CardHeader>
        <CardTitle className='text-center text-2xl font-bold'>
          Game Info
        </CardTitle>
        <Separator className='border-2 border-black dark:border-white' />
      </CardHeader>
      <CardContent>
        <p className='text-center'>
          <span className='text-lg font-bold'>Turn:</span> Player{' '}
          {state.turn + 1} {state.turn === Player.Red ? '🔴' : '🔵'}
        </p>
      </CardContent>
      <CardFooter className='flex justify-between gap-2 mt-auto'>
        <Button
          variant='destructive'
          onClick={() => dispatch({ type: 'RESTART' })}
        >
          Restart Game
        </Button>
        <Button className='bg-violet-500 hover:bg-violet-600'>Main Menu</Button>
      </CardFooter>
    </Card>
  )
}

export default function App() {
  return (
    <>
      <main className='container flex min-h-screen flex-col items-center justify-center gap-2'>
        <div className='fixed right-5 top-5'>
          <ModeToggle />
          <WinnerDialog />
        </div>
        <h1 className='text-center text-5xl font-bold'>Gobblet!</h1>
        <div className='flex flex-col gap-2 md:flex-row'>
          <Game />
          <SideBar />
        </div>
      </main>
    </>
  )
}
