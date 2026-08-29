import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PrintStage from '@/components/PrintStage'
import { apps, getGuide } from '@/data/guides'
import type { Mode, TrainingResult } from '@/data/guides'
import { PRINT_ASPECT } from '@/data/guides'
import { formatTime } from '@/lib/format'

export default function PlayerPage() {
  const { guideId, mode: modeParam } = useParams()
  const navigate = useNavigate()
  const guide = getGuide(guideId)
  const homePath = guide && guide.appId !== apps[0].id ? `/?app=${guide.appId}` : '/'
  const mode: Mode = modeParam === 'pratica' ? 'pratica' : 'guia'

  const [stepIndex, setStepIndex] = useState(0)
  const [hitIds, setHitIds] = useState<ReadonlySet<string>>(new Set())
  const [revealed, setRevealed] = useState(false)
  const [success, setSuccess] = useState(false)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [stepMisses, setStepMisses] = useState(0)
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

  // Ao concluir o último passo, volta direto à lista inicial levando o
  // resumo do treino — a Home o exibe como snackbar.
  useEffect(() => {
    if (!finished || !guide) return
    const result: TrainingResult = {
      guideTitle: guide.title,
      mode,
      seconds,
      steps: totalSteps,
      misses,
      accuracy,
      reveals,
    }
    navigate(homePath, { state: { result } })
  }, [finished, guide, mode, seconds, totalSteps, misses, accuracy, reveals, navigate, homePath])

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
      setStepMisses(0)
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
    // Após 3 erros no mesmo passo, revela automaticamente onde clicar.
    const nextStepMisses = stepMisses + 1
    setStepMisses(nextStepMisses)
    if (nextStepMisses >= 3) setRevealed(true)
  }

  function handleReveal() {
    setRevealed(true)
    setReveals((r) => r + 1)
    setMisses((m) => m + 1)
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link
          to={homePath}
          className="label-mono -mx-2 rounded-lg px-2 py-2 transition hover:text-teal active:bg-panel"
        >
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

      {/* Largura limitada para o print caber inteiro na tela do tablet
          (paisagem) sem rolagem: altura disponível × proporção do print. */}
      <div
        className="mx-auto w-full"
        style={{ maxWidth: `min(100%, calc((100dvh - 15rem) * ${PRINT_ASPECT}))` }}
      >
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
      </div>

      <footer className="flex flex-wrap items-stretch gap-3">
        <div className="glass flex min-h-14 flex-1 items-center gap-3 px-5 py-3">
          <span aria-hidden="true">💡</span>
          <p className="text-base">
            <span className="label-mono mr-3">
              passo {stepIndex + 1}/{totalSteps}
            </span>
            {step.hint}
            {step.targets.length > 1 && (
              <span className="ml-2 text-teal">
                ({hitIds.size}/{step.targets.length} cliques)
              </span>
            )}
            {mode === 'pratica' && revealed && (
              <span className="ml-2 text-coral">· alvo revelado</span>
            )}
          </p>
        </div>
        {mode === 'pratica' && !revealed && (
          <button
            type="button"
            onClick={handleReveal}
            className="min-h-14 rounded-xl border border-edge px-7 text-base font-semibold text-fog transition hover:border-coral/60 hover:text-coral active:scale-[0.97] active:border-coral/60 active:text-coral"
            title="Mostra onde clicar (conta como erro)"
          >
            Revelar
          </button>
        )}
      </footer>
    </div>
  )
}
