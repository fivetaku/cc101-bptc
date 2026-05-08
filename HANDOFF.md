# BPTC 사이트 핸드오프 문서

다음 클로드코드 세션이 이 사이트를 계속 업데이트하기 위한 인계 문서.
**이 문서는 항상 최신 상태로 유지하세요.** 변경할 때마다 끝의 "변경 이력"에 한 줄 추가.

---

## 1. 사이트 정보

| 항목 | 값 |
|---|---|
| 공개 URL | https://bptc.axwith.com |
| GitHub repo | https://github.com/fivetaku/cc101-bptc |
| 호스팅 | GitHub Pages (브랜치 `gh-pages`는 자동 생성, 소스는 `main`) |
| DNS | Cloudflare (CNAME, **proxied: false** — proxy 켜면 SSL 깨짐) |
| SSL | Let's Encrypt (GitHub Pages가 자동 발급) |
| 분석/추적 | 없음 (cc101-fc만 GA4 G-Q12V9W97QX) |
| 브랜드 색 | `#f97316` (orange-500) — `src/app/globals.css`의 `@theme` 블록 |
| 폰트 | Pretendard (Variable, Korean-first) |

자매 사이트 cc101-fc(https://cc101-fc.axwith.com)는 별도 repo. **Part 1~3까지는 두 사이트 동기화, Part 4부터 분리.**

---

## 2. 기술 스택

| 영역 | 도구 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 빌드 | `pnpm build` → `output: 'export'` (정적 SSG, `out/` 디렉토리) |
| 스타일 | Tailwind CSS v4 + `@theme` directive |
| 콘텐츠 | MDX via `next-mdx-remote/rsc` + `remark-gfm` |
| 패키지 매니저 | pnpm (lockfile 필수) |
| Node | 22.x (workflow에서 `actions/setup-node@v4`) |
| 배포 | GitHub Actions → `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4` |

워크플로 파일: `.github/workflows/deploy.yml`. main 푸시 시 자동 배포.

---

## 3. 프로젝트 구조

```
cc101-bptc/
├── content/
│   ├── sections.json           # ★ 모든 클립 메타 (id, title, order, file 경로 등)
│   ├── parts/                  # ★ 클립 본문 마크다운 (part-N-NN-slug.md)
│   └── reference/              # 보조 자료 (트러블슈팅 등)
├── src/
│   ├── app/
│   │   ├── page.tsx            # 메인 페이지 (모든 클립 렌더)
│   │   ├── layout.tsx          # 메타데이터 (metadataBase 포함)
│   │   ├── globals.css         # @theme로 브랜드 색 정의
│   │   ├── icon.tsx            # 파비콘 (ImageResponse)
│   │   └── opengraph-image.tsx # og:image
│   └── components/             # 사이드바, 헤더, MDX 렌더러 등
├── public/                     # CNAME, 이미지 정적 자산
├── HANDOFF.md                  # ← 이 문서
└── PRD/ (없음, fc 쪽에는 있음)
```

**중요**: `content/sections.json`과 `content/parts/*.md`는 **반드시 같이 갱신**. JSON에 entry 있는데 파일 없거나, 파일 있는데 JSON에 없으면 빌드 실패 또는 안 보임.

---

## 4. 콘텐츠 작성 규칙 (★ 톤이 일관되어야 합니다)

### 4-1. 5블록 구조 (필수)

모든 클립 본문은 다음 헤딩 순서를 지켜요:

```markdown
---
course_clip_ref: "Part N / Clip M"
result_path: "50-my-work/PartNN-단계명/실습NN-주제/"
next_clip_id: "part-N-MM-slug"   # 마지막 클립은 이 줄 생략
---

# Part N / Clip M: 제목

> 강의 영상: Part N / Clip M (~XX분)
> 만드는 것: 한 줄

---

## 🎯 이 클립에서 만드는 것
## 💡 핵심 개념
## 🛠️ 시작 전 — 자료 셋업
## 🚶 진행 흐름
## 📦 결과물
## 🆘 자주 막히는 포인트
## 🔗 다음 클립
```

### 4-2. 톤 가이드 (★ 위배 금지)

원본: `/Users/chulrolee/cc101-with-fc/PRD/05_TONE_GUIDE.md` (이동 후엔 경로 갱신 필요)

- **벌거벗은 세계사 톤** — 강사가 학생 옆에서 말하는 듯한 1인칭, 비유 위주
- **1인칭 ≥3회 (필수)** — `저는`, `여러분`, `제가`, `솔직히`, `사실` 중 합쳐서 3회 이상
- **어미 다양화** — `~잖아요?`, `~돼요`, `~네요`, `~거든요`
- **분량** — 600~1200 단어 (5-2/5-6 같은 핵심 클립은 1500까지 OK)

### 4-3. AI 클리셰 블록리스트 (★ 0회 필수)

다음 표현은 절대 쓰지 마세요. pumasi 게이트가 자동 차단합니다:

```
학습 리듬, 기준선을, 선을 그어, 체득, 체화, 방향성,
유의미한 차이, 효율적으로 활용, 최적의, 최적화된,
한 문장으로 설명할 수 있...
```

### 4-4. 명령 블록 패턴

학생에게 보여주는 명령은 ` ```text ` 블록 안에 한국어 자연어로 적습니다. 코드 명령은 ` ```bash `. 클로드코드에 던질 프롬프트는 ` ```text `.

---

## 5. 콘텐츠 갱신 절차

### 5-1. 새 클립 추가

1. `content/parts/part-N-MM-slug.md` 생성 (5블록 + frontmatter)
2. `content/sections.json`의 `sections` 배열에 entry 추가
   - `id`: 파일명과 동일
   - `tier`: `part-N`
   - `clip`, `order`: 다음 번호
   - `slug`, `title`, `subtitle`, `duration_min`, `icon` 채움
3. `tiers.part-N.count` 증가
4. `site.version` bump (patch 또는 minor)
5. `site.lastUpdated` = 오늘 날짜 (YYYY-MM-DD)
6. 이전 클립의 `next_clip_id`를 새 클립 id로 갱신
7. 로컬 빌드: `pnpm build` → 에러 없으면 OK
8. commit + push → Actions 자동 배포 (40~60초)

### 5-2. 클립 사이에 끼워넣기 (Part 5 / Clip 2 추가 사례)

큰 번호부터 mv (충돌 방지) + sed로 frontmatter + 본문의 clip 번호 + 실습 번호 + next_clip_id 일괄 갱신:

```bash
cd content/parts
mv part-5-08-X.md part-5-09-X.md
sed -i '' -e 's|Clip 8|Clip 9|g' -e 's|실습27|실습28|g' part-5-09-X.md
# ... 7~2까지 반복 (작은 번호일수록 next_clip_id도 같이 갱신)
```

그 다음 sections.json도 통째로 갱신 (clip + order + file 경로 + tier count).

### 5-3. 콘텐츠 수정만

본문 수정 → commit + push. sections.json은 안 건드림.

---

## 6. 알려진 함정 (★ 또 반복 금지)

| 함정 | 증상 | 해결 |
|---|---|---|
| Cloudflare proxy 켜져 있음 | bptc.axwith.com SSL 안 발급 | DNS에서 CNAME `proxied: false`로 |
| GitHub Pages https_enforced=true PUT 422 | API 요청 실패 | `gh api --input -`로 JSON body, `-F` 안 됨 |
| SSL 한참 안 발급 | Let's Encrypt 대기 | `gh api -X PUT pages -F cname=null` 한 번 → 다시 set (cname null 트릭) |
| `ImageResponse`로 만든 og:image localhost 노출 | 로컬 URL이 메타에 박힘 | `layout.tsx`에 `metadataBase: new URL('https://...')` 필수 |
| `icon.tsx` / `opengraph-image.tsx` SSG 에러 | "force-static" missing | 두 파일 모두 `export const dynamic = 'force-static'` 추가 |
| ▸ 같은 특수문자 ImageResponse에서 폰트 없음 | 빌드 실패 | 텍스트는 ASCII로 (예: "CC"), 도형은 CSS triangle (border 트릭) |
| pnpm-lock.yaml 미커밋 | Actions에서 `--frozen-lockfile` 실패 | lockfile 항상 커밋 |
| sed -i 형식 차이 | macOS는 `sed -i ''`, Linux는 `sed -i` | 작업 환경 macOS 가정 |

---

## 7. 진행 현황 (2026-05-08 기준)

### 작성 완료된 Part

| Part | 클립 수 | 주제 |
|---|---|---|
| Part 1. 인트로 | 3 | 오리엔테이션 / 강의 활용법 / cc101 & GPTaku 플러그인 |
| Part 2. 시작하기 | 4 | Mac/Windows 설치 / 첫 실행 / 모드+Alias |
| Part 3. 체험하기 | 10 | 대화 5단계 → 데이터 분석/보고서/대시보드/리서치/카드뉴스/영상/포트폴리오 기획·수정·Vercel 배포 |
| Part 4. 강화하기 | 6 | 플러그인 설치 / docs-guide(Vercel) / kkirikkiri / vibe-sunsang / show-me-the-prd / skillers-suda |
| Part 5. 에이전트 구축 | 9 | 워크스페이스 이론 / 바르다 깃선생 / workmate /onboarding / PARA / 메모리·자가성장 / 5 아키타입 / Workspace Builder ★ / Agent Council / 회고 |

총 **32 lecture clips + 4 reference**.

### 회차 일정 (BPTC 14명, 2일 워크샵 기준)

- **1회차 (2026-05-06)**: Part 1~4 진행. 사이트는 같이 보면서 클립별 1~2개씩 실습.
- **2회차 (2026-05-07)**: Part 5 진행. 학생들이 각자 본인 업무에 맞는 에이전트 워크스페이스 1개 완성.

### 미완료 / 대기 작업

- [ ] cc101-fc Part 4 (4 클립, 패캠 커리큘럼 v6.0 따라가기) — BPTC 무관, 별도 진행
- [ ] workmate에서 skill-builder 정리 (7개 위치, ~5분)
- [ ] 워크샵 종료 후 학생 결과물 갤러리 추가 검토
- [ ] 6회차(패캠 추가) 발표 자료

---

## 8. 변경 이력

| 날짜 | 버전 | 변경 |
|---|---|---|
| 2026-05-05 | 0.1.x | cc101-fc 분기 → cc101-bptc 신규 사이트 (Part 1~3 동기화) |
| 2026-05-06 | 0.2.0 | Part 4 (강화하기) 6 클립 신규. Clip 8 셋업+한 줄 시작 / Clip 9 getdesign.md 흐름 적용 |
| 2026-05-06 | 0.3.0 | Part 5 (에이전트 구축) 8 클립 신규 (workmate + Workspace Builder 라인) |
| 2026-05-07 | 0.4.0 | Part 5 / Clip 2 자리에 **바르다 깃선생** 추가 (총 9 클립). 기존 5-2~5-8 → 5-3~5-9 마이그레이션 |

---

## 9. 작업 시작 시 체크리스트 (다음 클로드코드용)

이 사이트에서 작업을 시작할 때:

1. `git pull origin main` — 최신 상태 확보
2. `pnpm install` — 의존성 동기화
3. `pnpm dev` 또는 `pnpm build` — 빌드 가능 상태인지 먼저 확인
4. `content/sections.json` 읽기 — 현재 클립 구조 파악
5. 변경 후: 빌드 통과 → commit → push → Actions 통과 (https://github.com/fivetaku/cc101-bptc/actions)

**가장 흔한 실수: sections.json과 parts/*.md 둘 중 하나만 갱신.** 항상 짝으로.
