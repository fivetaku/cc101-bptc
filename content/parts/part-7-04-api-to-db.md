---
course_clip_ref: "Part 7 / Clip 4"
result_path: "50-my-work/Part07-데이터베이스/실습04-API데이터-DB/"
next_clip_id: "part-8-01-llm-vectordb-rag"
---

# Part 7 / Clip 4: 공공 API → 데이터베이스 — 받아온 데이터로 DB 채우기

> 세션: Part 7 / Clip 4 (~25분)
> 만드는 것: 공공 API 데이터 → 수파베이스 테이블 적재 + 간단 조회

---

## 🎯 이 클립에서 만드는 것

Part 7의 마지막이자 핵심입니다. 지금까지 세 조각을 따로 만들었어요.

- Clip 1 — 데이터베이스를 만드는 법 (테이블·PK·FK·스키마·수파베이스)
- Clip 2 — 공공 API에서 데이터 받아오는 법 (TourAPI)
- Clip 3 — 검색 API에서 데이터 받아오는 법 (네이버)

이번 클립에서 이 셋을 **한 줄기로 잇습니다.** API로 받아온 데이터를 파일로만 남기지 않고, 진짜 데이터베이스 테이블에 적재해요. 그러면 "한 번 받아서 한 번 쓰고 버리는 데이터"가 "쌓이고 검색되고 앱이 읽는 데이터"로 바뀝니다.

5회차 오후에 했던 간이 해커톤이 바로 이 구조였어요 — **공공 API + DB를 합친 작은 결과물**. 이번 클립으로 그 뼈대를 손에 쥐는 게 목표입니다.

| Before (Clip 2~3) | After (Clip 4) |
|---|---|
| API 결과가 `.md`·`.html` 파일 한 장 | API 결과가 DB 테이블 행으로 누적 |
| 매번 새로 받아야 함 | 한 번 받으면 쌓여서 다시 조회·필터·집계 |
| 사람이 파일 열어 봄 | 앱·웹·AI가 DB를 직접 질의 |

---

## 💡 핵심 개념

### 적재 파이프라인 — 받아서 → 다듬어서 → 넣는다

API 데이터를 DB에 넣는 흐름은 늘 세 토막이에요. 영어로 ETL(Extract·Transform·Load)이라 부르는데, 용어는 몰라도 됩니다. 흐름만 잡으세요.

```text
[Extract] API 호출로 원본 데이터 받기   (Clip 2~3에서 한 그것)
   ↓
[Transform] 필요한 필드만 골라 정리      (JSON → 표 모양으로)
   ↓
[Load] DB 테이블에 행으로 넣기           (INSERT)
```

Clip 2~3에서 이미 Extract는 했어요. 이번엔 Transform과 Load를 붙입니다. 그리고 이 세 단계 모두 "결정론"이라 `scripts/`로 빼는 게 맞아요 — 같은 API 응답이면 같은 행이 들어가야 하니까요.

### API 응답 → 테이블 설계

받아온 JSON을 그대로 DB에 넣지 않아요. **무엇을 저장할지** 먼저 정합니다. TourAPI 관광지 응답을 예로 들면:

```text
[API 응답에서 고를 필드]          [테이블 컬럼 + 타입]
title (관광지명)           →      name      TEXT
addr1 (주소)               →      address   TEXT
mapx, mapy (좌표)          →      lng, lat  DOUBLE
contentid (고유 ID)        →      content_id TEXT (PK)
```

핵심은 **고유 ID를 PK로 잡는 것.** API가 주는 `contentid` 같은 고유값을 PK로 쓰면, 같은 데이터를 두 번 받아도 중복으로 쌓이지 않아요(이걸 upsert라고 합니다). Clip 1에서 잡은 PK 개념이 여기서 바로 쓰여요.

### 넣는 방법 두 가지 — MCP vs 스크립트

수파베이스에 행을 넣는 길은 두 갈래예요. 상황에 맞게 고르면 됩니다.

| 방법 | 어떻게 | 언제 |
|---|---|---|
| **수파베이스 MCP** | 클로드코드가 커넥터로 직접 INSERT | 가볍게, 적은 양, 대화로 |
| **Python 스크립트** | `scripts/load_to_db.py`가 적재 | 양이 많거나, 반복·자동화할 때 |

처음엔 MCP로 "이 데이터 테이블에 넣어줘" 한 줄이 가장 쉬워요. 매일 자동으로 쌓고 싶어지면 그때 스크립트로 빼면 됩니다.

### upsert — 중복 없이 갱신하기

같은 API를 매일 호출하면 같은 관광지가 또 옵니다. 그냥 INSERT하면 똑같은 행이 두 번 쌓여요. PK(`content_id`)를 기준으로 **있으면 갱신, 없으면 추가**하는 게 upsert입니다.

```sql
INSERT INTO 관광지 (content_id, name, address, lng, lat)
VALUES (...)
ON CONFLICT (content_id) DO UPDATE
SET name = EXCLUDED.name, address = EXCLUDED.address;
```

SQL을 외울 필요는 없어요. "content_id 기준으로 upsert 해줘"라고 말하면 클로드코드가 이 문장을 만들어줍니다.

---

## 🚶 진행 흐름

### 1. 작업 폴더 + 적재 대상 테이블 만들기 — 4분

```bash
cd ~/Desktop/bptc-cc
claude
```

```text
~/Desktop/bptc-cc/50-my-work/Part07-데이터베이스/실습04-API데이터-DB/ 폴더를 만들어 주세요.
그리고 수파베이스에 관광지 데이터를 담을 테이블을 만들 거예요.
컬럼은 content_id(PK), name, address, lng, lat, area, updated_at로 잡아줘.
수파베이스에 실제 테이블로 생성해줘.
```

커넥터 연결이 없다면 스키마(SQL)를 받아 수파베이스 SQL Editor에 붙여 Run 하세요. (Clip 1과 같은 방식)

### 2. API 데이터 받아오기 — 4분

Clip 2에서 만든 `trip-advisor` / `tour_api.py`를 그대로 씁니다. 부산 관광지를 받아와요.

```text
tour_api.py로 부산 관광지 데이터를 받아와줘.
받은 결과(JSON)를 실습04 폴더에 busan_raw.json으로 저장해줘.
```

### 3. Transform — 필요한 필드만 정리 — 4분

받은 JSON에서 테이블 컬럼에 맞는 필드만 골라냅니다.

```text
busan_raw.json에서 테이블 컬럼(content_id, name, address, lng, lat, area)에
맞는 필드만 골라서 정리해줘. area는 "부산"으로 채우고, 빈 값은 null로.
```

### 4. Load — DB에 적재 — 5분

정리된 데이터를 테이블에 넣습니다. 수파베이스 MCP가 연결돼 있으면 한 줄이에요.

```text
정리된 부산 관광지 데이터를 수파베이스 관광지 테이블에 넣어줘.
content_id 기준으로 upsert 해서 중복이 안 쌓이게 해줘.
```

양이 많거나 매일 돌리고 싶으면 스크립트로 빼세요.

```text
이 적재 과정을 scripts/load_to_db.py로 빼줘.
busan_raw.json을 읽어서 정리 → 수파베이스 관광지 테이블에 upsert 하는 스크립트로.
```

### 5. 확인 — DB에 질의해보기 — 4분

넣었으면 꺼내 봐야죠. 수파베이스 콘솔 Table Editor에서 행이 쌓였는지 보고, 간단한 조회도 시켜봅니다.

```text
수파베이스 관광지 테이블에서 부산 관광지가 몇 개 들어갔는지,
그리고 주소에 "해운대"가 들어간 곳만 뽑아서 보여줘.
```

엑셀이었으면 필터를 걸었을 일을, 이제 DB에 질의해서 받는 거예요. 데이터가 쌓이고 검색되는 감각을 여기서 확인하세요.

### 6. (응용) API + DB 합치기 — 간이 해커톤 맛보기 — 4분

5회차 오후의 간이 해커톤이 바로 이 조합이었어요. 받아온 데이터를 DB에 쌓고, 그 DB로 작은 결과물을 만드는 거예요. 한 가지만 골라 끝까지 가보세요.

```text
[아이디어 예시]
- 검색 API(naver-news)로 매일 키워드 뉴스를 받아 news 테이블에 누적 → 주간 트렌드 집계
- 공공 API로 우리 지역 미세먼지를 매일 받아 air 테이블에 쌓기 → 추세 그래프
- TourAPI 축제 데이터를 festival 테이블에 적재 → 월별 일정 페이지
```

"API에서 받아서 → DB에 쌓고 → 꺼내 쓴다" 이 한 줄기만 손에 잡히면, 주제는 본인 업무로 얼마든지 바꿀 수 있어요.

---

## 📦 결과물

- 수파베이스 적재용 테이블 1개 (`관광지` 등, PK 포함)
- API 원본 데이터 (`busan_raw.json`)
- (선택) `scripts/load_to_db.py` — 정리 + upsert 적재 스크립트
- DB에 실제 적재된 행들 + 조회 결과 1건
- `실습04-API데이터-DB/README.md` — 파이프라인(Extract→Transform→Load) 정리

API 데이터가 파일을 넘어 **DB 행으로 쌓이고 다시 조회**되면 이번 Part 완성입니다.

---

## 🆘 자주 막히는 포인트

| 증상 | 원인 | 해결 |
|---|---|---|
| 같은 데이터가 두 번 쌓임 | 그냥 INSERT 함 | PK(`content_id`) 기준 upsert로 바꾸기 (`ON CONFLICT`) |
| 적재 시 타입 에러 | API 값과 컬럼 타입 불일치 | 좌표는 숫자(DOUBLE), ID·이름은 TEXT. Transform 단계에서 형 변환 |
| 빈 값에서 에러 | API 응답에 누락 필드 | 빈 값은 `null`로 채우게 Transform에 명시 |
| MCP로 넣을 때 권한 오류 | 커넥터 미연결/읽기 전용 | 커넥터 연결 확인. 안 되면 SQL Editor로 직접 INSERT |
| 좌표가 0으로 들어감 | mapx/mapy 빈 응답 | 좌표 없는 항목은 건너뛰거나 null 처리 |
| 행이 안 보임 | 다른 프로젝트/테이블 봄 | 콘솔에서 프로젝트·테이블명·스키마(public) 확인 |
| 매일 자동 적재가 멈춤 | 루틴이 로컬 `.env` 못 읽음 | 클라우드 환경변수로 API 키 별도 등록 |

---

## 🔗 다음 클립

여기까지가 Part 7입니다. 5회차 워크샵의 핵심 — **데이터베이스 기초부터, 공공·검색 API로 데이터 받아오기, 그리고 받아온 데이터로 DB 채우기**까지 한 줄기로 이어봤어요. 손에 남은 건 작은 파이프라인 하나예요. **받아서 → 쌓고 → 꺼내 쓴다.** 영역이 여행이든 뉴스든 미세먼지든, 본인 업무 데이터로 그대로 바꿔 끼우면 됩니다.

→ **[Part 8 / Clip 1: LLM·벡터DB·RAG 개념](#part-8-01-llm-vectordb-rag)** — 다음 Part(6회차)에서는 이렇게 쌓은 데이터를 AI가 직접 읽고 답하게 만드는 **RAG**로 넘어갑니다.
