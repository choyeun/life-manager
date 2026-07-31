import { useState, useEffect } from 'react'
import type { Issue, Label } from '../types'
import { fetchTodos, fetchLabels, createIssue, closeIssue } from '../lib/github'
import { hasToken } from '../lib/github'
import { TodoItem } from '../components/TodoItem'
import { TodoForm } from '../components/TodoForm'

export function TodoPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('')
  const [showClosed, setShowClosed] = useState(false)

  const loadData = async () => {
    if (!hasToken()) return
    setLoading(true)
    try {
      const [todoIssues, allLabels] = await Promise.all([
        fetchTodos(),
        fetchLabels(),
      ])
      setIssues(todoIssues)
      setLabels(allLabels)
    } catch (e) {
      console.error('Failed to load data:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  /** 투두 생성 */
  const handleCreate = async (title: string, body: string) => {
    const newIssue = await createIssue({ title, body, labels: ['✏️ todo'] })
    setIssues((prev) => [newIssue, ...prev])
    setShowForm(false)
  }

  /** 투두 완료 */
  const handleComplete = async (issueNumber: number) => {
    await closeIssue(issueNumber)
    setIssues((prev) => prev.filter((i) => i.number !== issueNumber))
  }

  /** 라벨로 필터링 */
  const filteredIssues = issues.filter((issue) => {
    if (!filter) return true
    return issue.labels.some((l) => l.name.includes(filter))
  })

  if (!hasToken()) {
    return (
      <div className="py-8 text-center" style={{ color: 'var(--muted)' }}>
        <p className="mb-4">🔑 GitHub 토큰을 먼저 설정해주세요</p>
        <a href="/settings" className="underline" style={{ color: 'var(--accent)' }}>
          설정 페이지로 이동
        </a>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">📋 투두</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          + 새 투두
        </button>
      </div>

      {showForm && (
        <TodoForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* 필터 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('')}
          className={`px-2 py-1 rounded text-xs whitespace-nowrap ${!filter ? 'font-bold' : 'opacity-60'}`}
          style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
        >
          전체
        </button>
        {labels
          .filter((l) => l.name.startsWith('⚡') || l.name.startsWith('🔴') || l.name.startsWith('🔵') || l.name.startsWith('⚪'))
          .map((label) => (
            <button
              key={label.name}
              onClick={() => setFilter(filter === label.name ? '' : label.name)}
              className={`px-2 py-1 rounded text-xs whitespace-nowrap ${filter === label.name ? 'font-bold ring-2' : 'opacity-70'}`}
              style={{
                backgroundColor: `#${label.color}22`,
                color: `#${label.color}`,
                borderColor: `#${label.color}`,
              }}
            >
              {label.name}
            </button>
          ))}
      </div>

      {/* 완료된 항목 토글 */}
      <button
        onClick={() => setShowClosed(!showClosed)}
        className="text-xs mb-3 opacity-60"
        style={{ color: 'var(--text)' }}
      >
        {showClosed ? '🙈 완료된 항목 숨기기' : '📂 완료된 항목 보기'}
      </button>

      {/* 목록 */}
      {loading ? (
        <p className="text-center py-8" style={{ color: 'var(--muted)' }}>로딩 중...</p>
      ) : filteredIssues.length === 0 ? (
        <p className="text-center py-8" style={{ color: 'var(--muted)' }}>할일이 없습니다 🎉</p>
      ) : (
        <div className="space-y-2">
          {filteredIssues.map((issue) => (
            <TodoItem
              key={issue.number}
              issue={issue}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  )
}