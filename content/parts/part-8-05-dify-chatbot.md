---
course_clip_ref: "Part 8 / Clip 5"
result_path: "50-my-work/Part08-rag/실습05-dify챗봇/"
next_clip_id: "part-8-06-tuning-mydocs"
---

# Part 8 / Clip 5: Dify 챗봇 만들기

> 세션: Part 8 / Clip 5 (~25분)
> 만드는 것: 손질한 문서로 만든, 대화 화면이 있는 진짜 챗봇 (웹앱 URL까지)

---

## 🎯 이 클립에서 만드는 것

Clip 3에서 만든 바닥 RAG는 터미널에서 한 번 묻고 끝이었죠. 이번엔 **대화 화면이 있고, 앞 대화를 기억하고, 링크로 공유되는** 진짜 챗봇을 만듭니다. 도구는 **Dify**예요. 내 컴퓨터에 띄우는 오픈소스라, 우리 문서가 외부로 안 나가요.

제가 강조하고 싶은 건 이거예요. **바닥 RAG와 구조가 똑같습니다.** 부품만 최신으로 갈았어요. 임베딩·답은 그대로 Gemini, 창고만 Chroma에서 Weaviate로 바뀌고, 대화 화면·기억은 Dify가 공짜로 얹어줍니다.

| 단계 | 바닥 RAG (Clip 3) | Dify (이번 클립) |
|---|---|---|
| 임베딩 | Gemini `gemini-embedding-001` | Gemini `gemini-embedding-2` |
| 벡터DB(창고) | Chroma (내 폴더) | Weaviate (Dify 내장, 자동) |
| 답 LLM | Gemini `gemini-2.5-flash` | Gemini `gemini-3.5-flash` |
| 대화 화면·기억 | 없음 | **Dify가 내장으로 제공** |

---

## 💡 핵심 개념

### Docker = 내 컴퓨터에 서버를 한 번에 차려주는 도구

Dify는 웹 프로그램이라 돌리려면 "서버"가 필요해요. 그걸 직접 세팅하면 복잡한데, **Docker**가 필요한 부품을 통째로 한 번에 차려줍니다. 명령어 한 줄이면 내 컴퓨터 안에 작은 서버가 떠요. 이제부터 여러분은 남의 서버(ChatGPT)에 접속하는 게 아니라, **내 챗봇 서버의 주인**이 됩니다.

### Dify가 화면 뒤에서 해주는 일

우리가 클릭만 하면, Dify가 Clip 3의 6단계를 알아서 돌려줘요.

- **Knowledge(지식)** = 문서를 올려 청킹·임베딩·저장까지 자동 (①~③)
- **Chatbot 앱** = 질문 받아 검색하고 답 쓰기 (④~⑥)
- **Citation(출처)** = 어느 문서에서 가져왔는지 자동 표시

### 인덱싱 "High Quality"는 처음에 한 번만 고를 수 있어요

문서를 올릴 때 인덱싱 방식을 고르는데, **High Quality**(임베딩 기반, 의미 검색)를 선택하세요. 이건 나중에 못 바꿔요. 청킹은 **Parent-child**를 고르면 Clip 4에서 손질한 부모-자식 구조가 그대로 살아납니다.

---

## 🛠️ 시작 전 — 자료 셋업

준비물은 두 가지예요. Docker Desktop과, Clip 4에서 손질한 문서.

```bash
# Dify 받아서 내 컴퓨터에 띄우기 (한 번만)
git clone https://github.com/langgenius/dify.git
cd dify/docker
docker compose up -d
```

브라우저에서 첫 접속은 반드시 관리자 생성 주소로 들어갑니다.

```text
http://localhost/install
```

여기서 관리자 계정을 만들고, **Settings → Model Provider**에서 Gemini를 연결해요. Default Model에 챗 모델(`gemini-3.5-flash`)과 임베딩 모델(`gemini-embedding-2`)을 각각 지정합니다.

---

## 🚶 진행 흐름

### 1. 지식베이스 만들기 — 8분

상단 **Knowledge → Create Knowledge** → Clip 4에서 손질한 문서를 업로드합니다.

```text
청킹: Parent-child
인덱싱: High Quality   ← 나중에 못 바꿈, 지금 선택
```

업로드가 끝나면 **Test Retrieval(검색 테스트)**에 질문을 넣어 봐요.

```text
운임 분석한 팀 효과가 뭐였어?
```

관련 조각이 점수와 함께 뜨면, 검색이 제대로 되는 거예요. 챗봇을 만들기 전에 **검색부터 확인**하는 이 순서가 중요합니다.

### 2. 챗봇 앱 만들기 — 7분

상단 **Studio → Create App → Chatbot**으로 앱을 하나 만듭니다. 그다음 앱의 **Context**에서 방금 만든 지식베이스를 **Add**로 연결해요.

프롬프트(지시문)에는 거짓말을 막는 한 줄을 꼭 넣습니다.

```text
너는 우리 회사 문서 도우미야. 반드시 연결된 자료에 근거해서만 답하고, 자료에 없으면 "자료에 없습니다"라고 답해. 답할 때 어느 문서에서 가져왔는지 출처를 같이 알려줘.
```

### 3. 출처 켜고 미리보기 — 5분

**Add Features → Citation and Attribution**을 켭니다. 이걸 켜야 답에 출처가 표시돼요. 그다음 **Debug & Preview**에서 대화해 봅니다.

```text
운임 대시보드 만든 팀 효과 알려줘
→ (답) + 출처 표시 확인
그거 더 자세히 설명해줘
→ 앞 질문 맥락을 기억하고 이어 답하는지 확인
```

### 4. 게시 — 5분

오른쪽 위 **Publish**를 누르면 웹앱 URL이 생겨요. 그 링크로 들어가면 대화 화면이 떠요. 방금 여러분은 **내 문서로 답하는 챗봇**을 인터넷 화면으로 만든 거예요.

---

## 📦 결과물

저장 위치는 `50-my-work/Part08-rag/실습05-dify챗봇/`입니다.

- 내 컴퓨터에 뜬 Dify + Gemini 연결
- 손질한 문서로 만든 지식베이스 (High Quality)
- 출처가 표시되고 앞 대화를 기억하는 챗봇 + 웹앱 URL

웹앱 URL로 접속해 대화가 되면 이번 클립은 성공이에요.

---

## 🆘 자주 막히는 포인트

### `http://localhost`로 들어갔더니 에러가 나요

첫 접속은 반드시 `http://localhost/install`이에요. 관리자 계정부터 만들어야 합니다. 그냥 `localhost`로 들어가면 안 떠요.

### 모델 목록에 Gemini가 안 보여요

Settings → Model Provider에서 Gemini를 연결하고, 키를 넣었는지 확인하세요. 연결 직후 Default Model에 챗·임베딩을 각각 지정해야 지식베이스 만들 때 임베딩 모델이 잡힙니다.

### 검색 테스트에서 관련 없는 조각만 떠요

문서가 지저분하면 이래요. Clip 4로 돌아가 표·머리말을 손질하면 대부분 잡혀요. 청킹이 너무 크면 Parent-child로 다시 올려보세요.

### 답에 출처가 안 떠요

**Citation and Attribution** 토글을 켰는지 확인하세요. 이게 꺼져 있으면 답은 나와도 출처가 안 붙어요.

### 인덱싱을 잘못 골랐어요

High Quality는 나중에 못 바꿔요. 잘못 골랐으면 지식베이스를 지우고 다시 만드는 게 빠릅니다. 처음 올릴 때 High Quality + Parent-child를 꼭 확인하세요.

---

## 🔗 다음 클립

챗봇이 떴어요. 그런데 처음엔 답이 영 별로일 수 있어요. 마지막 클립에서는 답을 손보는 **개선 손잡이**들을 돌려보고, 마침내 **내 부서 실제 문서**로 "내 업무 챗봇"을 만듭니다.

→ **Part 8 / Clip 6: 개선·튜닝 + 내 부서 문서로 내 챗봇**
