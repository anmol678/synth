import { useState, KeyboardEvent, ChangeEvent } from 'react'
import { useAppContext } from '@/context'
import { Intent } from '@/types'
import Loader from '@/components/Loader'
import Intents from '@/utils/intents'
import Suggestions from '@/utils/suggestions'

export default function Chatbot() {
  const { state, dispatch, sendMessage } = useAppContext()
  const [input, setInput] = useState('')

  const onSend = (query: string = input) => {
    sendMessage(query)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleSetIntent = (intent: Intent) => {
    dispatch({ type: 'SET_INTENT', payload: intent })
  }

  const intents = [
    state.tables.length === 0 && Intents.GenerateSchema,
    state.tables.length > 0 && Intents.UpdateSchema,
    state.tables.length > 0 && !state.dataGenerationScript && Intents.GenerateScript,
    state.dataGenerationScript && Intents.UpdateScript,
  ].filter(Boolean) as Intent[]

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
        <div className="flex flex-col justify-end">
          {state.messages.length === 0 ? (
            <div className="grid grid-cols-2 gap-2 justify-center items-center">
              {Suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSend(suggestion)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : (
            state.messages.map((msg) => (
              <div key={msg.id} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-2 rounded ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="p-2 border-t">
        {/* Intent Pills */}
        <div className="mb-2 flex space-x-2">
          {intents.map((itm: Intent) => (
            <button
              key={itm.value}
              onClick={() => handleSetIntent(itm)}
              className={`px-3 py-1 rounded-full border ${state.intent?.value === itm.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
                }`}
              disabled={state.loading}
            >
              {itm.label}
            </button>
          ))}
        </div>
        {/* Input and Send Button */}
        <div className="flex items-center">
          <textarea
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 border rounded h-36 mr-2"
            placeholder="Type your message..."
            disabled={state.loading}
          />
          {state.loading
            ? <Loader />
            : <button
              onClick={() => onSend(input)}
              className="px-2 py-1 self-baseline bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={state.loading}
            >
              ➤
            </button>
          }
        </div>
      </div>
    </div>
  )
}