import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useGameDispatch, useGame } from '@/hooks/game-hooks'
import { Draw } from '@/types'

export function WinnerDialog() {
  const state = useGame()
  const dispatch = useGameDispatch()

  return (
    // <AlertDialog open={state.winner !== null && open}>
    <AlertDialog open={state.game_over! && state.game_started}>
      <AlertDialogContent>
        <AlertDialogHeader>
        {(state.winner != Draw.True) && (state.winner!=null) ? (
                <AlertDialogTitle>
                  Player {state.winner + 1} won the game! 🎉🎉
                </AlertDialogTitle>
              ) : (
                <AlertDialogTitle>
                  It's a draw! 😐
                </AlertDialogTitle>
              )}
          <AlertDialogDescription className='text-orange-600'>
            Would you like to play again? 🤔
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className='bg-violet-500 hover:bg-violet-600'
            onClick={() => {
              dispatch({ type: 'SHOW_BOARD' })
            }}
          >
            Show me the board
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => {
              dispatch({ type: 'RESTART' })
            }}
          >
            Restart Game
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
