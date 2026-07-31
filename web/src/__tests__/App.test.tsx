import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders the todo page by default', () => {
    render(<App />)
    expect(screen.getByText('📋 투두')).toBeDefined()
  })

  it('shows token warning when no token is set', () => {
    render(<App />)
    expect(screen.getByText(/GitHub 토큰/)).toBeDefined()
  })
})