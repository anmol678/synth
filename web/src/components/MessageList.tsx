import React from 'react'
import { Message, MessageSender } from '@/types'
import Button from '@/components/Button'
import Suggestions from '@/utils/suggestions'
import { cn } from '@/utils/styles'

interface MessageListProps {
  messages: Message[]
  sendMessage: (message: string) => void
}

export default function MessageList({ messages, sendMessage }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
        <div className="flex flex-col justify-end">
          <div className="grid grid-cols-2 gap-2 justify-center items-center">
            {Suggestions.map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => sendMessage(suggestion)}
                data-style='secondary'
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
      <div className="flex flex-col justify-end">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("mb-4 flex", `${msg.sender === MessageSender.User ? 'justify-end' : 'justify-start'}`)}>
            <div className={cn("max-w-xs py-2 px-3 rounded-xl text-gray-800", `${msg.sender === MessageSender.User ? 'bg-gray-200' : 'bg-white border'}`)}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
