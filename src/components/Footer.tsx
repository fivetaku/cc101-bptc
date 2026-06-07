'use client'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <div className="font-mono text-xl font-bold text-zinc-900 dark:text-white">
            <span className="text-brand-500 dark:text-brand-400">▸</span> CC101
          </div>

          {/* Description */}
          <p className="max-w-md text-sm text-zinc-500">
            BPTC 클로드코드 워크샵 참가자를 위한 한국어 활용 가이드입니다.
            워크샵에서 만든 결과물·습관을 사내에서 계속 키워가요.
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400 dark:text-zinc-500">
            <a
              href="https://docs.anthropic.com/ko/docs/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              공식 문서
            </a>
            <a
              href="https://cc101.axwith.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              cc101 (일반판)
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-zinc-300 dark:text-zinc-700">
            © {year} CC101 · BPTC 클로드코드 워크샵 활용 가이드
          </p>
        </div>
      </div>
    </footer>
  )
}
