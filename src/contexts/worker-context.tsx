import { createWorker } from '@/game-utils'
import { createContext, useState } from 'react'

export const workerContext = createContext({})

const WorkerProvider = ({ children }: { children: React.ReactNode }) => {
  const [worker, setWorker] = useState(createWorker())
  return (
    <workerContext.Provider value={[worker, setWorker]}>
      {children}
    </workerContext.Provider>
  )
}

export default WorkerProvider
