import { useRef, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  onError?: (error: string | undefined) => void
  error?: string
  length?: number
}

export function OtpInput({
  value,
  onChange,
  onError,
  error,
  length = 6,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleInputChange = (index: number, digit: string) => {
    // Only allow digits
    if (!/^\d*$/.test(digit)) return

    const newValue = value.split('')
    newValue[index] = digit
    const otpValue = newValue.join('').slice(0, length)
    onChange(otpValue)
    onError?.(undefined)

    // Move to next input if digit is entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newValue = value.split('')
      newValue[index] = ''
      onChange(newValue.join('').slice(0, index))
      
      // Move to previous input on backspace
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text/plain').replace(/\D/g, '')
    const otpValue = pastedText.slice(0, length)
    onChange(otpValue)
    onError?.(undefined)
    
    // Focus the last input or the next empty one
    const nextIndex = Math.min(otpValue.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-900">Reset Code</label>
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-12 text-center text-2xl font-bold rounded-lg border-2 transition-colors ${
              error
                ? 'border-red-300 bg-red-50 text-red-600'
                : value[index]
                ? 'border-blue-500 bg-blue-50 text-slate-900'
                : 'border-slate-200 bg-white text-slate-900 focus:border-blue-500'
            } focus:outline-none`}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
