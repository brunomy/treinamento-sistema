import { useEffect, useState } from 'react'
import type { TrainingResult } from '@/data/guides'
import { formatTime } from '@/lib/format'

const AUTO_HIDE_MS = 7000

/** Snackbar com o resumo do treino, exibido ao voltar à lista inicial. */
export default function ResultSnackbar({ result }: { result: TrainingResult }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), AUTO_HIDE_MS)
    return () => window.clearTimeout(id)
  }, [result])

  if (!visible) return null

  return (
    <div
      role="status"
      className="anim-rise fixed bottom-6 left-1/2 z-50 flex w-[min(92vw,34rem)] -translate-x-1/2 items-center gap-4 rounded-xl border border-teal/40 bg-ink-2 px-5 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(94,234,212,0.15)]"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal font-bold text-teal-deep">
        ✓
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{result.guideTitle}</p>
        <p className="label-mono mt-0.5">
          {result.mode === 'pratica' ? (
            <>
              precisão <span className="text-teal">{result.accuracy}%</span> · erros{' '}
              <span className={result.misses > 0 ? 'text-coral' : 'text-teal'}>
                {result.misses}
              </span>{' '}
              · {formatTime(result.seconds)}
            </>
          ) : (
            <>
              {result.steps} passos · {formatTime(result.seconds)}
            </>
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Fechar"
        className="shrink-0 rounded p-1 text-fog transition hover:text-snow focus-visible:outline-2 focus-visible:outline-teal"
      >
        ✕
      </button>
    </div>
  )
}
