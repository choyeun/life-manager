/**
 * Google Calendar API 클라이언트
 * OAuth 2.0 PKCE flow (client secret 불필요)
 * Google Calendar v3 REST API
 */

const SCOPES = 'https://www.googleapis.com/auth/calendar.events'
const TOKEN_KEY = 'life-manager-google-token'

let accessToken: string | null = null

/** Google Calendar OAuth 클라이언트 ID (설정 페이지에서 입력) */
let clientId: string = localStorage.getItem('life-manager-google-client-id') ?? ''

/** Client ID 설정 */
export function setGoogleClientId(id: string): void {
  clientId = id
  localStorage.setItem('life-manager-google-client-id', id)
}

/** 저장된 Client ID 조회 */
export function getGoogleClientId(): string {
  return clientId
}

/** 저장된 토큰이 있는지 확인 */
export function hasGoogleToken(): boolean {
  return !!localStorage.getItem(TOKEN_KEY)
}

/** PKCE: code verifier 생성 */
function generateCodeVerifier(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => chars[b % chars.length]).join('')
}

/** PKCE: code challenge 생성 (SHA-256) */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** PKCE OAuth flow 시작 (Google 로그인 페이지로 리다이렉트) */
export async function startGoogleOAuth(): Promise<void> {
  if (!clientId) throw new Error('Google Client ID not set')

  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)

  // verifier를 sessionStorage에 저장 (redirect 후 복원)
  sessionStorage.setItem('pkce_verifier', verifier)

  const redirectUri = `${window.location.origin}/life-manager/`
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
  })

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

/** OAuth redirect 처리 (code를 token으로 교환) */
export async function handleOAuthRedirect(): Promise<boolean> {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (!code) return false

  const verifier = sessionStorage.getItem('pkce_verifier')
  if (!verifier) return false

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        code,
        code_verifier: verifier,
        redirect_uri: `${window.location.origin}/life-manager/`,
        grant_type: 'authorization_code',
      }),
    })

    const data = await res.json()
    if (data.access_token) {
      accessToken = data.access_token
      localStorage.setItem(TOKEN_KEY, data.access_token)
      if (data.refresh_token) {
        localStorage.setItem('life-manager-google-refresh', data.refresh_token)
      }
      // URL에서 code 파라미터 제거
      window.history.replaceState({}, '', '/life-manager/')
      return true
    }
  } catch (e) {
    console.error('OAuth token exchange failed:', e)
  }
  return false
}

/** 저장된 토큰 복원 */
function restoreToken(): void {
  const saved = localStorage.getItem(TOKEN_KEY)
  if (saved) accessToken = saved
}

/** Google Calendar API 호출 (fetch 기반) */
async function callCalendar<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  restoreToken()
  if (!accessToken) throw new Error('Not authenticated')

  const res = await fetch(`https://www.googleapis.com/calendar/v3${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (res.status === 401) {
    // 토큰 만료 → 재인증 필요
    localStorage.removeItem(TOKEN_KEY)
    accessToken = null
    throw new Error('Token expired')
  }

  return res.json()
}

/** 캘린더 이벤트 타입 */
export interface CalendarEvent {
  id: string
  summary: string
  description: string
  start: { date?: string; dateTime?: string }
  end: { date?: string; dateTime?: string }
  source?: { title: string; url: string }
  colorId?: string
}

/** 이벤트 목록 조회 (primary 캘린더) */
export async function fetchEvents(timeMin: string, timeMax: string): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    calendarId: 'primary',
    timeMin,
    timeMax,
    singleEvents: 'true',
    orderBy: 'startTime',
  })
  const data = await callCalendar<{ items: CalendarEvent[] }>(`/calendars/primary/events?${params}`)
  return data.items ?? []
}

/** 이벤트 생성 */
export async function createEvent(event: {
  summary: string
  description?: string
  date: string
  due?: string
  issueNumber: number
}): Promise<CalendarEvent> {
  const body: any = {
    summary: event.summary,
    description: event.description ?? '',
    source: {
      title: `#${event.issueNumber}`,
      url: `https://github.com/choyeun/life/issues/${event.issueNumber}`,
    },
  }

  if (event.due && event.due !== event.date) {
    // 기간 있는 일정
    body.start = { date: event.date }
    body.end = { date: event.due }
  } else {
    // 하루 일정
    body.start = { date: event.date }
    body.end = { date: event.date }
  }

  return callCalendar('/calendars/primary/events', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** 이벤트 삭제 */
export async function deleteEvent(eventId: string): Promise<void> {
  await callCalendar(`/calendars/primary/events/${eventId}`, { method: 'DELETE' })
}