import { Link, Outlet } from 'react-router-dom'

export default function RootLayout() {
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

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-edge px-6 py-5 text-center">
        <span className="label-mono">treino guiado por imagens · dados mocados</span>
      </footer>
    </div>
  )
}
