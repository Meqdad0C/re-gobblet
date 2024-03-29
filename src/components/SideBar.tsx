import { Player } from '@/types'
import { useGame, useGameDispatch, useOptions } from '@/hooks/game-hooks'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { MainMenu } from './MainMenu'

export const SideBar = ({ getNewWorker }: { getNewWorker: () => void }) => {
  const state = useGame()
  const dispatch = useGameDispatch()
  const [options] = useOptions()

  const is_game_running = state.game_started && !state.game_over
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
          {(options.game_type === 'PvAI' || options.game_type === 'AIvAI') && (
            <p className='text-center'>
              <span className='text-lg font-bold'>Difficulty 1:</span>{' '}
              {options.algorithm_1 == 'AlphaBeta'
                ? 'Hard'
                : options.algorithm_1 == 'Minimax'
                  ? 'Medium'
                  : options.algorithm_1 == 'Random'
                    ? 'Easy'
                    : ''}
            </p>
          )}
          {options.game_type === 'AIvAI' && (
            <p className='text-center'>
              <span className='text-lg font-bold'>Difficulty 2:</span>{' '}
              {options.algorithm_2 == 'AlphaBeta'
                ? 'Hard'
                : options.algorithm_2 == 'Minimax'
                  ? 'Medium'
                  : options.algorithm_2 == 'Random'
                    ? 'Easy'
                    : ''}
            </p>
          )}
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
              onClick={() => dispatch({ type: 'RESTART' })}
            >
              Start Game
            </Button>
          ) : (
            options.game_type !== 'AIvAI' && (
              <Button
                variant='destructive'
                onClick={() => {
                  getNewWorker()
                  dispatch({ type: 'RESTART' })
                }}
              >
                Restart Game
              </Button>
            )
          )}
          {state.game_started !== true ? (
            <MainMenu />
          ) : (
            <Button
              onClick={() => {
                getNewWorker()
                dispatch({ type: 'END' })
              }}
            >
              End Game
            </Button>
          )}
        </CardFooter>
      </Card>
      {is_game_running &&
        ((options.game_type === 'PvAI' && state.turn === Player.Blue) ||
          options.game_type === 'AIvAI') && (
          <div className='flex items-center justify-center gap-2'>
            <span className='loading loading-infinity loading-lg' />
            AI is Thinking...
          </div>
        )}
    </div>
  )
}
