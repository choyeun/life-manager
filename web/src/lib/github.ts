/**
 * GitHub API 클라이언트
 * GraphQL 메인, REST fallback
 */
import { Octokit } from '@octokit/rest'
import type { Issue, IssueInput, Label } from '../types'

const OWNER = 'choyeun'
const REPO = 'life'

let _octokit: Octokit | null = null

/** Octokit 인스턴스 반환 (PAT 설정 후 호출) */
export function getOctokit(): Octokit {
  if (!_octokit) {
    throw new Error('GitHub token not set. Call setToken() first.')
  }
  return _octokit
}

/** GitHub PAT 설정 */
export function setToken(token: string): void {
  _octokit = new Octokit({ auth: token })
}

/** 저장된 토큰이 있는지 확인 */
export function hasToken(): boolean {
  return _octokit !== null
}

/**
 * 모든 todo Issue 조회 (GraphQL)
 * search() 대신 repository.issues 사용 (rate limit 절약)
 */
export async function fetchTodos(): Promise<Issue[]> {
  const octo = getOctokit()
  const { data } = await octo.issues.listForRepo({
    owner: OWNER,
    repo: REPO,
    state: 'open',
    labels: '✏️ todo',
    per_page: 100,
  })
  return data.map(mapIssue)
}

/**
 * 모든 라벨 조회
 */
export async function fetchLabels(): Promise<Label[]> {
  const octo = getOctokit()
  const { data } = await octo.issues.listLabelsForRepo({
    owner: OWNER,
    repo: REPO,
    per_page: 100,
  })
  return data.map((l) => ({
    name: l.name,
    color: l.color,
    description: l.description,
  }))
}

/**
 * Issue 생성
 */
export async function createIssue(input: IssueInput): Promise<Issue> {
  const octo = getOctokit()
  const { data } = await octo.issues.create({
    owner: OWNER,
    repo: REPO,
    title: input.title,
    body: input.body ?? '',
    labels: input.labels ?? [],
  })
  return mapIssue(data as any)
}

/**
 * Issue 수정 (제목/내용/라벨)
 */
export async function updateIssue(
  issueNumber: number,
  input: Partial<IssueInput>
): Promise<Issue> {
  const octo = getOctokit()
  const { data } = await octo.issues.update({
    owner: OWNER,
    repo: REPO,
    issue_number: issueNumber,
    ...(input.title !== undefined && { title: input.title }),
    ...(input.body !== undefined && { body: input.body }),
    ...(input.labels !== undefined && { labels: input.labels }),
  })
  return mapIssue(data as any)
}

/**
 * Issue Close (완료 처리)
 * The End 라벨 추가 (없으면) + Close
 */
export async function closeIssue(issueNumber: number): Promise<Issue> {
  const octo = getOctokit()

  // 1. The End 라벨이 없으면 추가
  const { data: current } = await octo.issues.get({
    owner: OWNER,
    repo: REPO,
    issue_number: issueNumber,
  })
  const hasTheEnd = current.labels.some((l: any) => l.name === 'The End')
  if (!hasTheEnd) {
    await octo.issues.addLabels({
      owner: OWNER,
      repo: REPO,
      issue_number: issueNumber,
      labels: ['The End'],
    })
  }

  // 2. Close
  const { data } = await octo.issues.update({
    owner: OWNER,
    repo: REPO,
    issue_number: issueNumber,
    state: 'closed',
  })
  return mapIssue(data as any)
}
/** API 응답을 Issue 타입으로 변환 */
function mapIssue(data: any): Issue {

  return {
    number: data.number,
    title: data.title,
    body: data.body ?? '',
    state: data.state,
    labels: (data.labels ?? []).map((l: any) => ({
      name: l.name ?? l,
      color: l.color ?? '',
      description: l.description ?? null,
    })),
    milestone: data.milestone
      ? { title: data.milestone.title, number: data.milestone.number }
      : null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

/** 일정 조회 */
export async function fetchSchedules(): Promise<Issue[]> {
  const octo = getOctokit()
  const { data } = await octo.issues.listForRepo({
    owner: OWNER,
    repo: REPO,
    state: 'open',
    labels: '📅 schedule',
    per_page: 100,
  })
  return data.map(mapIssue)
}

/** 위시리스트 조회 */
export async function fetchWishlist(): Promise<Issue[]> {
  const octo = getOctokit()
  const { data } = await octo.issues.listForRepo({
    owner: OWNER,
    repo: REPO,
    state: 'open',
    labels: '💭 wishlist',
    per_page: 100,
  })
  return data.map(mapIssue)
}

/** 마일스톤 목록 조회 */
export async function fetchMilestones(): Promise<{ number: number; title: string; description: string; dueOn: string | null; openIssues: number; closedIssues: number }[]> {
  const octo = getOctokit()
  const { data } = await octo.issues.listMilestones({
    owner: OWNER,
    repo: REPO,
    state: 'open',
    sort: 'due_on',
    direction: 'asc',
  })
  return data.map((m) => ({
    number: m.number,
    title: m.title,
    description: m.description ?? '',
    dueOn: m.due_on,
    openIssues: m.open_issues,
    closedIssues: m.closed_issues,
  }))
}

/** 특정 마일스톤에 속한 Issue 조회 */
export async function fetchMilestoneIssues(milestoneNumber: number): Promise<Issue[]> {
  const octo = getOctokit()
  const { data } = await octo.issues.listForRepo({
    owner: OWNER,
    repo: REPO,
    state: 'all',
    milestone: milestoneNumber.toString() as any,
    per_page: 100,
  })
  return data.map(mapIssue)
}