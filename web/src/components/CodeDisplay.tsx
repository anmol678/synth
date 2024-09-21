interface CodeDisplayProps {
  code: string
  onCodeChange: (newCode: string) => void
  size?: 'default' | 'large'
}

export default function CodeDisplay({ code, onCodeChange, size = 'default' }: CodeDisplayProps) {
  const textareaHeight = size === 'large' ? 'h-[36rem]' : 'h-64'

  return (
    <div className="mb-8">
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        className={`w-full ${textareaHeight} p-2 border rounded mb-2 font-mono`}
      />
    </div>
  )
}