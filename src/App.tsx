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
import { useEffect } from 'react'

/**
 * Piece has a size and a color
 * Color is either red or blue
 * Size is either small, medium, or large
 */
const Piece = ({ player, size, stack_number, location }: Piece_t) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `piece-${stack_number}-${player}-${size}`,
    data: { stack_number, player, size, location },
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
        ['absolute cursor-pointer rounded-full border-2 border-black'],
        {
          'bg-red-500': player === Player.Red,
          'bg-blue-500': player === Player.Blue,
        },
        {
          'h-14 w-14': size === Size.Small,
          'h-20 w-20': size === Size.Medium,
          'h-[5.5rem] w-[5.5rem]': size === Size.Large,
          'h-[6.5rem] w-[6.5rem]': size === Size.XLarge,
        },
        {
          'hover:bg-red-400': player === Player.Red,
          'hover:bg-blue-400': player === Player.Blue,
        },
        {
          'z-10': size === Size.Small,
          'z-20': size === Size.Medium,
          'z-30': size === Size.Large,
          'z-40': size === Size.XLarge,
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
          'opacity-50': transform,
        },
      )}
    />
  )
}

const Inventory = ({ player }: { player: Player }) => {
  const game_state = useGame()
  const inventory =
    player === Player.Red ? game_state.inventory_0 : game_state.inventory_1

  return (
    <div className='grid h-40 w-full grid-cols-3 rounded-2xl border-2 border-black dark:border-white'>
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
  console.log(cell_stack)

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

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e
    console.log('drag end')
    console.log('[over]', over)
    console.log('[active]', active)
    if (over && active) {
      const { player, location, stack_number, size } = active.data.current
      const { row, col } = over.data.current
      dispatch({
        type: 'MOVE',
        payload: {
          player,
          stack_number,
          size,
          from: location,
          to: [row, col],
        },
      })
    }
  }

  return (
    <div className='flex flex-col items-center justify-between gap-2'>
      <DndContext onDragEnd={handleDragEnd}>
        <Inventory player={Player.Blue} />
        <Board />
        <Inventory player={Player.Red} />
      </DndContext>
    </div>
  )
}

export default function App() {
  return (
    <>
      <main className='container flex min-h-screen flex-col items-center justify-center gap-2'>
        <div className='fixed right-5 top-5'>
          <ModeToggle />
        </div>
        <h1 className='text-center text-5xl font-bold'>Gobblet</h1>
        <Game />
      </main>
    </>
  )
}
