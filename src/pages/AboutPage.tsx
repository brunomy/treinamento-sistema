const stack = [
  ['Vite 8', 'build e dev server'],
  ['React 19', 'biblioteca de UI'],
  ['TypeScript', 'tipagem estática'],
  ['Tailwind CSS 4', 'estilização utility-first'],
  ['React Router 7', 'roteamento client-side'],
  ['ESLint + Prettier', 'lint e formatação'],
]

export default function AboutPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Sobre</h1>
      <dl className="divide-y divide-slate-200 dark:divide-slate-800">
        {stack.map(([name, desc]) => (
          <div key={name} className="flex justify-between gap-4 py-3">
            <dt className="font-medium">{name}</dt>
            <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
