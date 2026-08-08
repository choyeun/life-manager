import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setToken } from '../lib/github'
import App from '../App'

beforeAll(() => {
  setToken('test-token')
})

describe('TodoPage', () => {
  it('renders todo list with issues', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('🔥 NixOS 전환')).toBeInTheDocument()
    })
  })

  it('shows create form when clicking + 새 투두', async () => {
    render(<App />)
    const btn = await screen.findByText('+ 새 투두')
    await userEvent.click(btn)
    expect(screen.getByPlaceholderText('할일 제목')).toBeInTheDocument()
  })

  it('filters by search keyword', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('🔥 NixOS 전환')).toBeInTheDocument()
    })
    const searchInput = screen.getByPlaceholderText('🔍 검색...')
    await userEvent.type(searchInput, '병원')
    await waitFor(() => {
      expect(screen.queryByText('🔥 NixOS 전환')).not.toBeInTheDocument()
      expect(screen.getByText('📋 병원 서류 준비')).toBeInTheDocument()
    })
  })
})