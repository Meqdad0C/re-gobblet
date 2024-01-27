import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme-provider'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}
import { Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}
export function minimax_with_pruning(
  gameState: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
  startTime?: number,
  timeLimit?: number,
): MinimaxResult {
  recursionCount++

  const currentTime = Date.now()
  if (startTime && timeLimit) {
    if (currentTime - startTime > timeLimit) {
      // Time limit exceeded
      return {
        score: isMaximizingPlayer ? -Infinity : Infinity,
        move: undefined,
        recursionCount,
      }
    }
  }

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          false,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
        alpha = Math.max(alpha, evaluation.score)
        if (beta <= alpha) {
          break // Beta cut-off
        }
      }
      if (beta <= alpha) {
        break // Beta cut-off
      }
    }

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    const successorStates = getAllSuccesorStates(gameState)

    for (const successorState of successorStates) {
      for (const stateMovePair of successorState.states) {
        const evaluation = minimax_with_pruning(
          stateMovePair.state,
          depth - 1,
          alpha,
          beta,
          true,
          turn,
          recursionCount,
          startTime,
          timeLimit,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
        beta = Math.min(beta, evaluation.score)
        if (beta <= alpha) {
          break // Alpha cut-off
        }
      }
      if (beta <= alpha) {
        break // Alpha cut-off
      }
    }

    return {
      score: minEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  }
}

