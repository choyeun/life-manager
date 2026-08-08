import { http, HttpResponse } from 'msw'

const BASE = 'https://api.github.com'

/** 모킹용 테스트 데이터 */
export const mockIssues = [
  {
    number: 1,
    title: '🔥 NixOS 전환',
    body: '---\ndate: 2026-08-03\ndue: 2026-08-07\n---\n\n서버 OS 전환',
    state: 'open',
    labels: [
      { name: '✏️ todo', color: 'bfdadc', description: null },
      { name: '⚡ 유형:🛠️ 시스템', color: '0e8a16', description: null },
      { name: '🔴 우선 사항:1️⃣ 중요/긴급', color: '7057ff', description: null },
    ],
    milestone: null,
    created_at: '2026-07-29T00:00:00Z',
    updated_at: '2026-07-29T00:00:00Z',
  },
  {
    number: 2,
    title: '📋 병원 서류 준비',
    body: '---\ndate: 2026-08-01\ndue: 2026-08-02\n---\n\n준비물 챙기기',
    state: 'open',
    labels: [
      { name: '✏️ todo', color: 'bfdadc', description: null },
      { name: '📍 위치:🏠 집', color: '257759', description: null },
    ],
    milestone: null,
    created_at: '2026-07-30T00:00:00Z',
    updated_at: '2026-07-30T00:00:00Z',
  },
  {
    number: 3,
    title: '🏥 대학병원 방문',
    body: '---\ndate: 2026-08-04\n---\n\n병원 방문',
    state: 'open',
    labels: [
      { name: '📅 schedule', color: 'bfdadc', description: null },
      { name: '📍 위치:🌲 외부', color: '257759', description: null },
    ],
    milestone: null,
    created_at: '2026-07-28T00:00:00Z',
    updated_at: '2026-07-28T00:00:00Z',
  },
]

export const mockLabels = [
  { name: '✏️ todo', color: 'bfdadc', description: '할일' },
  { name: '📅 schedule', color: 'bfdadc', description: '일정' },
  { name: '⚡ 유형:🛠️ 시스템', color: '0e8a16', description: null },
  { name: '🔴 우선 사항:1️⃣ 중요/긴급', color: '7057ff', description: null },
  { name: '📍 위치:🏠 집', color: '257759', description: null },
  { name: '📍 위치:🌲 외부', color: '257759', description: null },
  { name: 'The End', color: '000000', description: '완료' },
]

export const handlers = [
  // 할일 목록 조회
  http.get(`${BASE}/repos/choyeun/life/issues`, ({ request }) => {
    const url = new URL(request.url)
    const labels = url.searchParams.get('labels') || ''
    const state = url.searchParams.get('state') || 'open'
    const milestone = url.searchParams.get('milestone')

    let filtered = mockIssues.filter((i) => i.state === state)

    if (labels === '✏️ todo') {
      filtered = filtered.filter((i) => i.labels.some((l) => l.name === '✏️ todo'))
    }
    if (labels === '📅 schedule') {
      filtered = filtered.filter((i) => i.labels.some((l) => l.name === '📅 schedule'))
    }
    if (labels === '💭 wishlist') {
      filtered = filtered.filter((i) => i.labels.some((l) => l.name === '💭 wishlist'))
    }
    if (milestone) {
      filtered = filtered.filter((i: any) => i.milestone?.number === parseInt(milestone))
    }

    return HttpResponse.json(filtered)
  }),

  // 단일 Issue 조회
  http.get(`${BASE}/repos/choyeun/life/issues/:number`, ({ params }) => {
    const num = parseInt(params.number as string)
    const issue = mockIssues.find((i) => i.number === num)
    return HttpResponse.json(issue || { ...mockIssues[0], number: num })
  }),

  // Issue 생성
  http.post(`${BASE}/repos/choyeun/life/issues`, async ({ request }) => {
    const body = (await request.json()) as any
    const newIssue = {
      number: mockIssues.length + 1,
      title: body.title,
      body: body.body || '',
      state: 'open',
      labels: (body.labels || []).map((name: string) => ({ name, color: '000000', description: null })),
      milestone: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json(newIssue, { status: 201 })
  }),

  // Issue 수정
  http.patch(`${BASE}/repos/choyeun/life/issues/:number`, async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({ ...mockIssues[0], ...body })
  }),

  // Issue Close
  http.patch(`${BASE}/repos/choyeun/life/issues/:number`, () => {
    return HttpResponse.json({ ...mockIssues[0], state: 'closed' })
  }),

  // 라벨 추가
  http.post(`${BASE}/repos/choyeun/life/issues/:number/labels`, () => {
    return HttpResponse.json(mockLabels)
  }),

  // 라벨 목록
  http.get(`${BASE}/repos/choyeun/life/labels`, () => {
    return HttpResponse.json(mockLabels)
  }),

  // 마일스톤 목록
  http.get(`${BASE}/repos/choyeun/life/milestones`, () => {
    return HttpResponse.json([
      { number: 1, title: '2026 휴가', description: '휴가', due_on: '2026-08-07', open_issues: 5, closed_issues: 2 },
    ])
  }),

  // 인증 사용자 조회 (연결 테스트)
  http.get(`${BASE}/user`, () => {
    return HttpResponse.json({ login: 'choyeun' })
  }),
]