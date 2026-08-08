#!/usr/bin/env bash
# Obsidian 동기화 스크립트
# Hermes cron으로 매일 3회 실행 (07:00 / 13:00 / 20:00)
# GitHub Issues → Obsidian vault 마크다운 파일 변환
set -euo pipefail

# 설정
OBSIDIAN_VAULT="${OBSIDIAN_VAULT:-$HOME/Obsidian}"
REPO="choyeun/life"
TEMPLATES_DIR="$HOME/life-manager/obsidian-templates"

# GitHub PAT 체크
if [ -z "${GH_TOKEN:-}" ]; then
  echo "GH_TOKEN not set. Skipping Obsidian sync."
  exit 0
fi

# 오늘 날짜
TODAY=$(date +%Y-%m-%d)
WEEK_NUM=$(date +%V)
MONTH=$(date +%Y-%m)

# 디렉토리 생성
mkdir -p "$OBSIDIAN_VAULT/일간" "$OBSIDIAN_VAULT/주간" "$OBSIDIAN_VAULT/월간"

# 오늘 할 일 가져오기 (📅 일정:⭐ 오늘 라벨)
echo "=== Fetching today's issues ==="
TODAY_ISSUES=$(gh issue list --repo "$REPO" --label "📅 일정:⭐ 오늘" --state open --json number,title,labels --limit 20 2>/dev/null || echo "[]")

# 투두 가져오기 (✏️ todo 라벨, open)
echo "=== Fetching todo issues ==="
TODO_ISSUES=$(gh issue list --repo "$REPO" --label "✏️ todo" --state open --json number,title,labels,milestone --limit 50 2>/dev/null || echo "[]")

# 이번주 완료된 것 가져오기
echo "=== Fetching completed this week ==="
COMPLETED_THIS_WEEK=$(gh issue list --repo "$REPO" --label "✏️ todo" --state closed --json number,title,closed_at,labels --limit 50 2>/dev/null || echo "[]")

# 마일스톤 진행률
echo "=== Fetching milestones ==="
MILESTONES=$(gh api "repos/$REPO/milestones?state=open" --jq '.[] | "\(.title): \(.closed_issues)/\(.open_issues + .closed_issues) (\(.due_on // "no-due"))"' 2>/dev/null || echo "")

# === Daily Note 생성 ===
echo "=== Creating daily note ==="
cat > "$OBSIDIAN_VAULT/일간/$TODAY.md" << DAILY_EOF
# $TODAY

## 🎯 오늘 할 일
$(echo "$TODAY_ISSUES" | jq -r '.[] | "- [ ] #\(.number) \(.title)"' 2>/dev/null || echo "- 없음")

## 📋 전체 투두
$(echo "$TODO_ISSUES" | jq -r '.[] | "- [ ] #\(.number) \(.title)"' 2>/dev/null || echo "- 없음")

## 📝 노트
-
DAILY_EOF

# === Weekly Note 생성 ===
echo "=== Creating weekly note ==="
WEEK_FILE="$OBSIDIAN_VAULT/주간/${TODAY}-W${WEEK_NUM}.md"
if [ ! -f "$WEEK_FILE" ]; then
  cat > "$WEEK_FILE" << WEEKLY_EOF
# ${TODAY:0:4} W${WEEK_NUM} 주차

## ✅ 이번주 완료
$(echo "$COMPLETED_THIS_WEEK" | jq -r '.[] | "- [x] #\(.number) \(.title) (\(.closed_at[:10]))"' 2>/dev/null || echo "- 없음")

## 🎯 진행 중
$(echo "$TODO_ISSUES" | jq -r '.[] | "- [ ] #\(.number) \(.title)"' 2>/dev/null || echo "- 없음")

## 📊 마일스톤 진행률
$(echo "$MILESTONES" | head -5 | sed 's/^/- /' || echo "- 없음")

## 📝 주간 회고
-
WEEKLY_EOF
fi

# === Monthly Note 생성 ===
echo "=== Creating monthly note ==="
MONTH_FILE="$OBSIDIAN_VAULT/월간/${MONTH}.md"
if [ ! -f "$MONTH_FILE" ]; then
  cat > "$MONTH_FILE" << MONTHLY_EOF
# ${MONTH} 월간 노트

## 🎯 이번달 목표
-

## ✅ 완료 내역
$(echo "$COMPLETED_THIS_WEEK" | jq -r '.[] | "- [x] #\(.number) \(.title) (\(.closed_at[:10]))"' 2>/dev/null || echo "- 없음")

## 📊 마일스톤 진행률
$(echo "$MILESTONES" | head -10 | sed 's/^/- /' || echo "- 없음")

## 📝 월간 회고
-
MONTHLY_EOF
fi

echo "=== Obsidian sync complete ==="
echo "Daily: $OBSIDIAN_VAULT/일간/$TODAY.md"
echo "Weekly: $WEEK_FILE"
echo "Monthly: $MONTH_FILE"