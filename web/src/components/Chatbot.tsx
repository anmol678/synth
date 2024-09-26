import MessageList from '@/components/MessageList'
import IntentPills from '@/components/IntentPills'
import Button from '@/components/Button'
import ChatInput from '@/components/ChatInput'
import { useChatbot } from '@/hooks/useChatbot'

export default function Chatbot() {
  const {
    messages,
    onSendMessage,
    loading,
    activeIntent,
    onSetIntent,
    intents,
    onReset
  } = useChatbot()

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-between border-b-2 px-4 py-2">
        <span className="font-bold text-gray-500">Synth</span>
        <Button onClick={onReset} data-variant='small' data-style='danger'>
          Reset
        </Button>
      </div>
      <MessageList messages={messages} sendMessage={onSendMessage} />
      <div className="px-4 py-3 border-t-2">
        <IntentPills
          intents={intents}
          activeIntent={activeIntent}
          onSetIntent={onSetIntent}
          loading={loading}
        />
        <ChatInput onSendMessage={onSendMessage} loading={loading} />
      </div>
    </div>
  )
}
