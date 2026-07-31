/** GitHub Issue 라벨 */
export interface Label {
  name: string
  color: string
  description: string | null
}

/** GitHub Issue */
export interface Issue {
  number: number
  title: string
  body: string
  state: 'open' | 'closed'
  labels: Label[]
  milestone: { title: string; number: number } | null
  created_at: string
  updated_at: string
}

/** Issue 생성/수정 파라미터 */
export interface IssueInput {
  title: string
  body?: string
  labels?: string[]
  milestone?: number | null
}

/** 테마 타입 */
export type Theme = 'light' | 'dark' | 'black'

/** 앱 설정 */
export interface AppConfig {
  githubToken: string
  theme: Theme
}