import { describe, it, expect, beforeAll } from 'vitest'
import { setToken, fetchTodos, fetchLabels, createIssue, closeIssue, hasToken } from '../lib/github'

beforeAll(() => {
  setToken('test-token')
})

describe('GitHub API', () => {
  it('hasToken returns true after setting token', () => {
    expect(hasToken()).toBe(true)
  })

  it('fetchTodos returns todo issues', async () => {
    const todos = await fetchTodos()
    expect(todos.length).toBeGreaterThan(0)
    expect(todos[0].title).toContain('NixOS')
  })

  it('fetchLabels returns all labels', async () => {
    const labels = await fetchLabels()
    expect(labels.length).toBeGreaterThan(0)
    expect(labels.some((l) => l.name === '✏️ todo')).toBe(true)
  })

  it('createIssue creates a new issue', async () => {
    const issue = await createIssue({
      title: '테스트 할일',
      body: '테스트 본문',
      labels: ['✏️ todo'],
    })
    expect(issue.title).toBe('테스트 할일')
    expect(issue.labels.some((l) => l.name === '✏️ todo')).toBe(true)
  })

  it('closeIssue closes the issue and adds The End label', async () => {
    const closed = await closeIssue(1)
    expect(closed.state).toBe('closed')
  })
})