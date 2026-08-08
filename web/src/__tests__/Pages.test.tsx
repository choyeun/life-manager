import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { setToken } from '../lib/github'
import { useConfig } from '../hooks/useConfig'
import { SchedulePage } from '../pages/SchedulePage'
import { MilestonePage } from '../pages/MilestonePage'
import { WishlistPage } from '../pages/WishlistPage'

function Wrapper({ children }: { children: React.ReactNode }) {
  useConfig()
  return <div className="min-h-screen black">{children}</div>
}

beforeAll(() => {
  setToken('test-token')
})

describe('SchedulePage', () => {
  it('renders calendar and schedule section', async () => {
    render(
      <MemoryRouter>
        <Wrapper>
          <SchedulePage />
        </Wrapper>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('📅 일정')).toBeInTheDocument()
    })
  })
})

describe('MilestonePage', () => {
  it('renders milestone list with data', async () => {
    render(
      <MemoryRouter>
        <Wrapper>
          <MilestonePage />
        </Wrapper>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('2026 휴가')).toBeInTheDocument()
    })
  })
})

describe('WishlistPage', () => {
  it('shows empty state when no wishlist items', async () => {
    render(
      <MemoryRouter>
        <Wrapper>
          <WishlistPage />
        </Wrapper>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/위시리스트가 비었습니다/)).toBeInTheDocument()
    })
  })

  it('shows create input when clicking + 새 위시', async () => {
    render(
      <MemoryRouter>
        <Wrapper>
          <WishlistPage />
        </Wrapper>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('+ 새 위시')).toBeInTheDocument()
    })
    await userEvent.click(screen.getByText('+ 새 위시'))
    await waitFor(() => {
      expect(screen.getByPlaceholderText('이루고 싶은 것')).toBeInTheDocument()
    })
  })
})