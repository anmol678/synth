import { useState, KeyboardEvent, ChangeEvent } from 'react'
import Loader from '@/components/Loader'
import MessageList from '@/components/MessageList'
import IntentPills from '@/components/IntentPills'
import Button from '@/components/Button'
import { useChatbot } from '@/hooks/useChatbot'

export default function Chatbot() {
  const { messages, sendMessage, loading, activeIntent, onSetIntent, intents } = useChatbot()
  const [input, setInput] = useState('')

  const handleSend = (message: string) => {
    sendMessage(message)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} sendMessage={sendMessage} />
      <div className="p-2 border-t-2">
        <IntentPills
          intents={intents}
          activeIntent={activeIntent}
          onSetIntent={onSetIntent}
          loading={loading}
        />
        <div className="flex items-center">
          <textarea
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 h-36 mr-2 resize-none focus:outline-none"
            placeholder="Type your message..."
            disabled={loading}
          />
          {loading ? <Loader /> : (
            <Button onClick={() => handleSend(input)} disabled={loading} className="self-end rounded-lg">
              ➤
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
