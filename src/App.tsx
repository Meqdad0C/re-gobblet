import { ModeToggle } from '@/components/mode-toggle'
import { cn } from '@/lib/utils'

enum Player {
  Red,
  Blue,
}

enum Size {
  Small,
  Medium,
  Large,
  XLarge,
}

/**
 * Piece has a size and a color
 * Color is either red or blue
 * Size is either small, medium, or large
 */
const Piece = ({ color, size }: { color: Player; size: Size }) => {

  return (
      <div
        className={cn(
          ['absolute rounded-full border-2 border-black'],
          {
            'bg-red-500': color === Player.Red,
            'bg-blue-500': color === Player.Blue,
          },
          {
            'h-14 w-14': size === Size.Small,
            'h-20 w-20': size === Size.Medium,
            'h-24 w-24': size === Size.Large,
            'h-[6.5rem] w-[6.5rem]': size === Size.XLarge,
          },
          {
            'hover:bg-red-400': color === Player.Red,
            'hover:bg-blue-400': color === Player.Blue,
          },
          {
            'hover:h-16 hover:w-16': size === Size.Small,
            'hover:h-20 hover:w-20': size === Size.Medium,
            'hover:h-24 hover:w-24': size === Size.Large,
            'hover:h-[7rem] hover:w-[7rem]': size === Size.XLarge,
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
        )}
      />
  )
}

const Inventory = ({ player }: { player: Player }) => {
  const stack = [Size.XLarge, Size.Large, Size.Medium, Size.Small]

  return (
    <div className='grid h-40 w-full grid-cols-3 rounded-2xl border-2 border-black dark:border-white'>
      {[0, 1, 2].map((i) => (
        <div key={i} className='grid items-center justify-items-center'>
          {stack.map((size, idx) => (
            <Piece key={idx} color={player} size={size} />
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

const Cell = ({
  row,
  col,
  children,
}: {
  row: number
  col: number
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'h-32 w-32 border-2 border-black',
        'bg-gradient-to-r from-green-400 to-blue-500',
        'hover:from-pink-500 hover:to-yellow-500',
        'rounded-2xl',
        'flex items-center justify-center',
        'text-2xl font-bold',
      )}
    >
      {children}
    </div>
  )
}

const Game = () => {
  return (
    <div className='flex flex-col items-center justify-between gap-2'>
      <Inventory player={Player.Blue} />
      <Board />
      <Inventory player={Player.Red} />
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
