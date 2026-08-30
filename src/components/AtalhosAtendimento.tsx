import { useCallback, useEffect, useRef, useState } from 'react'

import { ATALHOS_ATENDIMENTO, type Atalho, type AtalhoArquivo } from '@/data/atalhos'

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

/**
 * Tenta copiar o arquivo para a area de transferencia. Navegadores recusam
 * application/pdf e video/mp4, entao o caminho normal e o fallback de download.
 */
async function entregarArquivo(atalho: AtalhoArquivo): Promise<string> {
  const resposta = await fetch(atalho.url)
  if (!resposta.ok) throw new Error(`Falha ao carregar ${atalho.url}`)
  const blob = await resposta.blob()

  try {
    await navigator.clipboard.write([new ClipboardItem({ [atalho.mime]: blob })])
    return 'Copiado!'
  } catch {
    baixarBlob(blob, atalho.nomeArquivo)
    return 'Baixado!'
  }
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

  const acionar = useCallback(
    async (atalho: Atalho) => {
      try {
        if (atalho.tipo === 'texto') {
          await navigator.clipboard.writeText(atalho.texto)
          anunciar(atalho.id, 'Copiado!')
          return
        }
        anunciar(atalho.id, await entregarArquivo(atalho))
      } catch {
        anunciar(atalho.id, 'Erro')
      }
    },
    [anunciar],
  )

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {ATALHOS_ATENDIMENTO.map((atalho) => {
        const emFeedback = feedback?.id === atalho.id
        return (
          <button
            key={atalho.id}
            type="button"
            onClick={() => void acionar(atalho)}
            className={CLASSES_BOTAO}
          >
            {emFeedback ? feedback.msg : atalho.label}
          </button>
        )
      })}
      <span role="status" aria-live="polite" className="sr-only">
        {feedback ? `${feedback.msg}` : ''}
      </span>
    </div>
  )
}
