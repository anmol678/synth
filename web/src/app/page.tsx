"use client"

import { useAppContext } from '@/context'
import IDE from '@/components/IDE'
import Chatbot from '@/components/Chatbot'
import Loader from '@/components/Loader'

export default function Home() {
  const { state } = useAppContext()

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r flex flex-col">
        <Chatbot />
      </div>

      <div className="w-2/3 flex flex-col">
        {state.loading && <Loader />}
        <div className="flex-1 overflow-y-auto">
          <IDE />
        </div>
      </div>
    </div>
  )
}