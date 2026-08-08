import { useState } from 'react'
import { saveToken, getSavedToken } from '../hooks/useConfig'
import { setToken } from '../lib/github'

export function SettingsPage() {
  const [token, setTokenState] = useState(getSavedToken())
  const [testResult, setTestResult] = useState<'idle' | 'ok' | 'fail'>('idle')

  const handleSaveToken = () => {
    saveToken(token)
  }

  const handleTestToken = async () => {
    try {
      setToken(token)
      const octo = (await import('../lib/github')).getOctokit()
      await octo.users.getAuthenticated()
      setTestResult('ok')
    } catch {
      setTestResult('fail')
    }
  }

  return (
    <div className="py-4">
      <h1 className="text-xl font-bold mb-6">⚙️ 설정</h1>

      {/* GitHub PAT */}
      <section className="mb-6">
        <h2 className="text-sm font-medium mb-2">🔑 GitHub PAT</h2>
        <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
          필요 권한: <code>repo</code> 또는 <code>issues: write</code> (Fine-grained PAT)
        </p>
        <input
          type="password"
          value={token}
          onChange={(e) => {
            setTokenState(e.target.value)
            setTestResult('idle')
          }}
          placeholder="ghp_..."
          className="w-full px-3 py-2 rounded-lg border text-sm mb-2"
          style={{
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSaveToken}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
          >
            저장
          </button>
          <button
            onClick={handleTestToken}
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            연결 테스트
          </button>
          {testResult === 'ok' && (
            <span className="text-xs self-center" style={{ color: '#22c55e' }}>✅ 연결 성공</span>
          )}
          {testResult === 'fail' && (
            <span className="text-xs self-center" style={{ color: '#ef4444' }}>❌ 연결 실패</span>
          )}
        </div>
      </section>

      {/* 블랙(AMOLED) 고정 */}
      <section className="mb-6">
        <h2 className="text-sm font-medium mb-2">🎨 테마</h2>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          ⬛ 블랙(AMOLED) — 고정. <code>#000000</code> 배경, 최소 전력 소모.
        </p>
      </section>

      {/* Obsidian vault 경로 */}
      <section className="mb-6">
        <h2 className="text-sm font-medium mb-2">📓 Obsidian</h2>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Obsidian vault 경로 설정은 <strong>P1+</strong> 기능입니다.
          현재는 Hermes cron 스크립트에 하드코딩되어 있습니다.
        </p>
      </section>
    </div>
  )
}