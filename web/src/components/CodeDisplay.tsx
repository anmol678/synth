interface CodeDisplayProps {
  code: string
  onCodeChange: (newCode: string) => void
  size?: 'default' | 'full'
}

export default function CodeDisplay({ code, onCodeChange, size = 'default' }: CodeDisplayProps) {
  const textareaHeight = size === 'full' ? 'h-full' : 'h-64'

  return (
    <div className="flex-1">
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        className={`w-full ${textareaHeight} p-2 border rounded mb-2 font-mono`}
      />
    </div>
  )
}