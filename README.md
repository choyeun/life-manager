# Life Manager

개인 일정/스케줄/마일스톤/위시리스트/투두리스트 통합 관리 앱.

> GitHub Issues를 Primary DB로 사용합니다.
> Primary Data: [choyeun/life](https://github.com/choyeun/life)

## 구조

```
life-manager/
├── web/                    # P0: PWA 웹앱 (React + Vite)
├── android/                # P2: Android 앱 (Kotlin) [예정]
├── obsidian-templates/     # Obsidian 노트 템플릿
├── docs/                   # 문서
│   ├── SPEC.md            # 기능 명세서
│   └── ARCHITECTURE.md    # 아키텍처
└── .github/workflows/     # CI
```

## Phase

| Phase | 내용 | 상태 |
|-------|------|:----:|
| P0 | 웹앱 + GitHub Issues CRUD + Obsidian | 🚧 진행 중 |
| P1-A | Google Calendar 연동 | 📅 예정 |
| P1-B | Todoist + 템플릿 + 쌍방연결 | 📅 예정 |
| P2 | Android 앱 (Kotlin) | 📅 예정 |
| P3 | Obsidian 계층 노트 + 고급 기능 | 📅 예정 |

## 기술 스택

- **Web**: React 19 + Vite + TypeScript + Tailwind CSS v4 + vite-plugin-pwa
- **Android**: Kotlin + Jetpack Compose + Material 3 (예정)
- **API**: GitHub GraphQL API (Octokit)
- **CI**: GitHub Actions
- **Test**: Vitest + React Testing Library