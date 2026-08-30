import { Link, Outlet, useLocation } from 'react-router-dom'

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
    label: 'Meus leads',
    href: 'https://drdouglasvinicius.kommo.com/leads/pipeline/?filter%5Bstatus_id%5D%5B%5D=110762912&filter%5Bstatus_id%5D%5B%5D=110974800&filter%5Bstatus_id%5D%5B%5D=110974804&filter%5Bstatus_id%5D%5B%5D=110974808&filter%5Bstatus_id%5D%5B%5D=62946007&filter%5Bstatus_id%5D%5B%5D=62946015&filter%5Bstatus_id%5D%5B%5D=62946019&filter%5Bstatus_id%5D%5B%5D=64335207&filter%5Bstatus_id%5D%5B%5D=66515279&filter%5Bstatus_id%5D%5B%5D=66728595&filter%5Bstatus_id%5D%5B%5D=68262967&filter%5Btags_logic%5D=or&tag%5B%5D=199213&useFilter=y',
  },
] as const

export default function RootLayout() {
  const { pathname } = useLocation()
  // a faixa de atalhos fica oculta na tela de treino: ela precisa caber no tablet sem rolagem
  const emTreino = pathname.startsWith('/treino')

  return (
    <div className="flex min-h-dvh flex-col">
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

      {!emTreino && (
        <div className="border-b border-edge">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-4 py-2 sm:gap-3 sm:px-6">
            {ATALHOS_KOMMO.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (abre em nova guia)`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-edge px-4 text-sm font-semibold text-snow transition hover:border-teal/60 hover:text-teal active:scale-[0.97] active:border-teal/60 active:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                {label}
                <span aria-hidden="true" className="text-teal">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-edge px-6 py-5 text-center">
        <span className="label-mono">treino guiado por imagens · dados mocados</span>
      </footer>
    </div>
  )
}
