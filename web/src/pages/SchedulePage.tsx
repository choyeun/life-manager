import { useState, useEffect, useMemo } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import type { Issue } from '../types'
import { fetchSchedules, hasToken } from '../lib/github'

export function SchedulePage() {
  const [schedules, setSchedules] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    if (!hasToken()) return
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchSchedules()
      setSchedules(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  /** 선택된 날짜의 일정만 필터링 */
  const selectedDateStr = date.toISOString().slice(0, 10)
  const daySchedules = useMemo(() => {
    return schedules.filter((s) => {
      const dateMatch = s.body.match(/^date:\s*(\S+)/m)
      return dateMatch?.[1] === selectedDateStr
    })
  }, [schedules, selectedDateStr])

  /** 일정이 있는 날짜 표시 */
  const tileContent = ({ date: tileDate }: { date: Date }) => {
    const dateStr = tileDate.toISOString().slice(0, 10)
    const hasSchedule = schedules.some((s) => {
      const m = s.body.match(/^date:\s*(\S+)/m)
      return m?.[1] === dateStr
    })
    return hasSchedule ? <span className="text-xs">📅</span> : null
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
      <h1 className="text-xl font-bold mb-4">📅 일정</h1>

      {/* 달력 */}
      <div className="mb-4 [&_.react-calendar]:w-full [&_.react-calendar]:border-none [&_.react-calendar]:bg-transparent [&_.react-calendar]:text-[var(--text)]"
        style={{ '--cal-color': 'var(--text)' } as React.CSSProperties}
      >
        <Calendar
          onChange={(v) => setDate(v as Date)}
          value={date}
          tileContent={tileContent}
          formatDay={(_, d) => d.getDate().toString()}
        />
      </div>

      {/* 선택된 날짜의 일정 */}
      <h2 className="text-sm font-medium mb-2">
        {selectedDateStr} — {daySchedules.length}개
      </h2>

      {loading ? (
        <p className="text-center py-4" style={{ color: 'var(--muted)' }}>로딩 중...</p>
      ) : daySchedules.length === 0 ? (
        <p className="text-center py-4 text-sm" style={{ color: 'var(--muted)' }}>일정이 없습니다</p>
      ) : (
        <div className="space-y-2">
          {daySchedules.map((s) => {
            const dueMatch = s.body.match(/^due:\s*(\S+)/m)
            const dueStr = dueMatch?.[1]
            return (
              <div
                key={s.number}
                className="rounded-xl p-3 border"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <h3 className="font-medium text-sm">{s.title}</h3>
                {dueStr && (
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    마감: {dueStr}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}