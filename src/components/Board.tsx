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
Lorem ipsum dolor sit amet, 
consectetur adipisicing elit. 
Quae neque harum tenetur ut praesentium quidem blanditiis c
onsequuntur libero molestias? Officiis dolor nostrum error
 eos a fugiat minima 
 quibusdam 
 aliquid
  nihil.
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod fugiat perspiciatis expedita, mollitia delectus, esse id voluptatibus ullam reprehenderit natus doloribus, porro rem dolores modi non optio ducimus adipisci neque.
  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rerum quam architecto adipisci obcaecati, expedita voluptatibus numquam delectus quas vel autem exercitationem sed excepturi in, suscipit quidem aliquam quae doloremque quibusdam.lorem
  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis cupiditate repudiandae laborum tenetur. Excepturi suscipit minima quos iusto ratione sequi beatae accusantium corporis aperiam perspiciatis, rerum sit optio, ut dolorum.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae ducimus quo optio obcaecati quod, doloremque possimus excepturi facilis cumque est aspernatur ullam, repellendus iure autem magnam suscipit. Tempore, corrupti <illo className="lorem">00</illo>
  import { Board, Stack, Player, GameState } from '@/types'
// const INFINITY: number = Number.POSITIVE_INFINITY

export function heuristic_value_of(
  gameState: GameState,
  currentPlayer: Player,
): number {
  let score = 0

  //Here the turn represents the player color who plays as AI
  const turn = currentPlayer
  score += evaluateLines(gameState.board, turn)

  return score
}

function evaluateLines(board: Board, currentPlayer: Player): number {
  let score = 0
  // console.log(score)

  // Evaluate rows, columns, and diagonals
  for (let i = 0; i < 4; i++) {
    score += evaluateLine(getRow(board, i), currentPlayer)
    // console.log(score)
    score += evaluateLine(getColumn(board, i), currentPlayer)
    // console.log(score)
  }
  // console.log('diagonals')
  score += evaluateLine(getDiagonal(board, true), currentPlayer) // Main diagonal
  // console.log(score)
  score += evaluateLine(getDiagonal(board, false), currentPlayer) // Anti-diagonal
  // console.log(score)

  return score
}

function evaluateLine(line: Array<Stack>, currentPlayer: Player): number {
  let score = 0
  let playerCount = 0 // Count of the current player's pieces in the line
  let opponentCount = 0 // Count of the opponent's pieces in the line

  line.forEach((stack) => {
    if (stack.length > 0) {
      const topPiece = stack[stack.length - 1]
      const value = topPiece.size + 1 // Scoring based on size
      if (topPiece.player === currentPlayer) {
        score += value // Favorable for current player
        playerCount++
      } else {
        score -= value // Unfavorable for current player
        opponentCount++
      }
    }
  })

  // Additional scoring based on the number of pieces in the line
  score += evaluateLinePotential(playerCount, opponentCount)

  return score
}

function evaluateLinePotential(
  playerCount: number,
  opponentCount: number,
): number {
  let lineScore = 0

  const winningThreshold = 4 // Number of pieces needed to win
  const playerBonus = 15 // Bonus score for each piece of the current player
  const opponentPenalty = 10 // Penalty score for each piece of the opponent
  const bigNegative = -100 // Big negative score if the opponent is about to win

  if (playerCount > 0) {
    // Line has only the current player's pieces
    lineScore += playerBonus * playerCount
    if (playerCount === winningThreshold) {
      lineScore += 1000 // Big bonus for a winning line
    }
  } else if (opponentCount > 0) {
    // Line has only the opponent's pieces
    lineScore += opponentPenalty * opponentCount
    if (opponentCount === winningThreshold) {
      // Opponent is winning
      lineScore += bigNegative
    }
  }

  return lineScore
}

function getRow(board: Board, rowIndex: number): Array<Stack> {
  return board[rowIndex]
}

function getColumn(board: Board, colIndex: number): Array<Stack> {
  return board.map((row) => row[colIndex])
}

function getDiagonal(board: Board, mainDiagonal: boolean): Array<Stack> {
  const diagonal = []
  for (let i = 0; i < 4; i++) {
    diagonal.push(mainDiagonal ? board[i][i] : board[i][3 - i])
  }
  return diagonal
}
import { Player, GameState } from '@/types'
import { minimax_with_pruning } from './alphaBeta'
// const INFINITY: number = Number.POSITIVE_INFINITY

export function iterativeDeepeningMinimax(
  gameState: GameState,
  maxDepth: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  timeLimit: number,
) {
  let bestMove = null
  const startTime = Date.now()
  let bestScore = isMaximizingPlayer ? -Infinity : Infinity
  let totalRecursionCount = 0

  for (let depth = 1; depth <= maxDepth; depth++) {
    const { score, move, recursionCount } = minimax_with_pruning(
      gameState,
      depth,
      -Infinity,
      Infinity,
      isMaximizingPlayer,
      turn,
      0,
      startTime,
      timeLimit,
    )

    totalRecursionCount += recursionCount

    //if the move come from the break then return the last best move
    if (score === Infinity || score === -Infinity) {
      return {
        score: bestScore,
        move: bestMove,
        recursionCount: totalRecursionCount,
      }
    }

    if (isMaximizingPlayer ? score > bestScore : score < bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return {
    score: bestScore,
    move: bestMove,
    recursionCount: totalRecursionCount,
  }
}
import {  Move, Player, GameState } from '@/types'
import { getAllSuccesorStates } from '@/game-utils'
import { heuristic_value_of } from './heurstics'
// const INFINITY: number = Number.POSITIVE_INFINITY

export interface MinimaxResult {
  score: number
  recursionCount: number
  move?: Move
}

export function minimax(
  gameState: GameState,
  depth: number,
  isMaximizingPlayer: boolean,
  turn: Player,
  recursionCount: number = 0,
): MinimaxResult {
  recursionCount++

  if (depth === 0 || gameState.game_over) {
    return { score: heuristic_value_of(gameState, turn), recursionCount }
  }

  let bestMove: Move | undefined
  let totalRecursionCount = recursionCount // Accumulator for all recursive calls

  const successorStates = getAllSuccesorStates(gameState)

  if (isMaximizingPlayer) {
    let maxEval = -Infinity

    successorStates.forEach((successorState) => {
      successorState.states.forEach((stateMovePair) => {
        const evaluation = minimax(
          stateMovePair.state,
          depth - 1,
          false,
          turn,
          recursionCount,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score
          bestMove = stateMovePair.move
        }
      })
    })

    return {
      score: maxEval,
      move: bestMove,
      recursionCount: totalRecursionCount,
    }
  } else {
    let minEval = Infinity

    successorStates.forEach((successorState) => {
      successorState.states.forEach((stateMovePair) => {
        const evaluation = minimax(
          stateMovePair.state,
          depth - 1,
          true,
          turn,
          recursionCount,
        )
        totalRecursionCount += evaluation.recursionCount - recursionCount // Aggregate recursion count

        if (evaluation.score < minEval) {
          minEval = evaluation.score
          bestMove = stateMovePair.move
        }
      })
    })

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

