import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

// Por que esta pagina existe:
// No Android, os links do Kommo sao capturados por App Links e abrem o app
// nativo em vez do navegador. O Chrome so entrega um link a um app externo
// quando a navegacao carrega gesto do usuario (user activation); ao abrir esta
// pagina do nosso dominio e redirecionar por JavaScript, o gesto do clique ja
// se perdeu e a navegacao permanece no navegador. Nao dependemos de detectar o
// aparelho: vale para todas as plataformas.
//
// O redirect e atrasado de proposito (setTimeout): logo apos o clique a
// ativacao do usuario ainda pode estar valendo, e nesse intervalo o Chrome
// entregaria o link ao app do Kommo. Esperando alguns centesimos de segundo a
// ativacao expira e a navegacao segue no navegador. Ainda assim oferecemos um
// link manual de escape caso o app seja aberto.

// Allowlist obrigatoria: sem ela, /ir?u=... seria um open redirect (qualquer
// um poderia usar nosso dominio para levar o usuario a um site malicioso).
const HOST_PERMITIDO = 'drdouglasvinicius.kommo.com'

const ATRASO_REDIRECT_MS = 600

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
    if (!permitido) return
    const timer = window.setTimeout(() => {
      window.location.replace(destino)
    }, ATRASO_REDIRECT_MS)
    return () => window.clearTimeout(timer)
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
      <a
        href={destino}
        rel="noopener noreferrer"
        className="mt-6 inline-block text-teal underline hover:brightness-110"
      >
        Se não abrir, toque aqui
      </a>
      <p className="mt-3 text-sm text-fog">
        Se o aplicativo do Kommo abrir no lugar do navegador, desative em Configurações → Apps →
        Kommo → Abrir links compatíveis.
      </p>
    </section>
  )
}
