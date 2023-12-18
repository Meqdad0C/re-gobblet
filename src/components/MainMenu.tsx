import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { useOptions } from '@/hooks/game-hooks'
import { Algorithm, GameType } from '@/types'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

export function MainMenu() {
  const [options, setOptions] = useOptions()

  const handleModeChange = (e: GameType) => {
    setOptions({ ...options, game_type: e })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='bg-violet-500 hover:bg-violet-600'>Game Options</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Game Options</SheetTitle>
          <SheetDescription>Customize your game settings.</SheetDescription>
        </SheetHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='mode' className='text-right'>
              Game Mode
            </Label>
            <Select onValueChange={handleModeChange} value={options.game_type}>
              <SelectTrigger className='col-span-3'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='PvP'>Player vs Player</SelectItem>
                  <SelectItem value='PvAI'>Player vs AI</SelectItem>
                  <SelectItem value='AIvAI'>AI vs AI</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {(options.game_type === 'PvAI' || options.game_type === 'AIvAI') && (
            <div className='grid grid-cols-4 gap-4'>
              <Label htmlFor='alg' className='text-right'>
                Algorithm {options.game_type === 'AIvAI' && '(1)'}
              </Label>
              <RadioGroup
                defaultValue={options.algorithm_1}
                className='col-span-3'
                id='alg1'
                onValueChange={(e) =>
                  setOptions({ ...options, algorithm_1: e as Algorithm })
                }
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='Random' id='r' />
                  <Label htmlFor='r'>Random</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='Minimax' id='mm' />
                  <Label htmlFor='mm'>minimax</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='ab' id='ab' />
                  <Label htmlFor='AlphaBeta'>Alpha-beta pruning</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem
                    value='AlphaBetaWithIterativeDeepening'
                    id='abit'
                  />
                  <Label htmlFor='abit'>
                    Alpha-beta pruning with iterative deepening
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
          {options.game_type === 'AIvAI' && (
            <div className='grid grid-cols-4 gap-4'>
              <Label htmlFor='alg' className='text-right'>
                Algorithm (2)
              </Label>
              <RadioGroup
                defaultValue={options.algorithm_2}
                className='col-span-3'
                id='alg2'
                onValueChange={(e) =>
                  setOptions({ ...options, algorithm_2: e as Algorithm })
                }
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='Random' id='r2' />
                  <Label htmlFor='r2'>Random</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='Minimax' id='mm2' />
                  <Label htmlFor='mm2'>minimax</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='AlphaBeta' id='ab2' />
                  <Label htmlFor='ab2'>Alpha-beta pruning</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem
                    value='AlphaBetaWithIterativeDeepening'
                    id='abit2'
                  />
                  <Label htmlFor='abit2'>
                    Alpha-beta pruning with iterative deepening
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
