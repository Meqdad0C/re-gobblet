import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useGameDispatch, useGame } from '@/hooks/game-hooks'
import { useState } from 'react'

export function WinnerDialog() {
  const [open, setOpen] = useState(true)
  const state = useGame()
  const dispatch = useGameDispatch()

  return (
    // <AlertDialog open={state.winner !== null && open}>
    <AlertDialog open={state.game_over! && open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Player {state.winner! + 1} won the game! 🎉🎉
          </AlertDialogTitle>
          <AlertDialogDescription className='text-orange-600'>
            Would you like to play again? 🤔
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className='bg-violet-500 hover:bg-violet-600'>
            Go to Main Menu
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={() => {
              setOpen(false)
            }}
          >
            Show me the board
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setOpen(false)
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
