import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-bold tracking-tight">Projeto React iniciado</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400">
        Base pronta com Vite, TypeScript, Tailwind CSS v4, React Router, ESLint e Prettier.
      </p>
      <Link
        to="/contador"
        className="inline-block rounded-md bg-brand-600 px-4 py-2 font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        Ver exemplo de estado
      </Link>
    </section>
  )
}
