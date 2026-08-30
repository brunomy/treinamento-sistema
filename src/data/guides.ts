/**
 * Dados mocados dos guias de treinamento, organizados por aplicação (aba).
 *
 * Coordenadas dos alvos (x, y, w, h) em PORCENTAGEM da imagem — assim os
 * hotspots escalam junto com o print em qualquer tamanho de tela.
 * Ao trocar os SVGs de public/prints/ por prints reais, basta ajustar
 * estes números.
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
  /** aplicação (aba) à qual o guia pertence */
  appId: string
  title: string
  description: string
  steps: Step[]
}

/** Uma aplicação treinável — vira uma aba na tela inicial. */
export interface TrainingApp {
  id: string
  name: string
  module: string
  guides: Guide[]
}

export type Mode = 'guia' | 'pratica'

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

/**
 * Proporcao (largura/altura) dos prints — usada para dimensionar o palco
 * de forma que o passo caiba inteiro na tela do tablet, sem rolagem.
 * Ajuste se os prints reais tiverem outra proporcao.
 */
export const PRINT_ASPECT = 1058 / 663

const kommoGuides: Guide[] = [
  {
    id: 'filtrar-meus-leads',
    appId: 'kommo',
    title: 'Filtrar meus leads',
    description: 'Use o painel de filtro do Kommo para ver apenas os leads da tag Valéria.',
    steps: [
      {
        image: '/prints/kommo/k01-leads.png',
        title: 'Abrir o filtro',
        hint: 'Na barra superior, clique em “Pesquisar e filtrar”.',
        targets: [
          {
            id: 'pesquisar-filtrar',
            x: 26.94,
            y: 2.76,
            w: 21.27,
            h: 5.04,
            label: 'Pesquisar e filtrar',
          },
        ],
      },
      {
        image: '/prints/kommo/k02-filtro.png',
        title: 'Selecionar a tag',
        hint: 'Na coluna TAGS, à direita, clique na tag “Valéria”.',
        targets: [{ id: 'tag-valeria', x: 78.07, y: 28.96, w: 4.73, h: 3.62, label: 'Valéria' }],
      },
      {
        image: '/prints/kommo/k03-filtro-aplicar.png',
        title: 'Aplicar o filtro',
        hint: 'Clique no botão azul “Aplicar” para filtrar os leads.',
        targets: [{ id: 'btn-aplicar', x: 49.98, y: 82.09, w: 7.92, h: 5.69, label: 'Aplicar' }],
      },
    ],
  },
  {
    id: 'filtrar-lead-por-data',
    appId: 'kommo',
    title: 'Filtrar lead por data',
    description: 'Use o filtro de período para ver apenas os leads criados hoje.',
    steps: [
      {
        image: '/prints/kommo/k04-lista-filtrada.png',
        title: 'Abrir o filtro',
        hint: 'Na barra superior, clique em “Pesquisar e filtrar”.',
        targets: [
          {
            id: 'pesquisar-filtrar-data',
            x: 27.22,
            y: 2.71,
            w: 14.84,
            h: 4.83,
            label: 'Pesquisar e filtrar',
          },
        ],
      },
      {
        image: '/prints/kommo/k05-filtro-data.png',
        title: 'Abrir o seletor de período',
        hint: 'Em PROPRIEDADES DE LEAD, clique no campo “A qualquer hora”.',
        targets: [
          { id: 'campo-periodo', x: 50.08, y: 23.18, w: 25.87, h: 4.62, label: 'A qualquer hora' },
        ],
      },
      {
        image: '/prints/kommo/k06-data-hoje.png',
        title: 'Escolher o período',
        hint: 'Na lista que abriu, selecione “Hoje”.',
        targets: [{ id: 'opcao-hoje', x: 50.08, y: 42.44, w: 25.87, h: 3.8, label: 'Hoje' }],
      },
      {
        image: '/prints/kommo/k07-data-aplicar.png',
        title: 'Aplicar o filtro',
        hint: 'Com o período “Hoje” selecionado, clique no botão azul “Aplicar”.',
        targets: [
          { id: 'btn-aplicar-data', x: 49.98, y: 82.09, w: 7.92, h: 5.69, label: 'Aplicar' },
        ],
      },
    ],
  },
  {
    id: 'iniciar-atendimento',
    appId: 'kommo',
    title: 'Iniciar atendimento',
    description:
      'Aceite o lead que chegou, marque a tag, mova para Conversas iniciadas e fale com a pessoa.',
    steps: [
      {
        image: '/prints/kommo/k08-chat-aceitar.png',
        title: 'Aceitar o lead',
        hint: 'No rodapé do painel do lead, clique em “Aceitar”.',
        targets: [{ id: 'btn-aceitar', x: 43.86, y: 92.31, w: 6.81, h: 5.13, label: 'Aceitar' }],
      },
      {
        image: '/prints/kommo/k09-chat-adicionar-tags.png',
        title: 'Abrir as tags',
        hint: 'No topo do painel, clique em “#ADICIONAR TAGS”.',
        targets: [
          {
            id: 'btn-adicionar-tags',
            x: 44.14,
            y: 10.41,
            w: 9.64,
            h: 3.17,
            label: 'Adicionar tags',
          },
        ],
      },
      {
        image: '/prints/kommo/k10-chat-tag-valeria.png',
        title: 'Escolher a tag',
        hint: 'Na lista de tags, selecione “Valéria”.',
        targets: [
          { id: 'tag-valeria-chat', x: 44.61, y: 22.47, w: 5.29, h: 3.62, label: 'Valéria' },
        ],
      },
      {
        image: '/prints/kommo/k11-chat-conversas-iniciadas.png',
        title: 'Mover a etapa',
        hint: 'Na lista de etapas, selecione “Conversas iniciadas”.',
        targets: [
          {
            id: 'etapa-conversas-iniciadas',
            x: 43.67,
            y: 16.14,
            w: 25.43,
            h: 4.98,
            label: 'Conversas iniciadas',
          },
        ],
      },
      {
        image: '/prints/kommo/k12-chat-mensagem.png',
        title: 'Iniciar a conversa',
        hint: 'No rodapé do chat, clique em “Escreva uma mensagem ou...” e fale com a pessoa.',
        targets: [
          {
            id: 'campo-mensagem',
            x: 63.8,
            y: 92.01,
            w: 21.5,
            h: 4.68,
            label: 'Escreva uma mensagem',
          },
        ],
      },
    ],
  },
]

export const apps: TrainingApp[] = [
  { id: 'kommo', name: 'Kommo', module: 'Leads', guides: kommoGuides },
]

const allGuides: Guide[] = apps.flatMap((a) => a.guides)

export function getGuide(id: string | undefined): Guide | undefined {
  return allGuides.find((g) => g.id === id)
}

export function getApp(id: string | undefined): TrainingApp | undefined {
  return apps.find((a) => a.id === id)
}
