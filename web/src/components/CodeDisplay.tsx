interface CodeDisplayProps {
  code: string
  onCodeChange: (newCode: string) => void
  actions?: { label: string; onClick: () => void }[]
}

export default function CodeDisplay({ code, onCodeChange, actions }: CodeDisplayProps) {
  return (
    <div className="mb-8">
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        className="w-full h-64 p-2 border rounded mb-2 font-mono"
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