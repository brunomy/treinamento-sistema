import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { Mode, Step } from '@/data/guides'
import { PRINT_ASPECT } from '@/data/guides'

interface MissMark {
  key: number
  x: number
  y: number
}

interface PrintStageProps {
  step: Step
  mode: Mode
  /** ids dos alvos já acertados neste passo */
  hitIds: ReadonlySet<string>
  /** em Prática, mostra os alvos após "Revelar" (ou 3 erros no passo) */
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
 *
 * Pensado para toque (tablet): cada alvo tem uma área de acerto expandida
 * (~12px além do anel visível) via ::before, sem alterar o visual.
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
  // Marcadores de erro ficam na tela até o fim do passo (o `key` no pai
  // remonta o palco a cada passo, limpando-os).
  const [missMarks, setMissMarks] = useState<MissMark[]>([])
  const [shaking, setShaking] = useState(false)

  const showTargets = mode === 'guia' || revealed

  function handleMiss(e: MouseEvent<HTMLDivElement>) {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMissMarks((m) => [...m.slice(-29), { key: Date.now(), x, y }])
    setShaking(true)
    window.setTimeout(() => setShaking(false), 500)
    onMiss()
  }

  return (
    <div
      ref={stageRef}
      onClick={handleMiss}
      className={`relative w-full overflow-hidden rounded-xl border border-edge bg-white select-none ${
        shaking ? 'anim-shake' : ''
      } ${success ? 'anim-success' : ''}`}
      style={{ aspectRatio: `${PRINT_ASPECT}` }}
    >
      <img
        src={step.image}
        alt={step.title}
        className="absolute inset-0 h-full w-full"
        draggable={false}
      />

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
            className={`absolute rounded-lg before:absolute before:-inset-3 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
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

      {missMarks.map((m) => (
        <span
          key={m.key}
          aria-hidden="true"
          className="pointer-events-none absolute size-7 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        >
          {/* onda de expansão one-shot */}
          <span className="anim-miss absolute inset-0 rounded-full border-2 border-coral" />
          {/* marcador permanente, centrado no ponto do toque */}
          <span className="anim-hit flex size-full items-center justify-center rounded-full border-2 border-coral bg-coral/20 text-xs font-bold text-coral shadow-[0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-[1px]">
            ✕
          </span>
        </span>
      ))}
    </div>
  )
}
