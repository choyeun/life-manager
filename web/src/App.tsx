import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TodoPage } from './pages/TodoPage'
import { SchedulePage } from './pages/SchedulePage'
import { MilestonePage } from './pages/MilestonePage'
import { WishlistPage } from './pages/WishlistPage'
import { SettingsPage } from './pages/SettingsPage'
import { NavBar } from './components/NavBar'
import { useTheme } from './hooks/useTheme'
import { useConfig } from './hooks/useConfig'

export default function App() {
  const { theme } = useTheme()
  useConfig()

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${theme === 'black' ? 'black' : ''}`}>
        <div className="max-w-2xl mx-auto px-4 pb-20">
          <Routes>
            <Route path="/" element={<Navigate to="/todos" replace />} />
            <Route path="/todos" element={<TodoPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/milestones" element={<MilestonePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
        <NavBar />
      </div>
    </BrowserRouter>
  )
}