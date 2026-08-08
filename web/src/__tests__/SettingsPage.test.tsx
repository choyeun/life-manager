import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setToken } from '../lib/github'
import App from '../App'

beforeAll(() => {
  setToken('test-token')
})

describe('SettingsPage', () => {
  it('renders settings page with PAT input', async () => {
    render(<App />)
    const settingsLink = screen.getByText('⚙️ 설정')
    await userEvent.click(settingsLink)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('ghp_...')).toBeInTheDocument()
    })
  })

  it('shows black/white theme buttons', async () => {
    render(<App />)
    const settingsLinks = screen.getAllByText('⚙️ 설정')
    await userEvent.click(settingsLinks[1]) // nav link
    await waitFor(() => {
      expect(screen.getByText(/▫️ 화이트/)).toBeInTheDocument()
      expect(screen.getByText(/블랙/)).toBeInTheDocument()
    })
  })

  it('saves token and shows success on test', async () => {
    render(<App />)
    const settingsLinks = screen.getAllByText('⚙️ 설정')
    await userEvent.click(settingsLinks[1]) // nav link

    const input = await screen.findByPlaceholderText('ghp_...')
    await userEvent.clear(input)
    await userEvent.type(input, 'ghp_test123')

    const saveBtn = screen.getByText('저장')
    await userEvent.click(saveBtn)

    const testBtn = screen.getByText('연결 테스트')
    await userEvent.click(testBtn)

    await waitFor(() => {
      expect(screen.getByText(/연결 성공/)).toBeInTheDocument()
    })
  })
})