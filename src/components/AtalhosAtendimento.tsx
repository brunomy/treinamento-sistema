import { useCallback, useEffect, useRef, useState } from 'react'

import {
  ATALHOS_COPIAR,
  ATALHOS_DOWNLOAD,
  type AtalhoArquivo,
  type AtalhoTexto,
} from '@/data/atalhos'

interface Feedback {
  id: string
  msg: string
}

const CLASSES_BOTAO =
  'inline-flex min-h-11 min-w-[7.5rem] items-center justify-center rounded-lg border border-edge px-4 text-sm font-semibold text-snow transition hover:border-teal/60 hover:text-teal active:scale-[0.97] active:border-teal/60 active:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

/** dispara o download do blob com o nome sugerido */
function baixarBlob(blob: Blob, nomeArquivo: string): void {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}

/** baixa o arquivo do atalho (PDF e MP4 nao sao aceitos na area de transferencia) */
async function baixarArquivo(atalho: AtalhoArquivo): Promise<void> {
  const resposta = await fetch(atalho.url)
  if (!resposta.ok) throw new Error(`Falha ao carregar ${atalho.url}`)
  baixarBlob(await resposta.blob(), atalho.nomeArquivo)
}

export default function AtalhosAtendimento() {
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const anunciar = useCallback((id: string, msg: string) => {
    setFeedback({ id, msg })
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setFeedback(null), 2000)
  }, [])

  const copiar = useCallback(
    async (atalho: AtalhoTexto) => {
      try {
        await navigator.clipboard.writeText(atalho.texto)
        anunciar(atalho.id, 'Copiado!')
      } catch {
        anunciar(atalho.id, 'Erro')
      }
    },
    [anunciar],
  )

  const baixar = useCallback(
    async (atalho: AtalhoArquivo) => {
      try {
        await baixarArquivo(atalho)
        anunciar(atalho.id, 'Baixado!')
      } catch {
        anunciar(atalho.id, 'Erro')
      }
    },
    [anunciar],
  )

  return (
    <div className="flex flex-col gap-3">
      <section aria-labelledby="atalhos-copiar-dados-titulo" className="flex flex-col gap-2">
        <h2 id="atalhos-copiar-dados-titulo" className="label-mono">
          Copiar dados
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {ATALHOS_COPIAR.map((atalho) => {
            const emFeedback = feedback?.id === atalho.id
            return (
              <button
                key={atalho.id}
                type="button"
                onClick={() => void copiar(atalho)}
                className={CLASSES_BOTAO}
              >
                {emFeedback ? feedback.msg : atalho.label}
              </button>
            )
          })}
        </div>
      </section>

      <section
        aria-labelledby="atalhos-downloads-titulo"
        className="flex flex-col gap-2 border-t border-edge pt-3"
      >
        <h2 id="atalhos-downloads-titulo" className="label-mono">
          Downloads
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {ATALHOS_DOWNLOAD.map((atalho) => {
            const emFeedback = feedback?.id === atalho.id
            return (
              <button
                key={atalho.id}
                type="button"
                onClick={() => void baixar(atalho)}
                className={CLASSES_BOTAO}
              >
                {emFeedback ? feedback.msg : atalho.label}
              </button>
            )
          })}
        </div>
      </section>

      <span role="status" aria-live="polite" className="sr-only">
        {feedback ? `${feedback.msg}` : ''}
      </span>
    </div>
  )
}
