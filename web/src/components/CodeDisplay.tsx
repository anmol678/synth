interface CodeDisplayProps {
  code: string
  onCodeChange: (newCode: string) => void
  actions?: { label: string; onClick: () => void }[]
  size?: 'default' | 'large'
}

export default function CodeDisplay({ code, onCodeChange, actions, size = 'default' }: CodeDisplayProps) {
  const textareaHeight = size === 'large' ? 'h-[36rem]' : 'h-64'

  return (
    <div className="mb-8">
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        className={`w-full ${textareaHeight} p-2 border rounded mb-2 font-mono`}
      />
      {actions && (
        <div className="flex space-x-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="px-4 py-2 bg-purple-500 text-white rounded"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}