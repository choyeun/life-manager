import { useState } from 'react'

interface Props {
  onSubmit: (title: string, body: string) => void
  onCancel: () => void
}

export function TodoForm({ onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit(title.trim(), body)
    setTitle('')
    setBody('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-4 mb-4 border"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할일 제목"
        className="w-full bg-transparent text-sm font-medium mb-2 outline-none placeholder:opacity-40"
        style={{ color: 'var(--text)' }}
        autoFocus
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="상세 설명 (선택)"
        rows={3}
        className="w-full bg-transparent text-xs outline-none resize-none placeholder:opacity-40 mb-3"
        style={{ color: 'var(--text)' }}
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs"
          style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          생성
        </button>
      </div>
    </form>
  )
}