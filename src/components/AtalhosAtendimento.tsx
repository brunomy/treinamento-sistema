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

/** `canShare` nao esta na tipagem padrao do Navigator, entao checamos sem `any` */
type NavigatorComCanShare = Navigator & {
  canShare?: (dados?: ShareData) => boolean
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

/** le o `name` do erro sem recorrer a `any` */
function nomeDoErro(err: unknown): string {
  if (err instanceof DOMException || err instanceof Error) return err.name
  return ''
}

export default function AtalhosAtendimento() {
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /**
   * Cache do blob por url. A Web Share exige ativacao do usuario (o toque);
   * se o fetch demorar, a ativacao expira e o navegador recusa com
   * NotAllowedError. Com o blob ja em cache, o segundo toque compartilha na hora.
   */
  const blobsRef = useRef<Map<string, Blob>>(new Map())

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

  const limparFeedback = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    setFeedback(null)
  }, [])

  const compartilharTexto = useCallback(
    async (atalho: AtalhoTexto) => {
      try {
        const nav = navigator as NavigatorComCanShare

        if (nav.canShare?.({ text: atalho.texto }) && typeof nav.share === 'function') {
          /**
           * Vai SOMENTE `text`: o proprio conteudo ja traz o link quando precisa,
           * e alguns apps ignoram ou duplicam o endereco quando ele chega em
           * `url` separado. `title` tambem fica de fora pelo mesmo motivo.
           */
          await navigator.share({ text: atalho.texto })
          anunciar(atalho.id, 'Compartilhado!')
          return
        }

        // Sem folha de compartilhamento (desktop): copiar e a alternativa.
        await navigator.clipboard.writeText(atalho.texto)
        anunciar(atalho.id, 'Copiado!')
      } catch (err: unknown) {
        // usuario fechou a folha de compartilhamento: nao e erro
        if (nomeDoErro(err) === 'AbortError') {
          limparFeedback()
          return
        }
        anunciar(atalho.id, 'Erro')
      }
    },
    [anunciar, limparFeedback],
  )

  const obterBlob = useCallback(async (atalho: AtalhoArquivo): Promise<Blob> => {
    const emCache = blobsRef.current.get(atalho.url)
    if (emCache) return emCache

    const resposta = await fetch(atalho.url)
    if (!resposta.ok) throw new Error(`Falha ao carregar ${atalho.url}`)
    const blob = await resposta.blob()
    blobsRef.current.set(atalho.url, blob)
    return blob
  }, [])

  const compartilhar = useCallback(
    async (atalho: AtalhoArquivo) => {
      try {
        const blob = await obterBlob(atalho)
        const arquivo = new File([blob], atalho.nomeArquivo, { type: atalho.mime })
        const nav = navigator as NavigatorComCanShare

        if (nav.canShare?.({ files: [arquivo] })) {
          /**
           * Vai SOMENTE `files`: alguns apps (WhatsApp incluso) descartam o
           * anexo quando o compartilhamento traz `title`/`text` junto.
           */
          await navigator.share({ files: [arquivo] })
          anunciar(atalho.id, 'Compartilhado!')
          return
        }

        // Sem folha de compartilhamento (desktop): o download e a alternativa.
        baixarBlob(blob, atalho.nomeArquivo)
        anunciar(atalho.id, 'Baixado!')
      } catch (err: unknown) {
        const nome = nomeDoErro(err)
        // usuario fechou a folha de compartilhamento: nao e erro
        if (nome === 'AbortError') {
          limparFeedback()
          return
        }
        // ativacao do usuario expirou durante o fetch; o blob ja esta em cache
        if (nome === 'NotAllowedError') {
          anunciar(atalho.id, 'Toque de novo')
          return
        }
        anunciar(atalho.id, 'Erro')
      }
    },
    [anunciar, limparFeedback, obterBlob],
  )

  return (
    <div className="flex flex-col gap-3">
      <section aria-labelledby="atalhos-compartilhar-dados-titulo" className="flex flex-col gap-2">
        <h2 id="atalhos-compartilhar-dados-titulo" className="label-mono">
          Compartilhar dados
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {ATALHOS_COPIAR.map((atalho) => {
            const emFeedback = feedback?.id === atalho.id
            return (
              <button
                key={atalho.id}
                type="button"
                onClick={() => void compartilharTexto(atalho)}
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
          Compartilhar arquivos
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {ATALHOS_DOWNLOAD.map((atalho) => {
            const emFeedback = feedback?.id === atalho.id
            return (
              <button
                key={atalho.id}
                type="button"
                onClick={() => void compartilhar(atalho)}
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
