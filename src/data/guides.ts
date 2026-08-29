/**
 * Dados mocados dos guias de treinamento.
 *
 * Coordenadas dos alvos (x, y, w, h) em PORCENTAGEM da imagem — assim os
 * hotspots escalam junto com o print em qualquer tamanho de tela.
 * Ao trocar os SVGs de public/prints/ por prints reais do Velco, basta
 * ajustar estes números (dica: rode `npm run gen:prints` para ver as
 * coordenadas de referência dos mocks).
 */

export interface Target {
  id: string
  /** % da largura da imagem */
  x: number
  /** % da altura da imagem */
  y: number
  w: number
  h: number
  label: string
}

export interface Step {
  image: string
  title: string
  hint: string
  targets: Target[]
}

export interface Guide {
  id: string
  title: string
  description: string
  steps: Step[]
}

export type Mode = 'guia' | 'pratica'

export const guides: Guide[] = [
  {
    id: 'acessar-financeiro-compras',
    title: 'Acessar o Financeiro Compras',
    description: 'Navegue pelo menu até o relatório Financeiro Compras.',
    steps: [
      {
        image: '/prints/01-menu-fechado.svg',
        title: 'Abrir a seção de relatórios',
        hint: 'No menu lateral, abra a seção “Relatórios”.',
        targets: [{ id: 'menu-relatorios', x: 1.1, y: 63.7, w: 17.2, h: 5.4, label: 'Relatórios' }],
      },
      {
        image: '/prints/02-menu-relatorios-aberto.svg',
        title: 'Escolher o relatório',
        hint: 'No submenu que abriu, clique em “Financeiro Compras”.',
        targets: [
          { id: 'sub-financeiro', x: 2.8, y: 70.0, w: 15.6, h: 4.9, label: 'Financeiro Compras' },
        ],
      },
      {
        image: '/prints/03-financeiro-compras.svg',
        title: 'Confirmar a tela',
        hint: 'Você chegou! Confirme clicando no breadcrumb “Financeiro Compras”.',
        targets: [{ id: 'breadcrumb', x: 41.4, y: 19.3, w: 10.4, h: 3.4, label: 'Breadcrumb' }],
      },
    ],
  },
  {
    id: 'filtrar-por-ano',
    title: 'Filtrar gastos por ano',
    description: 'Use o painel de filtro para mudar o ano do relatório.',
    steps: [
      {
        image: '/prints/03-financeiro-compras.svg',
        title: 'Abrir o filtro',
        hint: 'Clique na barra “Filtro” para expandir as opções.',
        targets: [{ id: 'barra-filtro', x: 21.1, y: 27.8, w: 77.2, h: 6.8, label: 'Filtro' }],
      },
      {
        image: '/prints/04-filtro-aberto.svg',
        title: 'Abrir o seletor de ano',
        hint: 'Clique no campo “Ano” para ver os anos disponíveis.',
        targets: [{ id: 'select-ano', x: 22.9, y: 40.7, w: 15.3, h: 5.4, label: 'Ano' }],
      },
      {
        image: '/prints/05-ano-dropdown.svg',
        title: 'Escolher o ano',
        hint: 'Selecione “2025” na lista.',
        targets: [{ id: 'opcao-2025', x: 23.2, y: 52.7, w: 14.7, h: 4.9, label: '2025' }],
      },
      {
        image: '/prints/04-filtro-aberto.svg',
        title: 'Aplicar',
        hint: 'Clique em “Aplicar filtro” para atualizar o relatório.',
        targets: [{ id: 'aplicar', x: 86.1, y: 40.7, w: 10.8, h: 5.4, label: 'Aplicar filtro' }],
      },
    ],
  },
  {
    id: 'exportar-relatorio',
    title: 'Exportar o relatório',
    description: 'Gere um arquivo Excel com os dados do relatório.',
    steps: [
      {
        image: '/prints/03-financeiro-compras.svg',
        title: 'Iniciar exportação',
        hint: 'Clique no botão “Exportar”, no canto superior direito.',
        targets: [{ id: 'btn-exportar', x: 86.8, y: 12.7, w: 10.1, h: 4.9, label: 'Exportar' }],
      },
      {
        image: '/prints/06-modal-exportar.svg',
        title: 'Escolher o formato',
        hint: 'No modal, escolha o formato “Excel (.xlsx)”.',
        targets: [{ id: 'formato-excel', x: 51.4, y: 40.2, w: 13.9, h: 13.4, label: 'Excel' }],
      },
      {
        image: '/prints/06-modal-exportar.svg',
        title: 'Confirmar',
        hint: 'Clique em “Exportar” para baixar o arquivo.',
        targets: [{ id: 'confirmar', x: 51.4, y: 58.5, w: 13.9, h: 6.3, label: 'Exportar' }],
      },
    ],
  },
  {
    id: 'comparar-meses',
    title: 'Comparar meses de gastos',
    description: 'Selecione dois meses e compare os gastos entre eles.',
    steps: [
      {
        image: '/prints/03-financeiro-compras.svg',
        title: 'Entrar no modo comparação',
        hint: 'Clique em “Tabela de comparação”.',
        targets: [
          {
            id: 'btn-comparacao',
            x: 84.7,
            y: 39.8,
            w: 12.2,
            h: 4.1,
            label: 'Tabela de comparação',
          },
        ],
      },
      {
        image: '/prints/07-comparacao.svg',
        title: 'Selecionar os meses',
        hint: 'Este passo tem DOIS cliques: selecione JANEIRO e AGOSTO.',
        targets: [
          { id: 'mes-janeiro', x: 22.5, y: 48.8, w: 5.8, h: 6.8, label: 'Janeiro' },
          { id: 'mes-agosto', x: 67.2, y: 48.8, w: 5.8, h: 6.8, label: 'Agosto' },
        ],
      },
      {
        image: '/prints/07-comparacao.svg',
        title: 'Comparar',
        hint: 'Clique em “Comparar” para ver o resultado.',
        targets: [{ id: 'btn-comparar', x: 86.8, y: 29.0, w: 10.1, h: 4.4, label: 'Comparar' }],
      },
    ],
  },
]

export function getGuide(id: string | undefined): Guide | undefined {
  return guides.find((g) => g.id === id)
}

/** Resumo do treino, exibido como snackbar na lista inicial. */
export interface TrainingResult {
  guideTitle: string
  mode: Mode
  seconds: number
  steps: number
  misses: number
  accuracy: number
  reveals: number
}
