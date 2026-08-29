import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Início', end: true },
  { to: '/contador', label: 'Contador', end: false },
  { to: '/sobre', label: 'Sobre', end: false },
]

export default function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <nav
          aria-label="Navegação principal"
          className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-4"
        >
          <span className="font-semibold tracking-tight">meu-app</span>
          <ul className="flex gap-4 text-sm">
            {navItems.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `rounded px-2 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                      isActive
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-700 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 px-6 py-6 text-center text-sm text-slate-500 dark:border-slate-800">
        React + Vite + TypeScript + Tailwind
      </footer>
    </div>
  )
}
