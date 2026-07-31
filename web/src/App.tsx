import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TodoPage } from './pages/TodoPage'
import { SettingsPage } from './pages/SettingsPage'
import { NavBar } from './components/NavBar'
import { useTheme } from './hooks/useTheme'
import { useConfig } from './hooks/useConfig'

export default function App() {
  const { theme } = useTheme()
  useConfig() // 설정 로드

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : theme === 'black' ? 'black' : ''}`}>
        <div className="max-w-2xl mx-auto px-4 pb-20">
          <Routes>
            <Route path="/" element={<Navigate to="/todos" replace />} />
            <Route path="/todos" element={<TodoPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
        <NavBar />
      </div>
    </BrowserRouter>
  )
}