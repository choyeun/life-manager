import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())