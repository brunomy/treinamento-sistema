import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="label-mono">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Pagina nao encontrada</h1>
      <Link to="/" className="mt-6 inline-block text-teal underline hover:brightness-110">
        Voltar aos treinos
      </Link>
    </section>
  )
}
