
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOptions } from '@/hooks/game-hooks'

export function SelectDemo() {
  const [options, setOptions] = useOptions()

  const handleChange = (e: string) => {
    setOptions({ ...options, game_type: e as 'PvP' | 'PvAI' | 'AIvAI' })
  }
  return (
    <Select onValueChange={handleChange} value={options.game_type}>
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
  )
}
