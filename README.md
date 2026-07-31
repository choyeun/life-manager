# Life Manager

개인 일정/스케줄/마일스톤/위시리스트/투두리스트 통합 관리 앱.

> GitHub Issues를 Primary DB로 사용합니다.
> Primary Data: [choyeun/life](https://github.com/choyeun/life)
> **👉 [https://choyeun.github.io/life-manager/](https://choyeun.github.io/life-manager/)**

## 구조

```
life-manager/
├── web/                    # P0: PWA 웹앱 (React + Vite)
├── android/                # P2: Android 앱 (Kotlin) [예정]
├── obsidian-templates/     # Obsidian 노트 템플릿 (Templater 플러그인 필요)
├── docs/                   # 문서
│   ├── SPEC.md            # 기능 명세서
│   └── ARCHITECTURE.md    # 아키텍처
└── .github/workflows/     # CI
```

## Phase

| Phase | 내용 | 상태 |
|-------|------|:----:|
| P0-A | 투두 CRUD + 라벨 필터 + 다크모드 + PAT + PWA | **진짜 MVP (준비 완료)** |
| P0-B | 일정 달력뷰 + 마일스톤 + 위시리스트 | 📅 대기 |
| P0-C | PWA 오프라인 + 검색 + Obsidian cron | 📅 대기 |
| P1-A | Google Calendar 연동 | 📅 예정 |
| P1-B | Todoist + 템플릿 + 쌍방연결 | 📅 예정 |
| P2 | Android 앱 (Kotlin) + 자동업데이트 | 📅 장기 |
| P3 | Obsidian 계층 노트 + 고급 기능 | 📅 장기 |

## 기술 스택

- **Web**: React 19 + Vite + TypeScript + Tailwind CSS v4 + vite-plugin-pwa
- **Android**: Kotlin + Jetpack Compose + Material 3 + 자동업데이트 (예정)
- **API**: GitHub GraphQL API (Octokit) + REST fallback
- **CI**: GitHub Actions
- **Test**: Vitest + React Testing Library + MSW (Node 모드) + Playwright

## 데이터 모델

모든 데이터는 `choyeun/life` repo의 GitHub Issues에 라벨 시스템으로 분류되어 저장됩니다.

**타입 라벨:** `✏️ todo` / `📅 schedule` / `💭 wishlist`
**4축 라벨:** 📅 일정 / 🔴🔵⚪ 우선사항 / ⚡ 유형 / 📍 위치 + 🔌 기기 + 🔋 에너지

자세한 내용은 [SPEC.md](docs/SPEC.md) 참조.