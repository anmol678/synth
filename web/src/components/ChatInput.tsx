import { useState, ChangeEvent, KeyboardEvent } from 'react'
import Button from '@/components/Button'
import Loader from '@/components/Loader'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  loading: boolean
}

export default function ChatInput({ onSendMessage, loading }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = (message: string) => {
    onSendMessage(message)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  return (
    <div className="flex mt-2 items-center w-full relative">
      <textarea
        value={input}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 h-48 mr-2 resize-none focus:outline-none"
        placeholder="Type your message..."
        disabled={loading}
      />
      <div className="absolute bottom-0 right-0 z-10">
        {loading ? <Loader /> : (
          <Button onClick={() => handleSend(input)} disabled={loading} data-variant='icon' data-style='primary'>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"></path>
            </svg>
          </Button>
        )}
      </div>
    </div>
  )
}
