"use client"

import IDE from '@/components/IDE'
import Chatbot from '@/components/Chatbot'

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r flex flex-col">
        <Chatbot />
      </div>

      <div className="w-2/3 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <IDE />
        </div>
      </div>
    </div>
  )
}