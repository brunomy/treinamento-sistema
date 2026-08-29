/**
 * Gera prints-placeholder (SVG) de um sistema estilo Velco em public/prints/.
 * Sao mocks para desenvolvimento: ao receber os prints reais (PNG),
 * basta troca-los em public/prints/ mantendo os nomes, e ajustar as
 * coordenadas dos hotspots em src/data/guides.ts se necessario.
 *
 * Rodar: npm run gen:prints
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/prints')
mkdirSync(OUT, { recursive: true })

export const W = 1440
export const H = 820
const FONT = 'Segoe UI, Roboto, Helvetica, Arial, sans-serif'

const C = {
  navy: '#1e1e8f',
  blue: '#2323c9',
  blueSoft: '#eef1fb',
  bg: '#f4f6fa',
  card: '#ffffff',
  border: '#e3e8f2',
  text: '#16233a',
  muted: '#7c8aa5',
  darkCard: '#1b1b5e',
  green: '#16a34a',
  greenSoft: '#dcfce7',
  gray: '#9aa4b8',
  graySoft: '#eceff5',
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const rect = (x, y, w, h, o = {}) => {
  const { fill = C.card, stroke, rx = 0, sw = 1, opacity } = o
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"` +
    (stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : '') +
    (opacity != null ? ` opacity="${opacity}"` : '') +
    '/>'
  )
}

const txt = (x, y, s, o = {}) => {
  const { size = 14, fill = C.text, weight = 400, anchor = 'start' } = o
  return (
    `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}"` +
    ` fill="${fill}" text-anchor="${anchor}" dominant-baseline="middle">${esc(s)}</text>`
  )
}

const caret = (x, y, fill = C.muted, up = false) =>
  `<path d="M ${x} ${up ? y + 3 : y - 3} l 6 ${up ? -6 : 6} l 6 ${up ? 6 : -6}" fill="none" stroke="${fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`

// ---------------------------------------------------------------- sidebar
const MENU = [
  'Processos',
  'Comunicados',
  'Oficinas/Reparos',
  'Regulagens',
  'Orçamentos',
  'Compras',
  'Relatórios',
  'Prazos',
]
const SUB = ['Processos', 'Financeiro Compras', 'Financeiro Processos']

export const SIDEBAR_Y0 = 210
export const ITEM_H = 52

function sidebar({ open = false, active = null, subActive = null } = {}) {
  let s = rect(0, 0, 280, H, { fill: '#fff' })
  s += `<line x1="279.5" y1="0" x2="279.5" y2="${H}" stroke="${C.border}"/>`
  s += txt(36, 44, 'velco', { size: 30, weight: 800 })
  s += rect(20, 84, 240, 76, { fill: C.blueSoft, stroke: C.border, rx: 10 })
  s += txt(140, 112, 'UNIAUTO BRASIL', { size: 14, weight: 700, anchor: 'middle' })
  s += txt(140, 138, 'Alterar Conta', { size: 12.5, fill: C.blue, anchor: 'middle' })

  let y = SIDEBAR_Y0
  for (const label of MENU) {
    const on = label === active
    if (on) s += rect(16, y, 248, 44, { fill: C.blue, rx: 22 })
    s += rect(34, y + 14, 16, 16, { fill: on ? '#fff' : C.blue, rx: 4, opacity: on ? 1 : 0.75 })
    s += txt(64, y + 22.5, label, { size: 14, weight: on ? 700 : 500, fill: on ? '#fff' : C.text })
    if (label === 'Relatórios') s += caret(226, y + 22, on ? '#fff' : C.muted, open)
    y += ITEM_H
    if (label === 'Relatórios' && open) {
      for (const sub of SUB) {
        const son = sub === subActive
        if (son) s += rect(40, y, 224, 40, { fill: C.blue, rx: 20 })
        s += rect(56, y + 13, 14, 14, { fill: son ? '#fff' : C.muted, rx: 3, opacity: 0.8 })
        s += txt(82, y + 20.5, sub, {
          size: 13.5,
          weight: son ? 700 : 500,
          fill: son ? '#fff' : C.text,
        })
        y += 48
      }
    }
  }
  return s
}

function topbar() {
  let s = rect(280, 0, W - 280, 64, { fill: C.navy })
  s += rect(300, 16, 190, 32, { fill: 'none', stroke: 'rgba(255,255,255,0.55)', rx: 8 })
  s += txt(316, 32.5, '▦  Central de Eventos', { size: 13.5, weight: 600, fill: '#fff' })
  s += `<circle cx="${W - 96}" cy="32" r="15" fill="none" stroke="rgba(255,255,255,0.6)"/>`
  s += txt(W - 96, 33, '☾', { size: 14, fill: '#fff', anchor: 'middle' })
  s += `<circle cx="${W - 48}" cy="32" r="17" fill="#fff" opacity="0.92"/>`
  s += txt(W - 48, 33, '👤', { size: 15, anchor: 'middle' })
  return s
}

function pageHeader({ exportBtn = true } = {}) {
  let s = rect(304, 88, W - 304 - 24, 120, { fill: '#fff', stroke: C.border, rx: 12 })
  s += rect(324, 106, 40, 40, { fill: C.blue, rx: 10 })
  s += txt(344, 127, '📊', { size: 16, anchor: 'middle', fill: '#fff' })
  s += txt(380, 126, 'Financeiro Compras', { size: 21, weight: 700, fill: C.blue })
  s += rect(324, 158, 150, 28, { fill: '#fff', stroke: C.blue, rx: 14 })
  s += txt(399, 172.5, 'Central de Eventos', { size: 12, fill: C.blue, anchor: 'middle' })
  s += txt(492, 172.5, '›   Relatórios   ›', { size: 12, fill: C.muted })
  s += rect(596, 158, 150, 28, { fill: C.blueSoft, stroke: C.blue, rx: 14 })
  s += txt(671, 172.5, 'Financeiro Compras', {
    size: 12,
    weight: 600,
    fill: C.blue,
    anchor: 'middle',
  })
  if (exportBtn) {
    s += rect(W - 190, 104, 146, 40, { fill: '#111827', rx: 8 })
    s += txt(W - 117, 125, '⎙  Exportar', { size: 14, weight: 600, fill: '#fff', anchor: 'middle' })
  }
  return s
}

function filterBar({ open = false } = {}) {
  let s = rect(304, 228, W - 304 - 24, 56, { fill: '#fff', stroke: C.border, rx: 12 })
  s += txt(330, 256, 'Filtro', { size: 15, weight: 600 })
  s += caret(W - 64, 256, C.muted, open)
  return s
}

const MONTHS = [
  ['JANEIRO', 'R$ 1,01 mi', '▲ 29%'],
  ['FEVEREIRO', 'R$ 1,00 mi', '0%'],
  ['MARÇO', 'R$ 1,85 mi', '0%'],
  ['ABRIL', 'R$ 1,18 mi', '▼ 36%'],
  ['MAIO', 'R$ 1,27 mi', '▲ 7%'],
  ['JUNHO', 'R$ 1,04 mi', '▼ 19%'],
  ['JULHO', 'R$ 1,34 mi', '▲ 29%'],
  ['AGOSTO', 'R$ 2,13 mi', '▲ 59%'],
  ['SETEMBRO', 'R$ 0,00', '▼ 100%'],
  ['OUTUBRO', 'R$ 0,00', '—'],
  ['NOVEMBRO', 'R$ 0,00', '—'],
  ['DEZEMBRO', 'R$ 0,00', '—'],
]

export const MONTH_X0 = 324
export const MONTH_Y = 400
export const MONTH_W = 84
export const MONTH_H = 56
export const MONTH_GAP = 8

function monthsPanel({ y0 = 304, compareBtn = true, selected = [] } = {}) {
  let s = rect(304, y0, W - 304 - 24, 200, { fill: '#fff', stroke: C.border, rx: 12 })
  s += txt(330, y0 + 36, 'Gastos por mês', { size: 15, weight: 700 })
  s += txt(470, y0 + 20, 'Ano', { size: 10.5, fill: C.muted })
  s += rect(462, y0 + 26, 96, 34, { fill: '#fff', stroke: C.border, rx: 8 })
  s += txt(480, y0 + 43, '2026', { size: 13 })
  s += caret(532, y0 + 44, C.muted)
  if (compareBtn) {
    s += rect(W - 220, y0 + 22, 176, 34, { fill: '#111827', rx: 8 })
    s += txt(W - 132, y0 + 39, 'Tabela de comparação', {
      size: 12.5,
      weight: 600,
      fill: '#fff',
      anchor: 'middle',
    })
  }
  const y = y0 + 96
  MONTHS.forEach(([name, val], i) => {
    const x = MONTH_X0 + i * (MONTH_W + MONTH_GAP)
    const zero = val === 'R$ 0,00'
    const isAug = name === 'AGOSTO'
    const sel = selected.includes(name)
    const fill = sel ? C.green : isAug ? C.darkCard : zero ? C.gray : C.blue
    s += rect(x, y, MONTH_W, MONTH_H, { fill, rx: 6 })
    s += txt(x + MONTH_W / 2, y + 18, name, {
      size: 8.5,
      weight: 700,
      fill: '#fff',
      anchor: 'middle',
    })
    s += txt(x + MONTH_W / 2, y + 38, val, {
      size: 11,
      weight: 700,
      fill: '#fff',
      anchor: 'middle',
    })
    if (sel)
      s +=
        `<circle cx="${x + MONTH_W - 10}" cy="${y + 10}" r="7" fill="#fff"/>` +
        `<path d="M ${x + MONTH_W - 13} ${y + 10} l 2 2.5 l 4.5 -5" stroke="${C.green}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
  })
  s += txt(330, y0 + 180, 'Média de gastos do ano:  R$ 901.188,28', { size: 12.5, fill: C.muted })
  return s
}

function totalsRow(y0) {
  let s = rect(304, y0, 500, 84, { fill: C.darkCard, rx: 12 })
  s += txt(328, y0 + 26, 'De 01/08/2026 até 31/08/2026', { size: 11.5, fill: '#c7c9f2' })
  s += txt(328, y0 + 56, 'R$ 2.129.110,80', { size: 24, weight: 800, fill: '#fff' })
  s += rect(824, y0, 286, 84, { fill: '#fff', stroke: C.border, rx: 12 })
  s += txt(848, y0 + 26, 'PAGO', { size: 11, weight: 700, fill: C.green })
  s += txt(848, y0 + 56, 'R$ 626.018,84', { size: 19, weight: 700 })
  s += rect(1075, y0 + 14, 44, 22, { fill: C.greenSoft, rx: 11 })
  s += txt(1097, y0 + 25.5, '29%', { size: 11, weight: 700, fill: C.green, anchor: 'middle' })
  s += rect(1130, y0, 286, 84, { fill: '#fff', stroke: C.border, rx: 12 })
  s += txt(1154, y0 + 26, 'ABERTO', { size: 11, weight: 700, fill: C.muted })
  s += txt(1154, y0 + 56, 'R$ 1.503.091,96', { size: 19, weight: 700 })
  s += rect(1364, y0 + 14, 44, 22, { fill: C.graySoft, rx: 11 })
  s += txt(1386, y0 + 25.5, '71%', { size: 11, weight: 700, fill: C.muted, anchor: 'middle' })
  return s
}

function reportTable(y0) {
  const ROWS = [
    [
      'OC#11784 - ISAIAS BEZERRA LISBOA',
      'R$ 1.727,85',
      'R$ 0,00',
      'R$ 1.727,85',
      'À vista',
      'BB PARTICIPAÇÃO LTDA',
      '28/08/2026',
    ],
    [
      'OC#11778 - JOAB GONÇALVES SOUSA',
      'R$ 650,00',
      'R$ 35,00',
      'R$ 615,00',
      'À vista',
      'FIGUEIREDO AUTO PEÇAS',
      '28/08/2026',
    ],
    [
      'OC#11770 - JADNA LAYANE MENDES',
      'R$ 1.397,41',
      'R$ 0,00',
      'R$ 1.397,41',
      'À vista',
      'MERCADO LIVRE - ML',
      '28/08/2026',
    ],
  ]
  let s = rect(304, y0, W - 304 - 24, 210, { fill: '#fff', stroke: C.border, rx: 12 })
  s += txt(330, y0 + 30, 'Relatório Financeiro', { size: 15, weight: 700 })
  s += txt(W - 320, y0 + 18, 'Ordenar por', { size: 10, fill: C.muted })
  s += rect(W - 326, y0 + 24, 120, 30, { fill: '#fff', stroke: C.border, rx: 8 })
  s += txt(W - 310, y0 + 39, 'Data maior', { size: 12 })
  s += rect(W - 190, y0 + 22, 96, 34, { fill: '#111827', rx: 8 })
  s += txt(W - 142, y0 + 39, 'Ranking', { size: 12.5, weight: 600, fill: '#fff', anchor: 'middle' })
  const cols = [330, 620, 740, 860, 990, 1080, 1300]
  const heads = [
    'Descrição',
    'Subtotal',
    'Desconto',
    'Valor Total',
    'Parcelas',
    'Fornecedor',
    'Criação',
  ]
  s += rect(316, y0 + 62, W - 340 - 8, 30, { fill: '#f8f9fc' })
  heads.forEach((hh, i) => (s += txt(cols[i], y0 + 77, hh, { size: 12, weight: 700 })))
  ROWS.forEach((r, ri) => {
    const y = y0 + 112 + ri * 36
    r.forEach((cell, ci) => {
      s += txt(cols[ci], y, cell, { size: 11.5, fill: ci === 0 || ci === 5 ? C.text : C.muted })
    })
    s += `<line x1="316" y1="${y + 17}" x2="${W - 40}" y2="${y + 17}" stroke="${C.border}"/>`
  })
  return s
}

const wrap = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">` +
  rect(0, 0, W, H, { fill: C.bg }) +
  body +
  '</svg>'

const overlay = () => rect(0, 0, W, H, { fill: '#0b1024', opacity: 0.55 })

// ---------------------------------------------------------------- telas
const screens = {}

// 01 — home, menu fechado
screens['01-menu-fechado'] = wrap(topbar() + sidebar() + pageHeaderHome())
function pageHeaderHome() {
  let s = rect(304, 88, W - 304 - 24, 120, { fill: '#fff', stroke: C.border, rx: 12 })
  s += txt(330, 132, 'Central de Eventos', { size: 21, weight: 700 })
  s += txt(330, 166, 'Bem-vindo! Selecione um módulo no menu ao lado.', {
    size: 13.5,
    fill: C.muted,
  })
  s += monthsPanelPlaceholder()
  return s
}
function monthsPanelPlaceholder() {
  let s = ''
  for (let i = 0; i < 3; i++) {
    s += rect(304 + i * 380, 240, 356, 140, { fill: '#fff', stroke: C.border, rx: 12 })
    s += rect(328 + i * 380, 264, 40, 40, { fill: C.blueSoft, rx: 10 })
    s += rect(328 + i * 380, 320, 200, 12, { fill: C.graySoft, rx: 6 })
    s += rect(328 + i * 380, 344, 140, 12, { fill: C.graySoft, rx: 6 })
  }
  return s
}

// 02 — menu Relatórios aberto
screens['02-menu-relatorios-aberto'] = wrap(
  topbar() + sidebar({ open: true, active: 'Relatórios' }) + pageHeaderHome(),
)

// 03 — página Financeiro Compras
const financeiroBody = () =>
  topbar() +
  sidebar({ open: true, active: 'Relatórios', subActive: 'Financeiro Compras' }) +
  pageHeader() +
  filterBar() +
  monthsPanel() +
  totalsRow(524) +
  reportTable(628)
screens['03-financeiro-compras'] = wrap(financeiroBody())

// 04 — filtro aberto (painel expande com campo Ano)
screens['04-filtro-aberto'] = wrap(
  topbar() +
    sidebar({ open: true, active: 'Relatórios', subActive: 'Financeiro Compras' }) +
    pageHeader() +
    filterBar({ open: true }) +
    (() => {
      let s = rect(304, 292, W - 304 - 24, 132, { fill: '#fff', stroke: C.border, rx: 12 })
      s += txt(330, 320, 'Ano', { size: 12, weight: 700, fill: C.muted })
      s += rect(330, 334, 220, 44, { fill: '#fff', stroke: C.border, rx: 8 })
      s += txt(350, 356, '2026', { size: 14 })
      s += caret(524, 357, C.muted)
      s += txt(590, 320, 'Fornecedor', { size: 12, weight: 700, fill: C.muted })
      s += rect(590, 334, 260, 44, { fill: '#fff', stroke: C.border, rx: 8 })
      s += txt(610, 356, 'Todos', { size: 14, fill: C.muted })
      s += caret(824, 357, C.muted)
      s += rect(W - 200, 334, 156, 44, { fill: C.blue, rx: 8 })
      s += txt(W - 122, 356, 'Aplicar filtro', {
        size: 14,
        weight: 700,
        fill: '#fff',
        anchor: 'middle',
      })
      return s
    })() +
    monthsPanel({ y0: 444 }) +
    totalsRow(664),
)

// 05 — dropdown de ano aberto
screens['05-ano-dropdown'] = wrap(
  topbar() +
    sidebar({ open: true, active: 'Relatórios', subActive: 'Financeiro Compras' }) +
    pageHeader() +
    filterBar({ open: true }) +
    (() => {
      let s = rect(304, 292, W - 304 - 24, 132, { fill: '#fff', stroke: C.border, rx: 12 })
      s += txt(330, 320, 'Ano', { size: 12, weight: 700, fill: C.muted })
      s += rect(330, 334, 220, 44, { fill: '#fff', stroke: C.blue, sw: 2, rx: 8 })
      s += txt(350, 356, '2026', { size: 14 })
      s += caret(524, 357, C.blue, true)
      // dropdown
      s += rect(330, 384, 220, 150, { fill: '#fff', stroke: C.border, rx: 8 })
      s += txt(350, 410, '2024', { size: 14 })
      s += rect(334, 432, 212, 40, { fill: C.blueSoft, rx: 6 })
      s += txt(350, 452, '2025', { size: 14, weight: 700, fill: C.blue })
      s += txt(350, 500, '2026', { size: 14 })
      return s
    })(),
)

// 06 — modal exportar
screens['06-modal-exportar'] = wrap(
  financeiroBody() +
    overlay() +
    (() => {
      const mx = W / 2 - 260
      const my = H / 2 - 190
      let s = rect(mx, my, 520, 380, { fill: '#fff', rx: 16 })
      s += txt(mx + 40, my + 48, 'Exportar relatório', { size: 20, weight: 700 })
      s += txt(mx + 40, my + 80, 'Escolha o formato do arquivo:', { size: 13.5, fill: C.muted })
      s += rect(mx + 40, my + 110, 200, 110, { fill: '#fff', stroke: C.border, rx: 12 })
      s += txt(mx + 140, my + 152, '📄', { size: 26, anchor: 'middle' })
      s += txt(mx + 140, my + 192, 'PDF', { size: 15, weight: 700, anchor: 'middle' })
      s += rect(mx + 280, my + 110, 200, 110, { fill: C.blueSoft, stroke: C.blue, sw: 2, rx: 12 })
      s += txt(mx + 380, my + 152, '📊', { size: 26, anchor: 'middle' })
      s += txt(mx + 380, my + 192, 'Excel (.xlsx)', {
        size: 15,
        weight: 700,
        fill: C.blue,
        anchor: 'middle',
      })
      s += rect(mx + 40, my + 260, 200, 52, { fill: '#fff', stroke: C.border, rx: 10 })
      s += txt(mx + 140, my + 286, 'Cancelar', {
        size: 14.5,
        weight: 600,
        fill: C.muted,
        anchor: 'middle',
      })
      s += rect(mx + 280, my + 260, 200, 52, { fill: C.blue, rx: 10 })
      s += txt(mx + 380, my + 286, 'Exportar', {
        size: 14.5,
        weight: 700,
        fill: '#fff',
        anchor: 'middle',
      })
      return s
    })(),
)

// 07 — modo comparação (selecionar meses)
screens['07-comparacao'] = wrap(
  topbar() +
    sidebar({ open: true, active: 'Relatórios', subActive: 'Financeiro Compras' }) +
    pageHeader({ exportBtn: false }) +
    (() => {
      let s = rect(304, 228, W - 304 - 24, 56, { fill: C.blueSoft, stroke: C.blue, rx: 12 })
      s += txt(330, 256, 'Modo comparação: selecione 2 meses e clique em Comparar', {
        size: 14,
        weight: 600,
        fill: C.blue,
      })
      s += rect(W - 190, 238, 146, 36, { fill: C.green, rx: 8 })
      s += txt(W - 117, 256, 'Comparar', { size: 14, weight: 700, fill: '#fff', anchor: 'middle' })
      return s
    })() +
    monthsPanel({ y0: 304, compareBtn: false, selected: ['JANEIRO'] }),
)

for (const [name, svg] of Object.entries(screens)) {
  writeFileSync(resolve(OUT, `${name}.svg`), svg)
  console.log('gerado:', `public/prints/${name}.svg`)
}

// ------- coordenadas úteis (em % de 1440x820) para conferência manual -------
const pct = (x, y, w, h) =>
  `x:${((x / W) * 100).toFixed(1)} y:${((y / H) * 100).toFixed(1)} w:${((w / W) * 100).toFixed(1)} h:${((h / H) * 100).toFixed(1)}`
console.log('\n— hotspots de referência (%):')
console.log('menu Relatórios      ', pct(16, SIDEBAR_Y0 + 6 * ITEM_H, 248, 44))
console.log('sub Financeiro Compras', pct(40, SIDEBAR_Y0 + 7 * ITEM_H, 224, 40))
console.log('barra Filtro          ', pct(304, 228, W - 328, 56))
console.log('select Ano (filtro)   ', pct(330, 334, 220, 44))
console.log('opção 2025            ', pct(334, 432, 212, 40))
console.log('botão Exportar        ', pct(W - 190, 104, 146, 40))
console.log('modal Excel           ', pct(W / 2 - 260 + 280, H / 2 - 190 + 110, 200, 110))
console.log('modal Exportar btn    ', pct(W / 2 - 260 + 280, H / 2 - 190 + 260, 200, 52))
console.log('botão Tabela comparação', pct(W - 220, 304 + 22, 176, 34))
console.log('mês JANEIRO           ', pct(MONTH_X0, MONTH_Y, MONTH_W, MONTH_H))
console.log(
  'mês AGOSTO            ',
  pct(MONTH_X0 + 7 * (MONTH_W + MONTH_GAP), MONTH_Y, MONTH_W, MONTH_H),
)
console.log('botão Comparar        ', pct(W - 190, 238, 146, 36))
