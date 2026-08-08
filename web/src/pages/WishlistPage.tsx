import { useState, useEffect } from 'react'
import type { Issue } from '../types'
import { fetchWishlist, createIssue, closeIssue, hasToken } from '../lib/github'

export function WishlistPage() {
  const [items, setItems] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    if (!hasToken()) return
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchWishlist()
      setItems(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    const issue = await createIssue({
      title: newTitle.trim(),
      body: '---\n---\n\n# 위시리스트\n\n',
      labels: ['💭 wishlist'],
    })
    setItems((prev) => [issue, ...prev])
    setNewTitle('')
    setShowForm(false)
  }

  const handleDone = async (issueNumber: number) => {
    await closeIssue(issueNumber)
    setItems((prev) => prev.filter((i) => i.number !== issueNumber))
  }

  if (!hasToken()) {
    return (
      <div className="py-8 text-center" style={{ color: 'var(--muted)' }}>
        <p>🔑 GitHub 토큰을 먼저 설정해주세요</p>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">💭 위시리스트</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          + 새 위시
        </button>
      </div>

      {showForm && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="이루고 싶은 것"
            className="flex-1 px-3 py-2 rounded-lg border text-sm"
            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button
            onClick={handleCreate}
            className="px-3 py-2 rounded-lg text-xs font-medium"
            style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}
          >
            추가
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="px-3 py-2 rounded-lg text-xs"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            취소
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center py-4" style={{ color: 'var(--muted)' }}>로딩 중...</p>
      ) : items.length === 0 ? (
        <p className="text-center py-4 text-sm" style={{ color: 'var(--muted)' }}>위시리스트가 비었습니다 ✨</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.number}
              className="rounded-xl p-3 border flex items-center justify-between"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <span className="text-sm">{item.title}</span>
              <button
                onClick={() => handleDone(item.number)}
                className="text-xs px-2 py-1 rounded"
                style={{ color: 'var(--accent)' }}
                title="달성!"
              >
                ✨ 달성
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}