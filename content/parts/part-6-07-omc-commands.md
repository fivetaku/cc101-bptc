---
course_clip_ref: "Part 6 / Ch 01 / Clip 7"
result_path: "50-my-work/Part06-omc/실습07-커맨드카탈로그/"
next_clip_id: "part-6-08-code-review"
---

# Part 6 / Clip 7: OMC 33개 슬래시 커맨드

> 세션: Part 6 / Ch 01 / Clip 7 (~15분)
> 만드는 것: 33개 커맨드 6개 카테고리 매핑 + 내가 자주 쓸 커맨드 5개 메모

---

## 🎯 이 클립에서 만드는 것

19명짜리 외주 팀에게 일을 시키는 방법이 33가지 있다고 보시면 돼요. 33개를 다 외울 필요는 당연히 없습니다. 핵심 5~7개만 손에 익히면 일상 업무는 끝납니다.

저는 워크샵에서 처음 OMC를 소개할 때 `/autopilot` 하나만 보여드렸어요. 그 정도로 시작해도 됩니다. 나머지 32개는 필요할 때마다 천천히 늘려가시면 돼요.

| 카테고리 | 개수 | 대표 |
|---|---|---|
| 실행 모드 | 5 | `/autopilot`, `/ralph`, `/ultrawork` |
| 기획·분석 | 6 | `/plan`, `/deep-interview`, `/trace` |
| AI 협업 | 3 | `/ask`, `/ccg`, `/omc-teams` |
| 코드 품질 | 3 | `/ai-slop-cleaner`, `/visual-verdict`, `/sciomc` |
| 워크스페이스·세팅 | 8 | `/omc-setup`, `/mcp-setup`, `/deepinit` |
| 스킬·메모리 | 5 | `/skill`, `/learner`, `/cancel` |

(릴리스 카테고리에 `/release` 1개 추가, 총 33개)

---

## 💡 핵심 개념

### 카테고리 1 — 실행 모드 (5)

작업을 어떤 방식으로 굴릴지 정하는 커맨드들이에요.

| 커맨드 | 설명 |
|---|---|
| **/autopilot** | 아이디어 한 줄 → 코드까지 자동 (가장 자주 씀) |
| **/ralph** | 작업 완료까지 자기참조 루프 (검증자 포함) |
| **/ultrawork** | 병렬 실행 엔진 — 다중 작업 동시 처리 |
| **/ultraqa** | 테스트 → 검증 → 수정 사이클 (목표 도달까지) |
| **/team** | 같은 작업 목록을 여러 에이전트가 공유 |

처음 한 달은 `/autopilot` 하나만 익히세요. 익숙해지면 큰 작업에 `/ralph`, 병렬이 필요해지면 `/ultrawork`.

### 카테고리 2 — 기획·분석 (6)

작업 시작 전 머리 굴리는 커맨드들이에요.

| 커맨드 | 설명 |
|---|---|
| **/plan** | 인터뷰 기반 전략 기획 |
| **/ralplan** | `/plan --consensus` 별칭 (합의 도달까지) |
| **/deep-interview** | 소크라테스식 심층 인터뷰 + 모호성 검사 |
| **/deep-dive** | trace + deep-interview 2단 파이프라인 |
| **/trace** | 가설 경쟁 인과 추적 |
| **/external-context** | 외부 웹·문서 병렬 리서치 |

PRD 짤 때 `/plan`, 막힌 버그 추적할 때 `/trace`, 자료 조사할 때 `/external-context`.

### 카테고리 3 — AI 협업 (3)

다른 AI 모델과 같이 일하는 커맨드들이에요.

| 커맨드 | 설명 |
|---|---|
| **/ask** | Claude·Codex·Gemini CLI 호출 + 아티팩트 저장 |
| **/ccg** | Codex + Gemini 동시 호출 → Claude가 결과 종합 (3-모델 협업) |
| **/omc-teams** | tmux 패널에 Claude·Codex·Gemini 워커 띄움 |

같은 코드도 모델마다 다른 문제를 잡습니다. 중요한 결정에는 `/ccg`로 두 번째 의견을 받으세요.

### 카테고리 4 — 코드 품질 (3)

만든 결과물을 점검하는 커맨드들이에요.

| 커맨드 | 설명 |
|---|---|
| **/ai-slop-cleaner** | AI 생성 코드 정리 — 회귀 없이 삭제 우선 |
| **/visual-verdict** | 스크린샷 비교용 시각 QA 검증 |
| **/sciomc** | 병렬 scientist 에이전트로 종합 분석 |

AI가 만든 코드에 군더더기가 많이 보이면 `/ai-slop-cleaner`. UI 변경 검증할 때 `/visual-verdict`.

### 카테고리 5 — 워크스페이스·세팅 (8)

설치·환경·진단 커맨드들이에요.

| 커맨드 | 설명 |
|---|---|
| **/omc-setup** | 첫 설치·설정 (배워야 할 유일한 커맨드) |
| **/setup** | 설치·진단·MCP 통합 진입점 |
| **/omc-doctor** | 설치 문제 자동 진단·수정 |
| **/mcp-setup** | 인기 MCP 서버 자동 설정 |
| **/configure-notifications** | Telegram·Discord·Slack 알림 연동 |
| **/hud** | HUD 표시 옵션 |
| **/deepinit** | 코드베이스를 AGENTS.md로 계층적 문서화 |
| **/project-session-manager** | git worktree + tmux 격리 환경 |

설치할 때 `/omc-setup` 한 번, 문제 생기면 `/omc-doctor` 한 번. 나머지는 필요해질 때만.

### 카테고리 6 — 스킬·메모리 (5)

학습·관리 커맨드들이에요.

| 커맨드 | 설명 |
|---|---|
| **/skill** | 로컬 스킬 관리 (목록·추가·삭제·검색·편집) |
| **/learner** | 대화에서 학습한 패턴을 스킬로 추출 |
| **/writer-memory** | 작가용 에이전트 메모리 (등장인물·관계·장면) |
| **/omc-reference** | OMC 카탈로그 자동 로드 |
| **/cancel** | 활성 모드 중단 (autopilot, ralph 등 모두) |

`/cancel`은 안전 장치예요. 어떤 모드든 중단할 수 있어요. `/learner`는 잘 쓰셨던 대화 패턴을 스킬로 박제할 때 씁니다.

---

## 🚶 진행 흐름

### 1. 33개 이름 한 번 훑기 — 3분

위 6개 카테고리를 한 번 위에서 아래로 읽으세요. 이름만 익숙해지면 됩니다.

### 2. 내가 자주 쓸 5개 표시 — 5분

업무 패턴에 따라 자주 쓸 커맨드 5개를 골라보세요. 비개발자 분들 추천 조합:

```markdown
# 내가 자주 쓸 OMC 커맨드 5개

1. /autopilot — 일상 작업 한 줄 시작
2. /plan — 큰 작업 기획
3. /ai-slop-cleaner — AI 결과물 정리
4. /external-context — 외부 자료 리서치
5. /cancel — 막혔을 때 탈출
```

개발자 분들 추천 조합:

```markdown
1. /autopilot
2. /ralph — 완료까지 굴리기
3. /ai-slop-cleaner
4. /ccg — 두 번째 의견
5. /cancel
```

내 상황에 맞게 바꾸면 돼요.

### 3. 핵심 5개 한 번 눌러보기 — 5분

표시한 5개를 차례로 한 번씩 입력해보세요. 인수 없이 입력하면 도움말이 떠요. 화면에서 어떤 옵션이 있는지 보면 감이 잡힙니다.

```text
/autopilot
```

```text
/plan
```

```text
/cancel
```

`/cancel`은 활성 모드가 없으면 그냥 "활성 모드 없음" 메시지만 떠요. 안전합니다.

### 4. 메모 저장 — 2분

5개 목록을 `my-omc-commands.md`로 저장하세요. 지난 클립의 `my-omc-agents.md`와 같은 폴더에 두시면 한 번에 펼쳐볼 수 있어요.

---

## 📦 결과물

- `my-omc-commands.md` — 내가 자주 쓸 5개 커맨드
- 5개 커맨드 한 번씩 눌러본 기록

이번 클립은 카탈로그 한 번 펼쳐보는 게 본 목적이에요. 33개 다 외우려 하지 마시고요.

---

## 🆘 자주 막히는 포인트

### 33개 중 누구를 부를지 모르겠어요

`/autopilot`으로 시작하세요. OMC가 안에서 알맞은 커맨드와 에이전트를 알아서 불러요. 우리가 33개를 의식적으로 하나씩 부르는 경우는 많지 않아요.

### `/plan`과 `/autopilot` 차이가 모호해요

- `/plan` → 기획만 (작업 안 함, 결과는 계획 문서)
- `/autopilot` → 기획 + 실행 (자동 작업까지)

큰 작업을 시작하기 전 검토용으로 `/plan`을 먼저 돌리고, OK면 `/autopilot`으로 넘어가는 흐름도 자주 씁니다.

### `/ralph`와 `/autopilot` 차이는?

- `/autopilot` → 한 번 실행 → 결과 보고
- `/ralph` → 검증 통과까지 반복 (자기참조 루프)

작업이 한 번에 안 끝날 게 분명하면 `/ralph`. 짧은 작업은 `/autopilot`.

### `/ccg`는 비용이 안 드나요?

Claude는 본 구독, Codex와 Gemini는 별도 API 키 또는 구독이 필요해요. 처음 쓰실 때는 `/ask`로 한 모델만 호출해보시고, 쓸 만하다 싶으면 다른 모델 키를 추가하는 흐름이 안전합니다.

### `/cancel`을 눌렀는데 모드가 안 꺼져요

`/cancel --force` 옵션이 있어요. 강제로 모든 상태 파일을 비웁니다. 그래도 안 꺼지면 클로드코드 세션을 한 번 재시작하세요.

---

## 🔗 다음 클립

에이전트와 커맨드를 한 번 훑었으니, 이제 그걸 실제 작업에 써봅니다. 다음 클립은 **코드 리뷰 가이드**예요. 자연어 한 줄부터 명시적 에이전트 호출까지, 상황별로 code-reviewer · security-reviewer를 어떻게 부르는지 정리합니다.

→ **Part 6 / Clip 8: 코드 리뷰 가이드**
