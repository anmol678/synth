import { useState, KeyboardEvent } from 'react'
import { useAppContext } from '@/context'
import { v4 as uuidv4 } from 'uuid'

export default function Chatbot() {
  const { state, dispatch } = useAppContext()
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() === '') return
    const userMessage = {
      id: uuidv4(),
      content: input,
      sender: 'user' as const,
    }
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })
    setInput('')

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: uuidv4(),
        content: 'This is a simulated bot response.',
        sender: 'bot' as const,
      }
      dispatch({ type: 'ADD_MESSAGE', payload: botMessage })
    }, 1000)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {state.messages.map((msg) => (
          <div key={msg.id} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-2 rounded ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border rounded resize-none h-12"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ➤
        </button>
      </div>
    </div>
  )
}