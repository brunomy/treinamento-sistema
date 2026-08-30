import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

// Por que esta pagina existe:
// No Android, os links do Kommo sao capturados por App Links e abrem o app
// nativo em vez do navegador. O Chrome so entrega um link a um app externo
// quando a navegacao tem gesto do usuario; ao abrir esta pagina do nosso
// dominio e redirecionar por JavaScript, o gesto do clique ja se perdeu e a
// navegacao permanece no navegador. Nao dependemos de detectar o aparelho:
// vale para todas as plataformas.

// Allowlist obrigatoria: sem ela, /ir?u=... seria um open redirect (qualquer
// um poderia usar nosso dominio para levar o usuario a um site malicioso).
const HOST_PERMITIDO = 'drdouglasvinicius.kommo.com'

function ehDestinoPermitido(valor: string | null): valor is string {
  if (!valor) return false
  try {
    const url = new URL(valor)
    return url.protocol === 'https:' && url.host === HOST_PERMITIDO
  } catch {
    return false
  }
}

export default function RedirectPage() {
  const [searchParams] = useSearchParams()
  const destino = searchParams.get('u')
  const permitido = ehDestinoPermitido(destino)

  useEffect(() => {
    if (permitido) window.location.replace(destino)
  }, [permitido, destino])

  if (!permitido) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="label-mono">erro</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Link inválido.</h1>
        <Link to="/" className="mt-6 inline-block text-teal underline hover:brightness-110">
          Voltar aos treinos
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="label-mono">redirecionando</p>
      <p className="mt-2 text-fog">Abrindo no navegador…</p>
    </section>
  )
}
