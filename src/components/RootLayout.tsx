import { Link, Outlet, useLocation } from 'react-router-dom'

import AtalhosAtendimento from './AtalhosAtendimento'

const ATALHOS_KOMMO = [
  {
    label: 'Hoje',
    href: 'https://drdouglasvinicius.kommo.com/leads/pipeline/?filter%5Bstatus_id%5D%5B%5D=110762912&filter%5Bstatus_id%5D%5B%5D=110974800&filter%5Bstatus_id%5D%5B%5D=110974804&filter%5Bstatus_id%5D%5B%5D=110974808&filter%5Bstatus_id%5D%5B%5D=62946007&filter%5Bstatus_id%5D%5B%5D=62946015&filter%5Bstatus_id%5D%5B%5D=62946019&filter%5Bstatus_id%5D%5B%5D=64335207&filter%5Bstatus_id%5D%5B%5D=66515279&filter%5Bstatus_id%5D%5B%5D=66728595&filter%5Bstatus_id%5D%5B%5D=68262967&filter%5Bdate_preset%5D=current_day&useFilter=y',
  },
  {
    label: 'Ontem',
    href: 'https://drdouglasvinicius.kommo.com/leads/pipeline/?filter%5Bstatus_id%5D%5B%5D=110762912&filter%5Bstatus_id%5D%5B%5D=110974800&filter%5Bstatus_id%5D%5B%5D=110974804&filter%5Bstatus_id%5D%5B%5D=110974808&filter%5Bstatus_id%5D%5B%5D=62946007&filter%5Bstatus_id%5D%5B%5D=62946015&filter%5Bstatus_id%5D%5B%5D=62946019&filter%5Bstatus_id%5D%5B%5D=64335207&filter%5Bstatus_id%5D%5B%5D=66515279&filter%5Bstatus_id%5D%5B%5D=66728595&filter%5Bstatus_id%5D%5B%5D=68262967&filter%5Bdate_preset%5D=yesterday&useFilter=y',
  },
  {
    label: 'Todos',
    href: 'https://drdouglasvinicius.kommo.com/leads/pipeline/?filter%5Bstatus_id%5D%5B%5D=110762912&filter%5Bstatus_id%5D%5B%5D=110974800&filter%5Bstatus_id%5D%5B%5D=110974804&filter%5Bstatus_id%5D%5B%5D=110974808&filter%5Bstatus_id%5D%5B%5D=62946007&filter%5Bstatus_id%5D%5B%5D=62946015&filter%5Bstatus_id%5D%5B%5D=62946019&filter%5Bstatus_id%5D%5B%5D=64335207&filter%5Bstatus_id%5D%5B%5D=66515279&filter%5Bstatus_id%5D%5B%5D=66728595&filter%5Bstatus_id%5D%5B%5D=68262967&filter%5Btags_logic%5D=or&tag%5B%5D=199213&useFilter=y',
  },
] as const

const ATRASO_REDIRECT_MS = 600

// HTML minimo mostrado na aba nova enquanto o redirect nao acontece, para ela nao
// ficar em branco. Mantem o visual escuro do app.
const HTML_ESPERA = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Abrindo o Kommo…</title>
<style>html,body{height:100%;margin:0}body{display:flex;align-items:center;justify-content:center;
background:#0b0f0e;color:#e8efee;font:600 16px/1.5 system-ui,-apple-system,sans-serif}</style>
</head><body>Abrindo o Kommo…</body></html>`

// Abre o Kommo numa aba EM BRANCO do navegador e so depois redireciona essa aba.
//
// Por que assim, e TRES ERROS JA COMETIDOS AQUI — nao reintroduzir nenhum deles:
// (a) deixar o link navegar direto para a URL https do Kommo: no Android os App Links
//     capturam a navegacao e abrem o APLICATIVO nativo do Kommo, nao o navegador.
// (b) saltar por uma pagina do nosso proprio dominio (a antiga rota /ir): num atalho de
//     tela inicial, uma URL same-origin e aberta DENTRO da janela do app, que acaba
//     sendo navegada para o Kommo; fechar essa janela derruba o treinamento inteiro.
// (c) passar a flag 'noopener' no window.open: o retorno vira SEMPRE null e perdemos a
//     referencia da aba, que e justamente o que precisamos para redireciona-la.
//
// O atraso de 600ms e proposital: logo apos o clique a ativacao do usuario ainda vale e
// o Chrome entregaria o link ao app do Kommo. Esperando esse intervalo a ativacao expira
// e a navegacao permanece no navegador.
//
// Se o pop-up for bloqueado, window.open devolve null e apenas saimos: o href do link
// continua servindo de fallback (menu de contexto / "abrir em nova guia").
function abrirKommoEmNovaAba(event: React.MouseEvent<HTMLAnchorElement>, url: string) {
  event.preventDefault()

  const aba = window.open('', '_blank')
  if (!aba) return

  try {
    aba.document.write(HTML_ESPERA)
    aba.document.close()
  } catch {
    // alguns navegadores restringem document.write em about:blank — segue sem feedback
  }

  window.setTimeout(() => {
    try {
      aba.location.replace(url)
    } catch {
      // aba fechada pelo usuario antes do redirect
    }
  }, ATRASO_REDIRECT_MS)
}

export default function RootLayout() {
  const { pathname } = useLocation()
  // Na tela de treino escondemos a faixa de atalhos, o cabeçalho e o rodapé: toda essa
  // moldura consome altura e o print precisa aparecer o maior possível no tablet, sem
  // rolagem. A navegação não se perde — a própria tela de treino tem o link "← treinos".
  const emTreino = pathname.startsWith('/treino')

  return (
    <div className="flex min-h-dvh flex-col">
      {!emTreino && (
        <header className="border-b border-edge">
          <nav
            aria-label="Navegação principal"
            className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4"
          >
            <Link
              to="/"
              className="flex items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-teal font-mono text-sm font-bold text-teal-deep">
                ▸
              </span>
              <span className="font-semibold tracking-tight">
                Central de <span className="text-teal">treinos</span>
              </span>
            </Link>
            <span className="label-mono">Guias por aplicação</span>
          </nav>
        </header>
      )}

      {!emTreino && (
        <div className="border-b border-edge">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-2 sm:px-6">
            <section aria-labelledby="atalhos-meus-leads-titulo" className="flex flex-col gap-2">
              <h2 id="atalhos-meus-leads-titulo" className="label-mono">
                Meus leads
              </h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {ATALHOS_KOMMO.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (abre em nova guia)`}
                    onClick={(event) => abrirKommoEmNovaAba(event, href)}
                    className="inline-flex min-h-11 min-w-[7.5rem] items-center justify-center rounded-lg border border-edge px-4 text-sm font-semibold text-snow transition hover:border-teal/60 hover:text-teal active:scale-[0.97] active:border-teal/60 active:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </section>

            <div className="border-t border-edge pt-3">
              <AtalhosAtendimento />
            </div>
          </div>
        </div>
      )}

      {/* no treino o padding vertical encolhe (py-3) para sobrar altura ao print */}
      <main
        className={`mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 ${emTreino ? 'py-3' : 'py-6'}`}
      >
        <Outlet />
      </main>

      {!emTreino && (
        <footer className="border-t border-edge px-6 py-5 text-center">
          <span className="label-mono">treino guiado por imagens · dados mocados</span>
        </footer>
      )}
    </div>
  )
}
