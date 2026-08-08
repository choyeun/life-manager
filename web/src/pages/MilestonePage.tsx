import { useState, useEffect } from 'react'
import { fetchMilestones, fetchMilestoneIssues, hasToken } from '../lib/github'
import type { Issue } from '../types'

interface Milestone {
  number: number
  title: string
  description: string
  dueOn: string | null
  openIssues: number
  closedIssues: number
}

export function MilestonePage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [selected, setSelected] = useState<Milestone | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasToken()) return
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchMilestones()
      setMilestones(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleSelect = async (m: Milestone) => {
    setSelected(m)
    setLoading(true)
    try {
      const data = await fetchMilestoneIssues(m.number)
      setIssues(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  if (!hasToken()) {
    return (
      <div className="py-8 text-center" style={{ color: 'var(--muted)' }}>
        <p>🔑 GitHub 토큰을 먼저 설정해주세요</p>
      </div>
    )
  }

  if (selected) {
    const total = selected.openIssues + selected.closedIssues
    const progress = total > 0 ? Math.round((selected.closedIssues / total) * 100) : 0

    return (
      <div className="py-4">
        <button
          onClick={() => setSelected(null)}
          className="text-sm mb-3 opacity-60"
          style={{ color: 'var(--text)' }}
        >
          ← 마일스톤 목록
        </button>

        <h1 className="text-xl font-bold mb-2">🎯 {selected.title}</h1>
        {selected.description && (
          <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>{selected.description}</p>
        )}
        {selected.dueOn && (
          <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>📅 마감: {selected.dueOn.slice(0, 10)}</p>
        )}

        {/* 진행률 */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>{progress}%</span>
            <span>{selected.closedIssues}/{total}</span>
          </div>
          <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: 'var(--accent)' }}
            />
          </div>
        </div>

        {/* Issue 목록 */}
        <h2 className="text-sm font-medium mb-2">📋 할일</h2>
        {issues.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>없음</p>
        ) : (
          <div className="space-y-2">
            {issues.map((issue) => (
              <div
                key={issue.number}
                className="rounded-xl p-3 border text-sm"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  opacity: issue.state === 'closed' ? 0.5 : 1,
                }}
              >
                <span>{issue.state === 'closed' ? '✅' : '☐'} </span>
                {issue.title}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="py-4">
      <h1 className="text-xl font-bold mb-4">🎯 마일스톤</h1>

      {loading ? (
        <p className="text-center py-4" style={{ color: 'var(--muted)' }}>로딩 중...</p>
      ) : milestones.length === 0 ? (
        <p className="text-center py-4 text-sm" style={{ color: 'var(--muted)' }}>마일스톤이 없습니다</p>
      ) : (
        <div className="space-y-3">
          {milestones.map((m) => {
            const total = m.openIssues + m.closedIssues
            const progress = total > 0 ? Math.round((m.closedIssues / total) * 100) : 0
            return (
              <button
                key={m.number}
                onClick={() => handleSelect(m)}
                className="w-full rounded-xl p-3 border text-left transition-colors hover:opacity-80"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <h3 className="font-medium text-sm">{m.title}</h3>
                {m.description && (
                  <p className="text-xs mt-1 opacity-60">{m.description}</p>
                )}
                {m.dueOn && (
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    📅 {m.dueOn.slice(0, 10)}
                  </p>
                )}
                {/* 진행률 */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{progress}%</span>
                    <span>{m.closedIssues}/{total}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${progress}%`, backgroundColor: 'var(--accent)' }}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}