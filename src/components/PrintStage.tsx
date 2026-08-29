import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { Mode, Step } from '@/data/guides'

interface Ripple {
  key: number
  x: number
  y: number
}

interface PrintStageProps {
  step: Step
  mode: Mode
  /** ids dos alvos já acertados neste passo */
  hitIds: ReadonlySet<string>
  /** em Prática, mostra os alvos após "Revelar" */
  revealed: boolean
  /** passo recém-concluído → brilho de sucesso */
  success: boolean
  onTargetHit: (id: string) => void
  onMiss: () => void
}

/**
 * O palco: print do sistema + camada de hotspots em coordenadas percentuais.
 * Guia: alvos visíveis pulsando. Prática: alvos invisíveis; erro gera ripple
 * vermelho + tremida, acerto gera anel pop turquesa.
 */
export default function PrintStage({
  step,
  mode,
  hitIds,
  revealed,
  success,
  onTargetHit,
  onMiss,
}: PrintStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [shaking, setShaking] = useState(false)

  const showTargets = mode === 'guia' || revealed

  function handleMiss(e: MouseEvent<HTMLDivElement>) {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const key = Date.now()
    setRipples((r) => [...r.slice(-4), { key, x, y }])
    setShaking(true)
    window.setTimeout(() => setShaking(false), 500)
    window.setTimeout(() => setRipples((r) => r.filter((p) => p.key !== key)), 700)
    onMiss()
  }

  return (
    <div
      ref={stageRef}
      onClick={handleMiss}
      className={`relative overflow-hidden rounded-xl border border-edge bg-white select-none ${
        shaking ? 'anim-shake' : ''
      } ${success ? 'anim-success' : ''}`}
    >
      <img src={step.image} alt={step.title} className="block w-full" draggable={false} />

      {step.targets.map((t) => {
        const hit = hitIds.has(t.id)
        return (
          <button
            key={t.id}
            type="button"
            aria-label={mode === 'guia' ? `Clicar em ${t.label}` : 'Área da tela'}
            disabled={hit}
            onClick={(e) => {
              e.stopPropagation()
              if (!hit) onTargetHit(t.id)
            }}
            className={`absolute rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
              hit
                ? 'anim-hit border-[3px] border-teal bg-teal/15 shadow-[0_0_18px_rgba(94,234,212,0.6)]'
                : showTargets
                  ? 'anim-hotspot cursor-pointer border-[3px] border-teal bg-teal/5'
                  : 'cursor-default border-0 bg-transparent'
            }`}
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: `${t.w}%`,
              height: `${t.h}%`,
            }}
          >
            {hit && (
              <span className="absolute -top-2.5 -right-2.5 flex size-5 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-teal-deep">
                ✓
              </span>
            )}
          </button>
        )
      })}

      {ripples.map((r) => (
        <span
          key={r.key}
          aria-hidden="true"
          className="anim-miss pointer-events-none absolute size-14 rounded-full border-4 border-coral"
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
        />
      ))}
    </div>
  )
}
