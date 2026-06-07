---
course_clip_ref: "Part 7 / Clip 2"
result_path: "50-my-work/Part07-데이터베이스/실습02-공공API/"
next_clip_id: "part-7-03-search-api"
---

# Part 7 / Clip 2: 공공 API — 공공데이터포털에서 데이터 가져오기

> 세션: Part 7 / Clip 2 (~20분)
> 만드는 것: `trip-advisor` 스킬 + `scripts/tour_api.py` (결정론 스크립트)
> 시연 주제: 부산 2박3일 여행 정보

---

## 🎯 이 클립에서 만드는 것

DB의 뼈대는 잡았어요. 이제 그 안에 채울 **데이터**를 가져올 차례입니다. 가장 좋은 무료 데이터 창고가 **공공데이터포털**(data.go.kr)이에요. 한국 정부·공공기관이 무료로 푸는 API가 수천 개 있습니다.

이번 클립은 그중 **한국관광공사 TourAPI**로 부산 여행 정보를 가져옵니다. 만드는 건 `trip-advisor` 스킬 — "부산 여행 코스 짜줘" 한 마디로 관광지·축제·숙박을 모아 가이드 한 장을 만드는 도구예요. 데이터를 받아오는 감각을 여기서 잡고, 다음 클립에서 검색 API로, 그다음 클립에서 그 데이터를 DB에 적재합니다.

이번 클립에서 두 가지 새 패턴을 같이 익혀요.

- **외부 API 키 관리** — `.env` 파일에 키 한 줄. 깃에 올라가지 않게 `.gitignore`로 보호.
- **스크립트 분리 패턴** — SKILL.md 본문(AI가 해석)과 결정론 단계(API 호출·JSON 파싱)를 분리. 결정론은 `scripts/tour_api.py`로 빼서 같은 입력에 같은 결과가 나오게 합니다.

진행은 다섯 단계예요. TourAPI 활용신청 → 워크플로우 잡기 → 단계 분리(AI vs 결정론) → 스킬화 + 스크립트 작성 → 부산 여행으로 호출 테스트.

---

## 💡 핵심 개념

### 스크립트 분리 패턴 — AI에 맡길 단계 vs 코드로 뺄 단계

SKILL.md 본문은 클로드코드가 매번 해석합니다. 단어 선택, 출력 형식이 매번 미세하게 달라져요. 자유도가 필요한 곳엔 좋지만, **API 호출이나 JSON 파싱처럼 답이 정해진 단계**까지 AI에 맡기면 결과가 흔들립니다.

```text
[AI에게 맡길 단계 — SKILL.md 본문]
- 어떤 관광지를 고를지 판단
- 일정 순서 배치
- 한국어 가이드 톤으로 정리

[코드로 빼야 할 단계 — scripts/tour_api.py]
- TourAPI 엔드포인트 호출 (HTTP GET)
- 응답 JSON 파싱
- 필드명 매핑 + 빈 값 처리
```

같은 입력 → 같은 결과가 필요한 부분은 Python으로, 매번 다른 해석이 필요한 부분은 SKILL.md 본문으로. 이 구분은 이번 Part의 API 클립마다 반복돼요. 여기서 손에 익혀두면 다음 클립이 같은 패턴으로 따라옵니다.

### TourAPI 5 액션 — 한 스크립트가 다섯 가지 일을 함

`tour_api.py` 하나로 다섯 가지를 처리합니다.

| 액션 | 기능 | 예 |
|---|---|---|
| `keyword` | 키워드로 관광지 검색 | "부산 + 해운대" |
| `festival` | 축제 정보 | "2026년 5월 부산 축제" |
| `area` | 지역 코드로 관광지 묶음 | "부산 광역시 전체" |
| `stay` | 숙박 정보 | "부산 숙박업소 목록" |
| `detail` | 특정 항목 상세 | "해운대 해수욕장 상세" |

스크립트 하나에 다섯 함수를 다 넣어도 되고, 액션별 파일로 나눠도 돼요. 클로드코드한테 "5 액션을 하나의 `tour_api.py`에 담아줘"라고 명시하면 됩니다.

### API 키는 `.env`에 — 절대 코드에 박지 마세요

TourAPI 키처럼 비밀번호 격인 값은 SKILL.md나 스크립트에 직접 박으면 위험해요. 깃에 올라가는 순간 노출됩니다. 작업 폴더 루트에 한 줄로 보관해요.

```text
~/Desktop/bptc-cc/.env
─────────────────────────
TOURAPI_SERVICE_KEY=발급받은_키_여기에
```

`.gitignore`에 `.env`를 등록해 두면 깃엔 안 올라갑니다. Python 스크립트는 `os.getenv("TOURAPI_SERVICE_KEY")`로 값을 읽어 써요.

### 사전 준비 — TourAPI 활용신청 10분 대기

TourAPI는 무료지만 키 발급에 약 10분 대기가 있어요. 클립 시작할 때 신청부터 넣어두고 다른 단계를 진행하는 게 효율적입니다.

```text
1. https://www.data.go.kr 접속 → 회원가입
2. "TourAPI" 검색 → "한국관광공사_국문관광정보" 활용신청
3. 활용 목적 한 줄 입력 (예: 학습용)
4. 신청 후 약 10분 대기 → 자동 승인
5. 마이페이지 → 인증키(Encoding) 복사
```

대기하는 동안 아래 핵심 개념을 읽거나 워크플로우를 먼저 잡으세요.

---

## 🚶 진행 흐름

### 1. 작업 폴더 준비 + TourAPI 신청

작업 폴더에서 시작합니다.

```bash
cd ~/Desktop/bptc-cc
claude
```

```text
~/Desktop/bptc-cc/50-my-work/Part07-데이터베이스/실습02-공공API/ 폴더와
~/Desktop/bptc-cc/.claude/skills/trip-advisor/scripts/ 폴더를 만들어 주세요.
```

여기서 위 "사전 준비"대로 TourAPI 활용신청부터 넣어두세요. 10분 대기 동안 STEP 1로 넘어갑니다.

### 2. STEP 1 — 워크플로우 잡기

의문문으로 시작하면 클로드코드가 단계를 정리해줘요.

```text
공공 API(TourAPI)로 여행 정보 가져와서 여행 가이드 만들려는데,
어떻게 워크플로우를 구성해야 할까?
```

보통 이런 모습으로 정리됩니다.

```text
1. 지역·기간·관심사 입력 받기
2. 관광지 검색 (TourAPI keyword)
3. 같은 기간 축제 조회 (festival)
4. 숙박 후보 조회 (stay)
5. 일정 1·2·3일차 배치
6. 한국어 가이드로 종합 + 출처 명시
```

### 3. STEP 2 — AI vs 결정론 분리

여기서 어느 단계를 코드로 빼고 어느 단계를 AI에 맡길지 명시합니다.

```text
정리된 단계 좋은데 두 가지 보완하자.

1) TourAPI 호출 단계(2~4)는 매번 같은 입력에 같은 결과가 필요해.
   Python 스크립트로 빼두자. scripts/tour_api.py에 5 액션 모두 담자.

2) 일정 배치·한국어 정리는 매번 조금 달라도 OK.
   SKILL.md 본문에 자연어로 둬도 충분.
```

### 4. STEP 3 — 스킬화 + 스크립트 작성

이제 스킬과 스크립트를 함께 만들어달라고 요청합니다.

```text
지금 정의한 분리 안대로 trip-advisor 스킬을 만들어줘.

위치:
- ~/Desktop/bptc-cc/.claude/skills/trip-advisor/SKILL.md
- ~/Desktop/bptc-cc/.claude/skills/trip-advisor/scripts/tour_api.py

SKILL.md description: "여행 가이드·여행 코스·관광지 추천·축제·숙박" 키워드 포함

tour_api.py 요건:
- 5 액션 함수 (keyword/festival/area/stay/detail)
- API 키는 os.getenv("TOURAPI_SERVICE_KEY")로 .env에서 읽기
- http:// 프로토콜 사용 (TourAPI 공식 스펙)
- 응답에 &_type=json 붙여 JSON으로 받기
- JSON 파싱 + 빈 값 처리
- argparse로 액션별 CLI 호출 가능하게

결과물 저장 위치:
~/Desktop/bptc-cc/50-my-work/Part07-데이터베이스/실습02-공공API/{지역}-여행정보-{날짜}.md
```

생성 후 `.env`에 TourAPI 키를 등록하세요. 메일로 받은 인증키를 한 줄로.

```text
~/Desktop/bptc-cc/.env
─────────────────────
TOURAPI_SERVICE_KEY=받은_인증키_여기에
```

### 5. STEP 4 — 부산 여행으로 호출 테스트

새 스킬을 인식시키려고 재시작합니다.

```bash
exit
claude
```

```text
부산 여행 정보 모아줘. 2박 3일 일정으로.
```

description이 매칭되면 `trip-advisor`가 발동돼요. `tour_api.py`가 관광지·축제·숙박을 받아오고, 결과 파일이 떨어집니다. 안티그래비티(또는 에디터)에서 열어 관광지 목록·축제·숙박·일정이 한 장에 정리됐는지 보세요.

### 6. STEP 5 — 본인 업계 공공 API로 응용

공공데이터포털에는 같은 패턴으로 쓸 API가 많아요.

| 업계 | 활용 가능한 공공 API |
|---|---|
| 부동산 | 실거래가 공개 시스템 |
| 환경 | 미세먼지·대기질 측정 |
| 금융 | 환율·주가 (한국은행 ECOS) |
| 교통 | 버스·지하철 도착 정보 |
| 의료 | 병원·약국 위치 |

본인 업계 API 하나를 골라 같은 분리 패턴으로 스킬을 만들어보세요. 이렇게 받아온 데이터가 Clip 4에서 DB로 들어갑니다.

---

## 📦 결과물

| 결과물 | 위치 | 설명 |
|---|---|---|
| `SKILL.md` | `.claude/skills/trip-advisor/SKILL.md` | 스킬 본문 (자유도 영역) |
| `tour_api.py` | `.claude/skills/trip-advisor/scripts/tour_api.py` | 5 액션 결정론 스크립트 |
| `.env` 한 줄 | `~/Desktop/bptc-cc/.env` | `TOURAPI_SERVICE_KEY` |
| `부산-여행정보-{날짜}.md` | `실습02-공공API/` | 첫 호출 결과 |

공공 API에서 진짜 데이터가 손에 잡히면 이번 클립 통과입니다.

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| 활용신청 후 자동 승인 안 됨 | 10분 이상 지연 | 정상. 길게는 30분까지. 승인 메일 기다리며 다른 단계 진행 |
| 인증키에 줄바꿈이 들어감 | 마이페이지 박스 줄바꿈 | `.env`에 붙일 때 한 줄로. 줄바꿈 제거 |
| 스크립트가 키를 못 읽음 | `.env` 위치/변수명 오타 | 루트 `~/Desktop/bptc-cc/.env`인지, 변수명 `TOURAPI_SERVICE_KEY` 정확한지 확인 |
| 호출이 403 | http와 https 혼동 | TourAPI는 `http://`. `https://` 쓰면 막힘 |
| 응답이 XML로 옴 | format 누락 | 요청에 `&_type=json` 추가 |
| 5 액션 중 일부만 동작 | 파라미터 누락 | 각 함수 docstring 확인. festival은 연월(ym) 필수 |
| Python requests 없음 | 모듈 미설치 | `pip3 install requests` |
| 스킬이 호출 안 됨 | 재시작 누락 | `exit` 후 `claude` |

---

## 🔗 다음 클립

공공 API로 데이터를 받아왔어요. 같은 분리 패턴(`scripts/`)을 한 번 더 굴려봅니다. 이번엔 **네이버 검색 API**로 관심 키워드 뉴스를 모아요. 호출 시점에 사용자에게 옵션을 묻는 인터랙티브 패턴도 추가됩니다.

→ **[Part 7 / Clip 3: 검색 API — 네이버 검색으로 키워드 데이터 모으기](#part-7-03-search-api)**
