import type { Issue } from '../types'

interface Props {
  issue: Issue
  onComplete: (number: number) => void
}

export function TodoItem({ issue, onComplete }: Props) {
  /** 본문에서 date/due 프론트매터 추출 */
  const dateMatch = issue.body.match(/^date:\s*(\S+)/m)
  const dueMatch = issue.body.match(/^due:\s*(\S+)/m)
  const dateStr = dateMatch?.[1]
  const dueStr = dueMatch?.[1]

  /** 라벨을 그룹별로 분류 */
  const typeLabels = issue.labels.filter((l) => l.name.startsWith('⚡'))
  const priorityLabels = issue.labels.filter(
    (l) => l.name.startsWith('🔴') || l.name.startsWith('🔵') || l.name.startsWith('⚪')
  )
  const locationLabels = issue.labels.filter((l) => l.name.startsWith('📍'))
  const energyLabels = issue.labels.filter((l) => l.name.startsWith('🔋'))

  return (
    <div
      className="rounded-xl p-3 border transition-colors"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        color: 'var(--text)',
      }}
    >
      <div className="flex items-start gap-3">
        {/* 체크박스 */}
        <button
          onClick={() => onComplete(issue.number)}
          className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs transition-colors hover:opacity-80"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          title="완료"
        >
          ✓
        </button>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight mb-1">{issue.title}</h3>

          {/* 라벨 */}
          <div className="flex flex-wrap gap-1 mb-1">
            {[...priorityLabels, ...typeLabels, ...locationLabels, ...energyLabels].map((l) => (
              <span
                key={l.name}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--text)' }}
              >
                {l.name}
              </span>
            ))}
          </div>

          {/* 날짜 */}
          {dateStr && (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              📅 {dateStr}{dueStr ? ` ~ ${dueStr}` : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}