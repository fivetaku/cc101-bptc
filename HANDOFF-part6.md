# Part 6 핸드오프 — bptc.axwith.com 업데이트

> **요약**: BPTC 4회차 워크샵(2026-05-20) 내용을 Part 6 — OMC 심화로 cc101-bptc 사이트에 추가했습니다. 본 문서는 사이트 운영·배포팀이 확인·배포할 수 있도록 변경 사항·검증 절차·후속 작업을 정리한 핸드오프입니다.
>
> **작성일**: 2026-05-22
> **작성자**: 강사 (이철로) + Claude Code
> **대상**: bptc.axwith.com 개발·배포 담당

---

## 1. 변경 개요

### 1.1 추가된 콘텐츠

**Part 6 — OMC 심화 (BPTC 4회차)** — 9개 클립, 총 115분 분량

| 클립 | 제목 | 길이 |
|---|---|---|
| 6-01 | 컨텍스트 관리 | 5분 |
| 6-02 | 하네스 엔지니어링 | 10분 |
| 6-03 | 워크스페이스 빌딩 — 폴더 구조 | 15분 |
| 6-04 | PRD + 골잡이로 자동 빌딩 | 15분 |
| 6-05 | oh-my-claudecode 설치 · 첫 사용 | 10분 |
| 6-06 | OMC 19개 에이전트 카탈로그 | 15분 |
| 6-07 | OMC 33개 슬래시 커맨드 | 15분 |
| 6-08 | 코드 리뷰 가이드 | 10분 |
| 6-09 | Claude 디자인 + 엑셀 → DB 변환 | 20분 |

> ※ 초기 초안에 있던 "시지프스 — 그리스 신화 에이전트 11개" 클립은 수강생 혼동 우려로 제거되었고, 이후 클립 번호를 당겨 6-08(코드 리뷰)·6-09(디자인·DB)로 재정렬했습니다. (§5.1 완료)

### 1.2 메타 변경

- `course_version`: v6.0 → **v6.1**
- `version`: 0.6.0 → **0.7.0**
- `lastUpdated`: 2026-05-07 → **2026-05-20**
- `tiers.part-6` 신규 추가 (count: 9, order: 6)

---

## 2. 변경된 파일 목록

### 2.1 신규 추가 파일 (9개 클립 + 1개 핸드오프)

```
content/parts/part-6-01-context-management.md
content/parts/part-6-02-harness-engineering.md
content/parts/part-6-03-workspace-building.md
content/parts/part-6-04-prd-goaljaby.md
content/parts/part-6-05-omc-install.md
content/parts/part-6-06-omc-agents.md
content/parts/part-6-07-omc-commands.md
content/parts/part-6-08-code-review.md
content/parts/part-6-09-claude-design-db.md
HANDOFF-part6.md  ← 본 문서
```

### 2.2 수정된 파일

```
content/sections.json
  - sections 배열에 6-01 ~ 6-09 entry 9개 추가 (order 33~41)
  - tiers.part-6 신규 추가 (count: 9)
  - site.version / site.lastUpdated 갱신
```

### 2.3 미수정 (영향 없음)

```
src/             ← Next.js 앱 코드 변경 없음
public/          ← 정적 자산 변경 없음
.github/workflows/deploy.yml  ← 배포 워크플로우 변경 없음
```

---

## 3. 검증 절차

### 3.1 로컬 빌드 확인

```bash
cd /Users/chulrolee/cc101-with-fc/cc101-bptc

# JSON 유효성
python3 -m json.tool content/sections.json > /dev/null && echo "sections.json OK"

# 미리보기 (포트 3000)
npm install        # 처음이라면
npm run dev        # → http://localhost:3000

# 또는 정적 빌드
npm run build
npm run start
```

### 3.2 시각적 확인 체크리스트

브라우저(`http://localhost:3000` 또는 staging URL)에서:

- [ ] 좌측 nav에 **Part 6. OMC 심화 (BPTC 4회차)** 섹션이 표시되는가
- [ ] Part 6 안에 9개 클립 anchor가 순서대로 보이는가
- [ ] 각 클립 페이지가 정상 렌더링되는가 (6-01부터 6-09까지)
- [ ] 클립 안 markdown 요소(테이블·코드블록·이모지 헤더)가 깨지지 않는가
- [ ] 다른 Part(1~5, reference) 페이지가 영향받지 않았는가
- [ ] 모바일 뷰포트에서 표가 가로 스크롤로 잘 동작하는가
- [ ] 다크 모드에서 가독성 OK인가

### 3.3 기존 클립 회귀 체크 (선택)

기존 Part 1~5와 reference 섹션은 건드리지 않았으므로 회귀가 발생하지 않아야 합니다. 빌드가 통과하고 nav가 정상이면 회귀 가능성은 낮습니다.

---

## 4. 배포 절차

### 4.1 자동 배포 (`.github/workflows/deploy.yml`)

저장소가 main 브랜치 push로 자동 배포되도록 구성되어 있다면:

```bash
cd /Users/chulrolee/cc101-with-fc/cc101-bptc
git status                    # 변경 파일 확인
git add content/ HANDOFF-part6.md
git commit -m "feat: Part 6 추가 — BPTC 4회차 OMC 심화 (10 clips)"
git push origin main
```

push 후 GitHub Actions 빌드 로그 확인 → bptc.axwith.com 반영.

### 4.2 수동 배포가 필요한 경우

- GitHub Actions 실패 시: 로그 확인 → 빌드 에러 수정 후 재푸시
- 수동 배포 절차가 별도로 있다면 본 핸드오프와 함께 동봉

---

## 5. 후속 작업 (개발팀 결정 사항)

**현재 배포 가능한 상태**입니다. 아래 5.2는 다음 push에서 반영해도 무방합니다.

### 5.1 시지프스 클립 제거 — ✅ 완료

**배경**: 초안의 시지프스 클립("그리스 신화 에이전트 11개")은 OMC와 별개 풀에 있는 개인 에이전트 묶음 소개라 **수강생 혼동 우려**가 있었습니다.

**처리 결과 (B안)**: 파일 삭제 + 클립 번호 당김을 완료하고, 메타·본문·체인을 모두 9클립 기준으로 정합화했습니다.

- `part-6-08-sisyphus.md` 삭제
- `part-6-09-code-review.md` → `part-6-08-code-review.md`, `part-6-10-claude-design-db.md` → `part-6-09-claude-design-db.md` 리네임
- 각 본문의 `course_clip_ref` · 제목 · 세션 줄 · `next_clip_id` 번호 재정렬 (Clip 9→8, Clip 10→9)
- `part-6-07` 의 "다음 클립" 예고를 시지프스 → 코드 리뷰로 교체
- `part-6-08` 본문의 시지프스 잔존 참조(`sisyphus`/`momus`/`orchestrator-sisyphus`) → OMC `critic`·`executor` 로 교체
- `sections.json`: 시지프스 entry 삭제, 후속 두 클립 id·clip·order·file 갱신, `tiers.part-6.count` 10→9, description 갱신
- `npm run build` 통과 확인 (exit 0)

### 5.2 6-09 클립 분리 검토 (선택, 미실행)

**배경**: 현재 6-09는 "Claude 디자인 + 엑셀 → DB 변환" 두 주제 합본(20분). 두 클립으로 분리하는 게 학습 흐름상 더 좋다는 의견이 있습니다.

**분리 시 작업**:

| 새 클립 | 제목 | 길이 |
|---|---|---|
| 6-09 | Claude 디자인 — 자연어로 디자인하기 | 15분 |
| 6-10 | 엑셀 → DB 변환 — ERD · 스키마 · 수파베이스 | 15분 |

분리 시 각 클립의 본문을 보강해 단독 클립으로 완성도를 높일 필요가 있습니다 (현재 합본은 두 주제를 압축한 상태). 현 상태로도 배포에는 지장이 없습니다.

---

## 6. 관련 자료

### 6.1 BPTC 4회차 슬라이드 데크

- **위치**: 별도 GitHub Pages 배포 — `https://fivetaku.github.io/bptc-ax-4/`
- **소스 repo**: `github.com/fivetaku/bptc-ax-4`
- **로컬 원본**: `/Users/chulrolee/lecture-workshop/30-courses/bptc/_sessions/4회차_덱/`

**개발팀 결정 사항**: 이 deck을 같은 도메인으로 통합할지 결정 필요.
- **옵션 1**: 현재처럼 외부 링크 유지 (간단)
- **옵션 2**: `cc101-bptc/public/decks/4회차/` 로 이동 → `https://bptc.axwith.com/decks/4회차/` (도메인 통합)

옵션 2를 선택하면 각 Part 6 클립의 "🔗 다음 클립" 또는 "📦 결과물" 섹션에 해당 슬라이드 anchor 링크를 끼워넣을 수 있습니다.

### 6.2 원본 작업 폴더

- **강사 워크스페이스**: `/Users/chulrolee/lecture-workshop/`
- **4회차 자료**: `/Users/chulrolee/lecture-workshop/30-courses/bptc/_sessions/`
- **이론 노트**: `30-courses/bptc/_sessions/04회차_이론.md`

### 6.3 cc101-bptc 사이트 소스

- **로컬 경로**: `/Users/chulrolee/cc101-with-fc/cc101-bptc/`
- **content 구조**: `content/sections.json` (메타) + `content/parts/part-{N}-{NN}-{slug}.md` (본문)
- **clip 작성 패턴**: `🎯 만드는 것 → 💡 핵심 개념 → 🚶 진행 흐름 → 📦 결과물 → 🆘 자주 막히는 → 🔗 다음 클립`

---

## 7. 콘텐츠 품질 검토 결과

작성된 9개 클립은 다음 검증을 통과했습니다.

### 7.1 patina audit (AI 글쓰기 패턴 제거 검토)

- **tone**: instructional (강사 톤)
- **검토 패턴**: ko-content, ko-language, ko-style, ko-communication, ko-filler, ko-structure
- **결과**: 모든 클립이 instructional 톤 오버라이드(25:allow, 22:reduce, 28:suppress 등) 적용 후 정상 범위

### 7.2 의미 앵커 (보존된 핵심 주장)

각 클립의 핵심 메시지는 작성 후 검증 단계에서 보존이 확인되었습니다. 변경되었을 수 있는 항목은 본문에서 직접 확인 부탁드립니다.

### 7.3 통일된 스타일

- 강사 1인칭("저는") 적절히 삽입
- 시그너처 어구 반복 회피 ("본체예요" 등)
- 단락 길이 다양화 (균질 단락 SUSPECT zone 회피)
- 표 활용으로 정보 밀도 균형

---

## 8. 연락처

- **콘텐츠 문의**: 강사 (이철로) — gptaku.ai@gmail.com
- **사이트 문의**: cc101-bptc 저장소 Issues
- **긴급 수정 필요 시**: 위 두 채널 중 빠른 곳

---

## 9. 체크리스트 (배포 담당)

배포 전 한 번에 확인:

- [ ] `content/sections.json` JSON 유효성 통과
- [ ] `npm run build` 성공
- [ ] 로컬 미리보기에서 Part 6 nav 표시 확인
- [ ] 9개 클립 페이지 정상 렌더링
- [ ] 기존 Part 1~5 회귀 없음
- [ ] (선택) 후속 작업 5.1 / 5.2 결정 반영
- [ ] (선택) 6.1 deck 통합 여부 결정 반영
- [ ] `git commit` + `git push origin main`
- [ ] GitHub Actions 빌드 성공 확인
- [ ] `https://bptc.axwith.com/` 라이브 확인

---

**문서 끝.** 이상 사항을 한 번에 펼쳐보고 배포 진행해주세요. 추가 질문은 위 연락처로 부탁드립니다.
