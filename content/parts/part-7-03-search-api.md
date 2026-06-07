---
course_clip_ref: "Part 7 / Clip 3"
result_path: "50-my-work/Part07-데이터베이스/실습03-검색API/"
next_clip_id: "part-7-04-api-to-db"
---

# Part 7 / Clip 3: 검색 API — 네이버 검색으로 키워드 데이터 모으기

> 세션: Part 7 / Clip 3 (~20분)
> 만드는 것: `naver-news` 스킬 + `scripts/fetch_news.py` + HTML 뉴스레터
> 시연 주제: "클로드코드" 키워드 뉴스레터

---

## 🎯 이 클립에서 만드는 것

공공 API는 "정부가 정해서 푸는 데이터"였어요. 검색 API는 결이 조금 달라요. **내가 키워드를 던지면 그에 맞는 데이터를 모아 오는** 방식입니다. 대표적인 게 네이버 검색 API예요.

Clip 2의 분리 패턴을 한 번 더 굴리면서 두 가지를 얹습니다.

- **AskUserQuestion 인터랙티브** — 호출 시점에 사용자에게 옵션을 묻는 패턴. 정렬 기준(최신순/관련도순)과 시간 범위(6h/24h/48h)를 답변받아 결과를 다르게 만듭니다.
- **HTML 출력** — 마크다운 한 장이 아니라 카테고리 헤더 + 모바일 반응형이 들어간 뉴스레터 한 페이지를 자동으로 만듭니다.

만드는 스킬은 `naver-news`. "클로드코드 뉴스레터 만들어줘" 한 마디로 네이버 검색 API에서 키워드 뉴스를 모아 HTML로 정리해요. 이렇게 모은 데이터가 Clip 4에서 DB로도 들어갑니다.

진행은 다섯 단계예요. 네이버 키 발급 → 워크플로우 → 분리 정의 → 스킬+스크립트 → 호출 테스트.

---

## 💡 핵심 개념

### Clip 2와 같은 뼈대 + 새 두 가지

같은 분리 흐름을 한 번 더 굴리면 패턴이 손에 더 잡혀요.

| 단계 | Clip 2 trip-advisor | Clip 3 naver-news |
|---|---|---|
| 키 발급 | 공공데이터포털 TourAPI | 네이버 개발자센터 |
| `.env` 변수 | `TOURAPI_SERVICE_KEY` | `NAVER_CLIENT_ID` + `NAVER_CLIENT_SECRET` |
| Python 스크립트 | `tour_api.py` (5 액션) | `fetch_news.py` (검색 + 시간 필터) |
| 인터랙티브 | 자연어 입력만 | **AskUserQuestion 2단** (정렬·시간) |
| 산출 | 마크다운 정리 | **HTML 뉴스레터** (모바일 반응형) |

뼈대는 같습니다. 키는 `.env`에, 결정론 호출은 Python으로, 자유도는 SKILL.md 본문에. 새로 들어오는 인터랙티브와 HTML도 같은 분리 원칙을 따라요 — 질문받는 단계는 SKILL.md 본문(자유도), 받은 답으로 파라미터 만드는 부분은 `fetch_news.py`(결정론).

### AskUserQuestion 2단 — 정렬과 시간 범위

뉴스 모음은 사람마다 원하는 결이 달라요. 속보만 좁게 볼 수도, 한 주 흐름을 볼 수도 있죠. 호출 시점에 두 가지를 묻습니다.

```text
Q1: 정렬 기준?
   - 최신순 (시간 우선)
   - 관련도순 (정확도 우선)

Q2: 시간 범위? (최신순 선택 시만)
   - 6시간 이내 (속보 위주)
   - 24시간 이내 (오늘)
   - 48시간 이내 (이틀)
```

답변에 따라 `fetch_news.py`에 넘기는 파라미터가 달라집니다. 자동 모드(무인 발행)에선 AskUserQuestion이 못 뜨니까 "최신순 + 24h" 고정값으로 떨어지게 분기를 둬요.

### HTML 뉴스레터 — 카테고리 그룹핑 + 모바일 반응형

검색 결과를 그냥 나열하면 그건 검색이지 정리가 아니에요. 같은 키워드에 묶인 기사를 **카테고리**로 그룹핑하고 인사이트 한 줄을 곁들여야 의미가 생깁니다.

```text
[뉴스레터 구조]
- 헤더: 키워드 + 발행일 + 통계 한 줄
- 카테고리 1: 공식 발표 / 보도자료
- 카테고리 2: 외부 매체 보도
- 카테고리 3: 커뮤니티 반응
- 푸터: 출처 링크
```

HTML은 모바일에서도 안 깨지게 단순 CSS로. "모바일 반응형, 가독성 우선"이라고만 명시하면 무난하게 떨어집니다.

### 사전 준비 — 네이버 개발자센터 키 발급

키 발급은 5분이면 끝나요.

```text
1. https://developers.naver.com 접속 → 로그인
2. "Application" → "애플리케이션 등록"
3. 사용 API: "검색"
4. 비로그인 오픈 API: "WEB 설정"
5. URL: http://localhost
6. 등록 → Client ID + Client Secret 복사
```

받은 두 값을 `.env`에 한 줄씩 보관합니다. Clip 2와 같은 위치예요.

```text
~/Desktop/bptc-cc/.env
─────────────────────
TOURAPI_SERVICE_KEY=...        ← Clip 2에서 등록한 것
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
```

---

## 🚶 진행 흐름

### 1. 작업 폴더 준비 + 네이버 키 발급

```bash
cd ~/Desktop/bptc-cc
claude
```

```text
~/Desktop/bptc-cc/50-my-work/Part07-데이터베이스/실습03-검색API/newsletter/ 폴더와
~/Desktop/bptc-cc/.claude/skills/naver-news/scripts/ 폴더를 만들어 주세요.
```

여기서 위 "사전 준비"대로 네이버 키를 발급해 `.env`에 등록한 뒤 STEP 1로.

### 2. STEP 1 — 워크플로우 잡기

```text
네이버 검색 API로 키워드 뉴스 모아서 뉴스레터 만들려는데,
어떻게 워크플로우를 구성해야 할까?
```

정리되는 단계는 보통 이래요.

```text
1. 키워드 + 정렬 + 시간 범위 입력 받기
2. 네이버 검색 API 호출 (뉴스)
3. 결과 클린업 (HTML 태그 제거, 중복 제거)
4. 시간 범위 필터 (지정 시간 이내만)
5. 카테고리 그룹핑 (공식/외부/커뮤니티)
6. HTML 뉴스레터 한 장 생성
7. 결과물 저장 (newsletter/{날짜}-{키워드}.html)
```

### 3. STEP 2 — 분리 정의 + 인터랙티브 위치

이번엔 분리 안에 AskUserQuestion 위치를 명시합니다.

```text
정리된 단계 좋은데 분리 안 보완하자.

[fetch_news.py — 결정론]
- 네이버 API 호출
- HTML 태그 제거 (<b>, &quot; 같은 entity)
- 6h/24h/48h 시간 범위 필터링

[SKILL.md 본문 — 자유도]
- AskUserQuestion으로 정렬·시간 질문 (2단)
- 카테고리 그룹핑 판단
- 인사이트 한 줄 정리

자동 모드 분기:
- AskUserQuestion 응답이 없으면 → 정렬=최신순, 시간=24h 고정
```

### 4. STEP 3 — 스킬화 + fetch_news.py 작성

```text
지금 정의한 분리 안대로 naver-news 스킬을 만들어줘.

위치:
- ~/Desktop/bptc-cc/.claude/skills/naver-news/SKILL.md
- ~/Desktop/bptc-cc/.claude/skills/naver-news/scripts/fetch_news.py

SKILL.md description: "네이버 뉴스·뉴스레터·키워드 모니터링·트렌드 정리" 키워드

fetch_news.py 요건:
- 네이버 검색 API 호출 (https://openapi.naver.com/v1/search/news.json)
- 헤더: X-Naver-Client-Id, X-Naver-Client-Secret (.env에서 읽기)
- 파라미터: query, sort (date/sim), display (50)
- 응답 클린업: <b> 태그 제거, &quot; 같은 entity 디코드
- 시간 범위 필터링: pubDate 기준 6h/24h/48h
- JSON 형태로 결과 반환

SKILL.md 본문 요건:
- AskUserQuestion 2단 (정렬 → 시간, 관련도면 시간 질문 생략)
- 무인 모드 분기 (응답 없으면 최신순 + 24h)
- 카테고리 그룹핑 (공식 보도자료 / 외부 매체 / 커뮤니티)
- HTML 뉴스레터 생성 (모바일 반응형, 가독성 우선)
- 결과물: ~/Desktop/bptc-cc/50-my-work/Part07-데이터베이스/실습03-검색API/newsletter/{YYYYMMDD}-{키워드}.html
```

### 5. STEP 4 — 호출 테스트 + AskUserQuestion 2단

재시작 후 자연어로 호출합니다.

```bash
exit
claude
```

```text
클로드코드 뉴스레터 만들어줘
```

description이 매칭되면 첫 질문이 떠요.

```text
Q1. 정렬 기준?  1) 최신순  2) 관련도순
```

답하면 두 번째 질문(최신순일 때만).

```text
Q2. 시간 범위?  1) 6시간  2) 24시간  3) 48시간
```

답하면 스크립트가 굴러가면서 `newsletter/{YYYYMMDD}-클로드코드.html`이 떨어집니다. 브라우저에서 열어 카테고리 헤더·모바일 가독성·인사이트가 다 들어갔는지 보세요.

```bash
open ~/Desktop/bptc-cc/50-my-work/Part07-데이터베이스/실습03-검색API/newsletter/{YYYYMMDD}-클로드코드.html
```

### 6. STEP 5 — 본인 키워드로 응용

클로드코드는 시연용이에요. 본인 일에 가져갈 키워드로 한 번 더 호출해보세요.

```text
[마케팅] 브랜드명 또는 경쟁사명
[PO]    제품 카테고리 + "트렌드"
[영업]   고객사명 또는 업계 키워드
[학습]   관심 분야 + "최신"
```

키워드만 바꾸면 됩니다. 매번 새로 만들 필요가 없어요.

---

## 📦 결과물

| 결과물 | 위치 | 설명 |
|---|---|---|
| `SKILL.md` | `.claude/skills/naver-news/SKILL.md` | 스킬 본문 (AskUserQuestion + 자동 분기) |
| `fetch_news.py` | `.claude/skills/naver-news/scripts/fetch_news.py` | 네이버 API + 시간 필터 |
| `.env` 두 줄 | `~/Desktop/bptc-cc/.env` | `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` |
| `{YYYYMMDD}-{키워드}.html` | `실습03-검색API/newsletter/` | HTML 뉴스레터 |

공공 API에 이어 검색 API까지 손에 잡히면, 데이터를 받아오는 두 갈래를 다 가진 거예요.

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| 네이버 키 발급 안 됨 | 사용 API 설정 누락 | "검색" 체크 + WEB 설정 + URL `http://localhost` |
| 호출이 401 | Client ID/Secret 헤더 오타 | `X-Naver-Client-Id`, `X-Naver-Client-Secret` (대소문자 정확히) |
| 응답에 `<b>` 태그가 박혀 옴 | 클린업 누락 | `fetch_news.py`에서 `re.sub(r'<.*?>', '', text)` |
| `&quot;` 같은 entity가 그대로 | HTML 디코드 누락 | `html.unescape(text)` |
| 시간 필터가 안 먹음 | pubDate 파싱 실패 | 네이버 pubDate는 RFC 822. `email.utils.parsedate_to_datetime` 사용 |
| AskUserQuestion이 안 뜸 | 본문에 호출 명시 누락 | SKILL.md 본문 시작 부분에 AskUserQuestion 호출 명시 |
| 무인 모드에서 멈춤 | 응답 대기 | `if interactive: ask else: default(최신순, 24h)` 분기 추가 |
| 카테고리 그룹핑이 엉성 | 분류 기준 모호 | "`.go.kr`/`.or.kr` → 공식 / 그 외 → 외부 / 커뮤니티 도메인 → 커뮤니티"로 명시 |

---

## 🔗 다음 클립

공공 API(Clip 2)와 검색 API(Clip 3)로 데이터를 받아오는 법을 익혔고, Clip 1에서 DB를 만들었어요. 마지막 클립에서 이 둘을 합칩니다. **API로 받아온 데이터를 진짜 데이터베이스에 적재**해서 "API + DB" 한 덩어리로 굴려봅니다.

→ **[Part 7 / Clip 4: 공공 API → 데이터베이스 — 받아온 데이터로 DB 채우기](#part-7-04-api-to-db)**
