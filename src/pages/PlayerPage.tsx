import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PrintStage from '@/components/PrintStage'
import { getGuide } from '@/data/guides'
import type { Mode } from '@/data/guides'

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function PlayerPage() {
  const { guideId, mode: modeParam } = useParams()
  const navigate = useNavigate()
  const guide = getGuide(guideId)
  const mode: Mode = modeParam === 'pratica' ? 'pratica' : 'guia'

  const [stepIndex, setStepIndex] = useState(0)
  const [hitIds, setHitIds] = useState<ReadonlySet<string>>(new Set())
  const [revealed, setRevealed] = useState(false)
  const [success, setSuccess] = useState(false)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [reveals, setReveals] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [finished, setFinished] = useState(false)

  const step = guide?.steps[stepIndex]
  const totalSteps = guide?.steps.length ?? 0
  const isLastStep = stepIndex === totalSteps - 1

  useEffect(() => {
    if (finished) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [finished])

  const accuracy = useMemo(() => {
    const total = hits + misses
    return total === 0 ? 100 : Math.round((hits / total) * 100)
  }, [hits, misses])

  if (!guide || !step) {
    return (
      <section className="mx-auto max-w-lg py-20 text-center">
        <h1 className="text-2xl font-bold">Guia não encontrado</h1>
        <Link to="/" className="mt-4 inline-block text-teal underline">
          Voltar aos treinos
        </Link>
      </section>
    )
  }

  function advance() {
    setSuccess(true)
    window.setTimeout(() => {
      setSuccess(false)
      setHitIds(new Set())
      setRevealed(false)
      if (isLastStep) {
        setFinished(true)
      } else {
        setStepIndex((i) => i + 1)
      }
    }, 750)
  }

  function handleTargetHit(id: string) {
    if (success) return
    setHits((h) => h + 1)
    const next = new Set(hitIds)
    next.add(id)
    setHitIds(next)
    if (next.size === step!.targets.length) advance()
  }

  function handleMiss() {
    if (success || mode === 'guia') return
    setMisses((m) => m + 1)
  }

  function handleReveal() {
    setRevealed(true)
    setReveals((r) => r + 1)
    setMisses((m) => m + 1)
  }

  // ---------------------------------------------------------------- resultado
  if (finished) {
    const otherMode: Mode = mode === 'guia' ? 'pratica' : 'guia'
    return (
      <section className="anim-rise mx-auto max-w-xl space-y-8 py-10 text-center">
        <div className="space-y-2">
          <p className="label-mono">treino concluído</p>
          <h1 className="text-3xl font-bold text-balance">{guide.title}</h1>
        </div>

        <div className="glass grid grid-cols-3 divide-x divide-edge py-6">
          <div>
            <p className="font-mono text-3xl font-bold text-teal tabular-nums">
              {mode === 'pratica' ? `${accuracy}%` : '✓'}
            </p>
            <p className="label-mono mt-1">{mode === 'pratica' ? 'precisão' : 'completo'}</p>
          </div>
          <div>
            <p className="font-mono text-3xl font-bold tabular-nums">{formatTime(seconds)}</p>
            <p className="label-mono mt-1">tempo</p>
          </div>
          <div>
            <p className="font-mono text-3xl font-bold text-coral tabular-nums">
              {mode === 'pratica' ? misses : totalSteps}
            </p>
            <p className="label-mono mt-1">{mode === 'pratica' ? 'erros' : 'passos'}</p>
          </div>
        </div>

        {mode === 'pratica' && reveals > 0 && (
          <p className="text-sm text-fog">
            Você usou “Revelar” {reveals}× — tente de novo sem revelar para fixar o caminho.
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              setStepIndex(0)
              setHitIds(new Set())
              setHits(0)
              setMisses(0)
              setReveals(0)
              setSeconds(0)
              setRevealed(false)
              setFinished(false)
            }}
            className="rounded-lg bg-teal px-6 py-3 font-bold text-teal-deep transition hover:brightness-110"
          >
            Repetir
          </button>
          <button
            type="button"
            onClick={() => navigate(`/treino/${guide.id}/${otherMode}`)}
            className="rounded-lg border border-edge px-6 py-3 font-semibold transition hover:border-teal/60 hover:text-teal"
          >
            {otherMode === 'pratica' ? 'Tentar no modo Prática' : 'Rever no modo Guia'}
          </button>
          <Link
            to="/"
            className="rounded-lg border border-edge px-6 py-3 font-semibold text-fog transition hover:text-snow"
          >
            Outros treinos
          </Link>
        </div>
      </section>
    )
  }

  // ---------------------------------------------------------------- player
  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link to="/" className="label-mono transition hover:text-teal">
          ← treinos
        </Link>
        <h1 className="text-lg font-semibold">{guide.title}</h1>
        <span
          className={`rounded-full px-3 py-0.5 font-mono text-xs font-bold uppercase ${
            mode === 'guia' ? 'bg-teal text-teal-deep' : 'border border-teal text-teal'
          }`}
        >
          {mode === 'guia' ? 'Guia' : 'Prática'}
        </span>
        <div className="ml-auto flex items-center gap-5">
          {mode === 'pratica' && (
            <span className="label-mono">
              erros <span className="text-coral">{misses}</span>
            </span>
          )}
          <span className="label-mono tabular-nums">{formatTime(seconds)}</span>
          <span
            className="flex gap-1.5"
            role="progressbar"
            aria-valuenow={stepIndex + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Passo ${stepIndex + 1} de ${totalSteps}`}
          >
            {guide.steps.map((s, i) => (
              <i
                key={s.title}
                className={`size-2 rounded-full ${
                  i < stepIndex ? 'bg-teal' : i === stepIndex ? 'bg-snow' : 'bg-edge'
                }`}
              />
            ))}
          </span>
        </div>
      </header>

      <PrintStage
        key={`${stepIndex}-${mode}`}
        step={step}
        mode={mode}
        hitIds={hitIds}
        revealed={revealed}
        success={success}
        onTargetHit={handleTargetHit}
        onMiss={handleMiss}
      />

      <footer className="flex flex-wrap items-stretch gap-3">
        <div className="glass flex min-h-12 flex-1 items-center gap-3 px-5 py-3">
          <span aria-hidden="true">💡</span>
          <p className="text-sm">
            <span className="label-mono mr-3">
              passo {stepIndex + 1}/{totalSteps}
            </span>
            {step.hint}
            {step.targets.length > 1 && (
              <span className="ml-2 text-teal">
                ({hitIds.size}/{step.targets.length} cliques)
              </span>
            )}
          </p>
        </div>
        {mode === 'pratica' && !revealed && (
          <button
            type="button"
            onClick={handleReveal}
            className="rounded-xl border border-edge px-5 text-sm font-semibold text-fog transition hover:border-coral/60 hover:text-coral"
            title="Mostra onde clicar (conta como erro)"
          >
            Revelar
          </button>
        )}
      </footer>
    </div>
  )
}
