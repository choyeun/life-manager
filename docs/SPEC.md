# Life Manager App — 기능 명세서 (SPEC)

> 버전: 0.1 | 작성일: 2026-07-31 | 상태: 초안

---

## 1. 개요

### 1.1 프로젝트 목표
GitHub Issues를 Primary DB로 활용하여 일정/스케줄/마일스톤/위시리스트/투두리스트를 통합 관리하는 개인용 앱.

### 1.2 핵심 원칙
- **GitHub Issues = Primary DB**: 모든 데이터는 `choyeun/life` repo의 Issues에 저장
- **PWA 우선**: 웹앱(PWA) 먼저 개발, Android 네이티브는 Phase 2
- **Obsidian Mirror**: Hermes cron이 주기적으로 Issues → Obsidian vault 동기화
- **TDD + CI**: 모든 기능은 테스트로 검증, GitHub Actions 자동화
- **백엔드 서버**: 선택 사항. GitHub API를 클라이언트에서 직접 호출 (권장), 필요시 백엔드 프록시 도입 가능

### 1.3 대상 플랫폼
| Phase | 플랫폼 | 기술 스택 |
|-------|--------|-----------|
| P0 | 웹 (PWA) | React 19 + Vite + TypeScript + Tailwind CSS v4 |
| P2 | Android | Kotlin + Jetpack Compose + Material 3 |

---

## 2. 데이터 모델

### 2.1 저장소: choyeun/life

모든 데이터는 GitHub Issues에 저장. 라벨 시스템으로 분류.

### 2.2 라벨 체계

#### 타입 (신규, P0에서 추가 완료)
| 라벨 | 용도 | 예시 |
|:----|:----|:----|
| `✏️ todo` | 수행할 작업 | NixOS 전환, 서류 준비 |
| `📅 schedule` | 날짜/시간이 정해진 일정 | 병원 방문 8/4 |
| `💭 wishlist` | 언젠가 이루고 싶은 것 | 유럽 여행 가기 |

#### 일정 📅 (시간축)
| 라벨 | 의미 |
|:----|:----|
| `📅 일정:⭐ 오늘` | 오늘 할 일 |
| `📅 일정:⏰ 빨리` | 빠른 처리 필요 |
| `📅 일정:🕘 아침` | 아침 할 일 |
| `📅 일정:🕑 오후` | 오후 할 일 |
| `📅 일정:🕕 저녁` | 저녁 할 일 |
| `📅 일정:⛱ 휴가` | 휴가 기간 할 일 |
| `📅 일정:⏸️ 응답 대기중` | 타인 응답 대기 |
| `📅 일정:🔁 반복` | 주기적 반복 |
| `📅 일정:? 아마도` | 할 수도 있음 |
| `📅 일정:🔮 언젠가` | 먼 미래 |

#### 우선사항 🔴🔵⚪ (아이젠하워 매트릭스)
| 라벨 | 의미 | 행동 |
|:----|:----|:----|
| `🔴 우선 사항:1️⃣ 중요/긴급` | 위급 | 최우선 처리 |
| `🔴 우선 사항:2️⃣ 중요/긴급X` | 급함 | 계획적으로 처리 |
| `🔵 우선 사항:3️⃣ 중요X/긴급` | 일반 | 부담 없이 처리 |
| `⚪️ 우선 사항:4️⃣ 중요X/긴급X` | 여유 | 시간 날 때 |

#### 유형 ⚡
| 라벨 | 설명 |
|:----|:----|
| `⚡ 유형:🚧 개발` | 코딩/프로그래밍 |
| `⚡ 유형:👔 업무` | 업무 처리 |
| `⚡ 유형:✍️ 블로그` | 글쓰기 |
| `⚡ 유형:📚 읽기` | 독서/문서 |
| `⚡ 유형:🔎 공부` | 학습/시험 |
| `⚡ 유형:📩 메일` | 메일 작성 |
| `⚡ 유형:ℹ️ 정보 필요` | 추가 정보 필요 |
| `⚡ 유형:🍳 요리` | 요리/레시피 |
| `⚡ 유형:🎵 음악` | 음악/보컬로이드 |
| `⚡ 유형:🛠️ 시스템` | 시스템/서버 관리 |
| `⚡ 유형::octocat: GitHub` | GitHub 관리 |

#### 위치 📍 / 기기 🔌 / 에너지 🔋
| 그룹 | 라벨 예시 |
|:----|:----------|
| 위치 | 🏠 집, 🌲 외부, 🚇 지하철, ☁️ 서버, 🏢 회사 |
| 기기 | 🖥 PC, 📱 Phone |
| 에너지 | ⬇Low, ⬆High |

#### 상태
| 라벨 | 의미 |
|:----|:----|
| `The End` | 완료/종료 |

### 2.3 Issue Body 포맷

```markdown
---
date: 2026-08-01
due: 2026-08-05
repeat: weekly      # 선택: daily/weekly/monthly/yearly
repeat_until: 2026-12-31  # 선택: 반복 종료일
related: [42, 57]
---

# 작업 제목

## 상세
- [ ] 체크리스트 항목 1
- [ ] 체크리스트 항목 2

## 노트
부가 설명...
```

### 2.4 마일스톤
GitHub Milestones 기능을 그대로 사용. 진행률 자동 계산.

---

## 3. Use Case

### 3.1 투두리스트 관리
| UC | 설명 |
|:---|:-----|
| UC-01 | 투두 조회: `✏️ todo` 라벨이 있는 모든 Issue를 목록으로 표시 |
| UC-02 | 투두 생성: 새 Issue 생성 + `✏️ todo` 라벨 자동 할당 |
| UC-03 | 투두 수정: Issue 제목/내용/라벨 수정 |
| UC-04 | 투두 완료: `The End` 라벨 추가 + Issue Close |
| UC-05 | 투두 필터링: 라벨(유형/우선순위/위치/에너지/일정)별 필터 |
| UC-06 | 투두 검색: 제목/내용 키워드 검색 (캐시된 데이터를 클라이언트에서 필터링. GitHub 검색 API는 rate limit 별도) |

### 3.2 일정 관리
| UC | 설명 |
|:---|:-----|
| UC-10 | 일정 조회: `📅 schedule` 라벨 Issue를 캘린더 뷰로 표시 |
| UC-11 | 일정 생성: 날짜/시간 포함 Issue 생성 + `📅 schedule` 라벨 |
| UC-12 | 일정 달력뷰: 월간/주간/일간 캘린더 |
| UC-13 | 반복 일정: `🔁 반복` 라벨 + 프론트매터 `repeat:` 필드로 처리 |

**반복 일정 상세:**

| 프론트매터 필드 | 타입 | 예시 | 설명 |
|:---------------|:----|:-----|:-----|
| `repeat` | string | `daily`, `weekly`, `monthly`, `yearly` | 반복 주기 |
| `repeat_until` | date | `2026-12-31` | 반복 종료일 (생략 시 무기한) |

**처리 로직:**
- `repeat: weekly` → 매주 같은 요일, `repeat_until`까지 반복
- UI에서 "다음: 8/7(금)" 식으로 표시 (실제 Issue 복제는 안 함)
- 진짜 Issue 반복 자동 생성은 P1 이후 고려

### 3.3 마일스톤 관리
| UC | 설명 |
|:---|:-----|
| UC-20 | 마일스톤 목록: GitHub Milestones 조회 |
| UC-21 | 마일스톤 상세: 소속 Issue 목록 + 진행률 |
| UC-22 | 마일스톤 생성: GitHub API로 Milestone 생성 |

### 3.4 위시리스트 관리
| UC | 설명 |
|:---|:-----|
| UC-30 | 위시 조회: `💭 wishlist` 라벨 Issue 목록 |
| UC-31 | 위시 생성: 새 Issue + `💭 wishlist` 라벨 |
| UC-32 | 위시 달성: 완료 시 `The End` + Close |

### 3.5 설정
| UC | 설명 |
|:---|:-----|
| UC-40 | GitHub PAT 설정: 토큰 저장/테스트. **필요 권한: `repo` (full) 또는 `issues: write` (Fine-grained PAT)** |
| UC-41 | 테마 설정: 라이트/다크/블랙 |
| UC-42 | Obsidian vault 경로 설정 |
| UC-43 | 필터 기본값 설정 |

### 3.6 연관 관계
| UC | 설명 |
|:---|:-----|
| UC-50 | 쌍방연결: Issue 본문 `[[related: NUM]]` 파싱하여 연결된 Issue 표시 |
| UC-51 | 연결된 Issue 탐색: UI에서 연결된 Issue로 이동 |

---

## 4. 화면 구성 (Wireframe)

### 4.1 네비게이션 구조
```
[Bottom Navigation]
├── 📋 투두        — todo 목록
├── 📅 일정        — 캘린더 뷰
├── 🎯 마일스톤    — 마일스톤 목록
├── 💭 위시리스트  — wishlist 목록
└── ⚙️ 설정        — 설정 페이지
```

### 4.2 주요 화면 (P0)

#### 투두 목록 화면
```
┌──────────────────────────────┐
│ 🔍 검색  [필터: 유형 ▼]      │
├──────────────────────────────┤
│ ☐ 🔥 NixOS 전환              │
│   🛠️ 시스템 · 🔴1️⃣ · ☁️ 서버 │
│   📅 8/3~8/7                  │
├──────────────────────────────┤
│ ☐ 📋 병원 서류 준비          │
│   📩 메일 · 🔵3️⃣ · 🏠 집     │
│   📅 8/1~8/2                  │
├──────────────────────────────┤
│ ☐ 🥩 수육 해먹기             │
│   🍳 요리 · 🔵3️⃣ · 🏠 집     │
│   📅 8/3~8/7                  │
└──────────────────────────────┘
```

#### 일정 화면 (달력)
```
┌──────────────────────────────┐
│  < 2026년 8월 >              │
│  일  월  화  수  목  금  토  │
│                     1   2    │
│   3   4 🔴 5 🏙️  6   7   8   │
│        🏥                     │
└──────────────────────────────┘
```

#### 설정 화면
```
┌──────────────────────────────┐
│ ⚙️ 설정                      │
├──────────────────────────────┤
│ GitHub PAT                   │
│ [·······················]    │
│ [연결 테스트]                │
├──────────────────────────────┤
│ 테마                          │
│ ○ 라이트  ● 다크  ○ 블랙     │
├──────────────────────────────┤
│ Obsidian Vault 경로           │
│ [~/Obsidian/··············]  │
└──────────────────────────────┘
```

---

## 5. API 인터페이스

### 5.1 GitHub API 전략

**GraphQL 메인, REST fallback** — 확장성 고려. Issue가 수백 개로 늘어나도 GraphQL의 cursor pagination과 필드 선택으로 효율적 조회 가능.

| 작업 | 메인 API | Fallback | 비고 |
|:----|:---------|:---------|:-----|
| Issue 목록 조회 | `search(query:"repo:choyeun/life label:✏️ todo")` | `GET /issues?labels=...` | GraphQL은 한 번에 필요한 필드만 |
| Issue 상세 | `node(id: "...") { ... on Issue { ... } }` | `GET /issues/{number}` | |
| Issue 생성 | `createIssue(input: { ... })` | `POST /issues` | |
| Issue 수정/Close | `updateIssue` / `closeIssue` | `PATCH /issues/{number}` | |
| 라벨 목록 | `repository.labels { nodes { ... } }` | `GET /labels` | |
| 마일스톤 목록 | `repository.milestones { nodes { ... } }` | `GET /milestones` | |

**선택 이유:**
- Issue 100개+ 시 GraphQL은 1회 요청으로 모든 데이터 + 필터링 가능
- REST는 페이지네이션 + 중복 데이터로 요청 수 증가
- GitHub GraphQL은 cursor 기반 페이지네이션으로 대규모 데이터에 효율적
- REST는 간단한 단일 조회에 fallback으로 사용

### 5.2 로컬 캐싱 (Rate Limit 대응)

| 캐시 대상 | 저장소 | 전략 |
|:---------|:-------|:-----|
| Issue 목록 | IndexedDB | stale-while-revalidate (5분) |
| 라벨 목록 | localStorage | 1시간 캐시 |
| 마일스톤 | localStorage | 1시간 캐시 |
| Issue 상세 | IndexedDB | ETag 기반 conditional request |
| 변경 큐 (오프라인) | IndexedDB | 온라인 복귀 시 일괄 전송 |

### 5.3 오프라인 동작 (PWA)

| 상태 | 동작 |
|:----|:-----|
| 오프라인 목록 조회 | 캐시된 데이터 표시 + "오프라인" 배너 |
| 오프라인 생성/수정 | **변경 큐에 저장** → 온라인 복귀 시 자동 전송 (GitHub API 호출) |
| 오프라인 완료 처리 | 변경 큐에 저장 → 온라인 복귀 시 `The End` 라벨 + Close |
| 충돌 | 전송 실패 시 재시도 + 에러 표시 |

---

## 6. Obsidian 연동 (P0)

### 6.1 동기화 방식
- **Hermes cron**이 주기적으로 실행
- GitHub Issues → Obsidian 마크다운 파일 변환
- cron 주기: 1시간마다 (또는 매일 3회)

### 6.2 템플릿 구조

#### Daily Note
```markdown
# {{date: YYYY-MM-DD (ddd)}}

## 🎯 오늘 할 일
- [ ] #이슈번호 작업 제목 (📅 일정:⭐ 오늘)
- [ ] ...

## 📅 일정
- 시간: 내용

## 📝 노트
...
```

#### Weekly Note (P0에서 기본, P3에서 확장)
```markdown
# {{date:YYYY}} W## 주차

## ✅ 이번주 완료
- #이슈번호 (완료)

## 🎯 다음주 할 일
- #이슈번호

## 📊 진행률
- 마일스톤명: XX%
```

### 6.3 템플릿 저장소
`choyeun/life-manager/obsidian-templates/` 디렉토리에 템플릿 파일 저장
- `daily.md`
- `weekly.md`
- `monthly.md`

---

## 7. TDD 계획

### 7.1 테스트 스택
| 도구 | 용도 |
|:----|:-----|
| Vitest | 단위 테스트 |
| React Testing Library | 컴포넌트 테스트 |
| MSW (Mock Service Worker) | GitHub API 모킹 |
| Playwright | E2E 테스트 (선택) |

### 7.2 테스트 대상
| 레이어 | 테스트 내용 |
|:-------|:-----------|
| API 클라이언트 | GitHub API 호출/응답/에러 처리 |
| 커스텀 훅 | 데이터 fetching/캐싱/뮤테이션 |
| 컴포넌트 | UI 렌더링/유저 인터랙션 |
| 라우팅 | 페이지 전환/파라미터 |

### 7.3 CI (GitHub Actions)
```yaml
# .github/workflows/web-test.yml
name: Web Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd web && npm ci
      - run: cd web && npm run lint
      - run: cd web && npm run type-check
      - run: cd web && npm run test
      - run: cd web && npm run build
```

---

## 8. Phase별 일정

| Phase | 범위 | 비고 |
|-------|------|------|
| **P0** | 웹앱(React+Vite) + GitHub Issues CRUD + Obsidian 기록 | 현재 진행 중 |
| **P1-A** | Google Calendar 연동 | P0 완료 후 |
| **P1-B** | Todoist + 템플릿 + 쌍방연결 | P1-A 완료 후 |
| **P2** | Android 네이티브 앱 (Kotlin) | 장기 |
| **P3** | Obsidian 계층 노트 + 고급 기능 | 장기 |

> 일정은 유동적. 군복무 환경(LTE only) 감안.

---

## 9. 리스크

| 리스크 | 대책 |
|:-------|:-----|
| GitHub API Rate Limit | 캐싱 + ETag + conditional request |
| LTE 속도 | PWA 오프라인 + 변경 큐 + 코드 스플리팅 |
| PAT 권한 부족 | `repo` 또는 `issues: write` Fine-grained PAT 필요 명시 |
| OAuth 토큰 보안 | localStorage 암호화. 필요시 Hermes 백엔드 프록시 |
| 검색 API rate limit | 클라이언트 사이드 필터링 (캐시 기반) |
| Android Obsidian 접근 | Syncthing/WebDAV 경유 |

---

_이 문서는 지속 업데이트됨. 다음 업데이트: P0 개발 시작 시_