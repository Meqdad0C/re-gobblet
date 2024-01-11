import { minimax as mm } from './min_max'
import { minimax_with_pruning as ab } from './alphaBeta'
import { iterativeDeepeningMinimax as id } from './iterativeDeepening'

export const minimax = mm
export const minimax_with_pruning = ab
export const iterativeDeepeningMinimax = id
