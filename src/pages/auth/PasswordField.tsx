import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '../../components/ui/Input'

type Props = { value: string; onChange: (v: string) => void; isNew: boolean }

export function PasswordField({ value, onChange, isNew }: Props) {
  const [show, setShow] = useState(false)
  const tooShort = value.length > 0 && value.length < 8
  return (
    <div className="relative">
      <Input
        label="Password"
        name="password"
        type={show ? 'text' : 'password'}
        required
        autoComplete={isNew ? 'new-password' : 'current-password'}
        placeholder="At least 8 characters"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={tooShort ? 'At least 8 characters' : undefined}
        className="pr-12"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-[34px] right-2 grid size-9 place-items-center rounded-lg text-ink-300 hover:text-ink-100"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
