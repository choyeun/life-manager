import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/todos', label: '📋 투두' },
  { path: '/schedule', label: '📅 일정' },
  { path: '/milestones', label: '🎯 마일스톤' },
  { path: '/wishlist', label: '💭 위시' },
  { path: '/settings', label: '⚙️ 설정' },
]

export function NavBar() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto flex justify-around py-2">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              location.pathname.startsWith(tab.path)
                ? 'font-bold'
                : 'opacity-60'
            }`}
            style={{ color: 'var(--text)' }}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}