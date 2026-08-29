import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">404 — Página não encontrada</h1>
      <Link to="/" className="mt-6 inline-block text-brand-600 underline hover:text-brand-700">
        Voltar ao início
      </Link>
    </section>
  )
}
