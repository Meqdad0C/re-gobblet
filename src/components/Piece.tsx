import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Player, Size, Piece_t } from '@/types'
import { useGame, useOptions } from '@/hooks/game-hooks'

/**
 * Piece has a size and a color
 * Color is either red or blue
 * Size is either small, medium, or large
 */
export const Piece = ({ player, size, stack_number, location }: Piece_t) => {
  const { touched_board_piece_location, turn } = useGame()
  const [options] = useOptions()
  const ref_data: Piece_t = { player, size, stack_number, location }
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `piece-${stack_number}-${player}-${size}`,
    data: ref_data,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const include_listeners =
    touched_board_piece_location === null
      ? (turn === player && options.game_type === 'PvP') ||
        (options.game_type === 'PvAI' && player === Player.Red)
        ? true
        : false
      : touched_board_piece_location[0] === location[0] &&
        touched_board_piece_location[1] === location[1]

  return include_listeners ? (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        ['absolute rounded-full border-2 border-slate-200'],
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
  ) : (
    <div
      ref={setNodeRef}
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
