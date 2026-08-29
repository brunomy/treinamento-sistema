import { useState } from 'react'

export default function CounterPage() {
  const [count, setCount] = useState(0)

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Contador</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Exemplo mínimo de estado local com <code className="font-mono">useState</code>.
      </p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setCount((c) => c - 1)}
          className="size-10 rounded-md border border-slate-300 text-xl leading-none transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          aria-label="Diminuir"
        >
          −
        </button>
        <output className="min-w-16 text-center font-mono text-3xl tabular-nums">{count}</output>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="size-10 rounded-md border border-slate-300 text-xl leading-none transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          aria-label="Aumentar"
        >
          +
        </button>
      </div>
    </section>
  )
}
