import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ResultSnackbar from '@/components/ResultSnackbar'
import { guides } from '@/data/guides'
import type { TrainingResult } from '@/data/guides'

export default function HomePage() {
  const location = useLocation()
  // Resultado vindo do player via location.state: capturado na montagem
  // (o snackbar dura uma exibição) e removido do histórico para não
  // reaparecer em refresh/voltar.
  const [result] = useState<TrainingResult | null>(
    () => (location.state as { result?: TrainingResult } | null)?.result ?? null,
  )

  useEffect(() => {
    if (result) window.history.replaceState({}, '')
  }, [result])

  return (
    <div className="space-y-10">
      {result && <ResultSnackbar result={result} />}
      <section className="anim-rise space-y-3">
        <p className="label-mono">Treinamento · sistema de atendimento</p>
        <h1 className="text-4xl font-bold tracking-tight text-balance">
          O que você quer <span className="text-teal">treinar</span> hoje?
        </h1>
        <p className="max-w-2xl text-fog">
          Cada guia é um passo a passo sobre prints reais do sistema. No modo{' '}
          <strong className="text-snow">Guia</strong>, o ponto de clique aparece marcado na tela; no
          modo <strong className="text-snow">Prática</strong>, você recebe só a dica e precisa
          acertar onde clicar.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2" aria-label="Guias disponíveis">
        {guides.map((guide, i) => (
          <article
            key={guide.id}
            className="glass anim-rise flex flex-col gap-4 p-6 transition-colors hover:border-teal/40"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-semibold">{guide.title}</h2>
              <span className="label-mono shrink-0">{guide.steps.length} passos</span>
            </div>
            <p className="flex-1 text-sm text-fog">{guide.description}</p>
            <div className="flex gap-3">
              <Link
                to={`/treino/${guide.id}/guia`}
                className="min-h-13 flex-1 content-center rounded-xl bg-teal px-4 text-center text-base font-bold text-teal-deep transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Guia
              </Link>
              <Link
                to={`/treino/${guide.id}/pratica`}
                className="min-h-13 flex-1 content-center rounded-xl border border-edge px-4 text-center text-base font-semibold text-snow transition hover:border-teal/60 hover:text-teal active:scale-[0.97] active:border-teal/60 active:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Prática
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
