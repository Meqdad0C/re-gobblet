import { cn } from '@/lib/utils';
import {
  useDroppable} from '@dnd-kit/core';
import { Player } from '@/types';
import { useGame } from '@/hooks/game-hooks';
import { Piece } from './Piece';

export const Inventory = ({ player }: { player: Player; }) => {
  const game_state = useGame();
  const inventory = game_state.inventories[player];

  return (
    <div className='grid h-40 w-full grid-cols-3 rounded-2xl border-2 border-black bg-gradient-to-r from-red-300 to-blue-300 dark:border-white touch-none'>
      {inventory.map((stack, i) => (
        <div key={i} className='grid items-center justify-items-center'>
          {stack.map((p, idx) => (
            <Piece
              location={p.location}
              key={idx}
              player={p.player}
              size={p.size}
              stack_number={p.stack_number} />
          ))}
        </div>
      ))}
    </div>
  );
};
export const Board = () => {
  return (
    <div className='board relative flex flex-col gap-2'>
      {[0, 1, 2, 3].map((row) => (
        <Row key={row} row={row} />
      ))}
    </div>
  );
};
const Row = ({ row }: { row: number; }) => {
  return (
    <div className='flex gap-2'>
      {[0, 1, 2, 3].map((col) => (
        <Cell key={col} row={row} col={col} />
      ))}
    </div>
  );
};
const Cell = ({ row, col }: { row: number; col: number; }) => {
  const { isOver, setNodeRef } = useDroppable({
    data: { row, col },
    id: `cell-${row}-${col}`,
  });
  const { board } = useGame();
  const cell_stack = board[row][col];
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
        }
      )}
    >
      {cell_stack.map((p, idx) => (
        <Piece
          player={p.player}
          size={p.size}
          stack_number={p.stack_number}
          location={[row, col]}
          key={idx} />
      ))}
    </div>
  );
};