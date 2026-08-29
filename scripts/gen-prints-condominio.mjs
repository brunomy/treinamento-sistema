/**
 * Gera prints-placeholder (SVG) do "Condominio App" (tela de Encomendas)
 * em public/prints/condominio/. Mesmo esquema do gen-prints.mjs: ao receber
 * os prints reais, troque os arquivos e ajuste as coordenadas em guides.ts.
 *
 * Rodar: npm run gen:prints:condominio
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/prints/condominio')
mkdirSync(OUT, { recursive: true })

const W = 1440
const H = 820
const FONT = 'Segoe UI, Roboto, Helvetica, Arial, sans-serif'

const C = {
  side: '#23214f',
  sideSoft: 'rgba(255,255,255,0.72)',
  indigo: '#4f46e5',
  indigoSoft: '#eef2ff',
  bg: '#f6f7fb',
  card: '#ffffff',
  border: '#e5e7f0',
  text: '#1f2433',
  muted: '#8a90a5',
  amber: '#b45309',
  amberBorder: '#f59e0b',
  amberSoft: '#fef3c7',
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

const circle = (cx, cy, r, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`

const MENU = [
  'Dashboard',
  'Moradores',
  'Portaria',
  'Encomendas',
  'Comunicados',
  'Veículos',
  'Garagem',
  'Unidades',
  'Configuração',
]

const MENU_Y0 = 110
const MENU_H = 46

function sidebar(active) {
  let s = rect(0, 0, 252, H, { fill: C.side })
  s += circle(38, 40, 17, 'rgba(255,255,255,0.15)')
  s += txt(66, 40, 'Condomínio App', { size: 16, weight: 700, fill: '#fff' })
  MENU.forEach((label, i) => {
    const y = MENU_Y0 + i * MENU_H
    const on = label === active
    if (on) s += rect(12, y, 228, 40, { fill: C.indigo, rx: 10 })
    s += rect(26, y + 12, 16, 16, { fill: on ? '#fff' : C.sideSoft, rx: 4, opacity: on ? 1 : 0.5 })
    s += txt(54, y + 20.5, label, {
      size: 14,
      weight: on ? 700 : 500,
      fill: on ? '#fff' : C.sideSoft,
    })
  })
  return s
}

function topbar(title, subtitle) {
  let s = txt(284, 30, title, { size: 22, weight: 700 })
  s += txt(284, 58, subtitle, { size: 13, fill: C.muted })
  s += circle(1236, 40, 16, '#eef0f6')
  s += txt(1236, 41, '☾', { size: 13, anchor: 'middle', fill: C.muted })
  s += rect(1264, 22, 160, 36, { fill: '#eef0f6', rx: 18 })
  s += rect(1272, 28, 24, 24, { fill: C.indigo, rx: 6 })
  s += txt(1284, 41, 'EC', { size: 10, weight: 700, fill: '#fff', anchor: 'middle' })
  s += txt(1304, 41, 'Ernandes Campos', { size: 12, weight: 600 })
  return s
}

function filters() {
  let s = ''
  const f = (x, w, label) =>
    rect(x, 104, w, 40, { fill: '#fff', stroke: C.border, rx: 8 }) +
    txt(x + 14, 125, label, { size: 12.5, fill: C.muted })
  s += f(284, 180, '🔍 Destinatário...')
  s += f(476, 140, 'Apartamento...')
  s += f(628, 100, 'Entregue: Não')
  s += f(740, 140, 'Chegada  dd/mm')
  s += rect(892, 104, 80, 40, { fill: '#fff', stroke: C.border, rx: 8 })
  s += txt(932, 125, '✕ Limpar', { size: 12, weight: 600, fill: '#d64545', anchor: 'middle' })
  s += rect(1120, 104, 120, 40, { fill: '#fff', stroke: C.border, rx: 8 })
  s += txt(1180, 125, '✎ Editar dados', { size: 12.5, weight: 600, anchor: 'middle' })
  s += rect(1252, 104, 172, 40, { fill: C.indigo, rx: 8 })
  s += txt(1338, 125, '+ Nova encomenda', { size: 13, weight: 700, fill: '#fff', anchor: 'middle' })
  return s
}

const ROWS = [
  ['BL', 'Beatriz Lizarda Moreira', 'Bloco A · 6º Andar · Apto 611', '29/08/2026 às 15:37'],
  ['TC', 'Tereza Cristina de Menezes', 'Bloco A · 14º Andar · Apto 1406', '29/08/2026 às 15:36'],
  ['TC', 'Tereza Cristina de Menezes', 'Bloco A · 14º Andar · Apto 1406', '29/08/2026 às 15:34'],
  ['PR', 'Palloma Regina dos Santos Cruz', 'Bloco B · 7º Andar · Apto 706', '29/08/2026 às 15:33'],
  ['LM', 'Leiliane Marques Do Nascimento', 'Bloco A · 1º Andar · Apto 109', '29/08/2026 às 15:31'],
  ['JN', 'Juliana Neves Almeida', 'Bloco A · 12º Andar · Apto 1206', '29/08/2026 às 15:30'],
  ['LR', 'Larissa Rodrigues Silva', 'Bloco A · 2º Andar · Apto 205', '29/08/2026 às 15:29'],
  ['GC', 'Guilherme Correira Dutra', 'Bloco A · 13º Andar · Apto 1306', '29/08/2026 às 15:28'],
]

function table() {
  let s = rect(284, 164, 1140, 640, { fill: '#fff', stroke: C.border, rx: 12 })
  s += rect(284, 164, 1140, 34, { fill: '#f8f9fc', rx: 12 })
  s += rect(284, 186, 1140, 12, { fill: '#f8f9fc' })
  s += txt(316, 181, 'Destinatário', { size: 12, weight: 700, fill: C.muted })
  s += txt(700, 181, 'Foto', { size: 12, weight: 700, fill: C.muted })
  s += txt(800, 181, 'Chegada', { size: 12, weight: 700, fill: C.muted })
  s += txt(1010, 181, 'Entrega', { size: 12, weight: 700, fill: C.muted })
  s += txt(1150, 181, 'Por', { size: 12, weight: 700, fill: C.muted })
  ROWS.forEach(([ini, name, sub, when], i) => {
    const y = 202 + i * 72
    s += circle(336, y + 36, 20, C.indigo)
    s += txt(336, y + 37, ini, { size: 12, weight: 700, fill: '#fff', anchor: 'middle' })
    s += txt(368, y + 26, name, { size: 14, weight: 600 })
    s += txt(368, y + 48, sub, { size: 12, fill: C.muted })
    s += rect(700, y + 16, 44, 40, { fill: '#d8dbe6', rx: 6 })
    s += txt(800, y + 36, when, { size: 13, fill: C.muted })
    s += txt(1010, y + 36, 'Pendente', { size: 13, fill: C.muted })
    s += txt(1150, y + 36, 'Portaria Vila Rica', { size: 13 })
    s += rect(1300, y + 18, 100, 36, { fill: C.amberSoft, stroke: C.amberBorder, rx: 8 })
    s += txt(1350, y + 37, 'Entregar', { size: 13, weight: 600, fill: C.amber, anchor: 'middle' })
    if (i < ROWS.length - 1)
      s += `<line x1="300" y1="${y + 72}" x2="1408" y2="${y + 72}" stroke="${C.border}"/>`
  })
  return s
}

const wrap = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">` +
  rect(0, 0, W, H, { fill: C.bg }) +
  body +
  '</svg>'

const overlay = () => rect(0, 0, W, H, { fill: '#12102e', opacity: 0.55 })

const screens = {}

// c01 — dashboard (ponto de partida)
screens['c01-dashboard'] = wrap(
  sidebar('Dashboard') +
    topbar('Dashboard', 'Visão geral do condomínio') +
    [0, 1, 2]
      .map((i) => {
        let s = rect(284 + i * 390, 104, 366, 150, { fill: '#fff', stroke: C.border, rx: 12 })
        s += rect(308 + i * 390, 128, 40, 40, { fill: C.indigoSoft, rx: 10 })
        s += rect(308 + i * 390, 186, 200, 12, { fill: '#eceef5', rx: 6 })
        s += rect(308 + i * 390, 210, 140, 12, { fill: '#eceef5', rx: 6 })
        return s
      })
      .join(''),
)

// c02 — lista de encomendas
const listaBody = () =>
  sidebar('Encomendas') +
  topbar('Encomendas', 'Controle de encomendas do condomínio') +
  filters() +
  table()
screens['c02-lista-encomendas'] = wrap(listaBody())

// c03 — modal confirmar entrega
screens['c03-confirmar-entrega'] = wrap(
  listaBody() +
    overlay() +
    (() => {
      const mx = W / 2 - 240
      const my = H / 2 - 150
      let s = rect(mx, my, 480, 300, { fill: '#fff', rx: 16 })
      s += txt(mx + 40, my + 46, 'Confirmar entrega', { size: 20, weight: 700 })
      s += circle(mx + 60, my + 106, 20, C.indigo)
      s += txt(mx + 60, my + 107, 'BL', { size: 12, weight: 700, fill: '#fff', anchor: 'middle' })
      s += txt(mx + 92, my + 98, 'Beatriz Lizarda Moreira', { size: 15, weight: 600 })
      s += txt(mx + 92, my + 120, 'Bloco A · 6º Andar · Apto 611', { size: 12.5, fill: C.muted })
      s += txt(mx + 40, my + 164, 'A encomenda será marcada como entregue ao morador.', {
        size: 13,
        fill: C.muted,
      })
      s += rect(mx + 40, my + 210, 180, 52, { fill: '#fff', stroke: C.border, rx: 10 })
      s += txt(mx + 130, my + 236, 'Cancelar', {
        size: 14,
        weight: 600,
        fill: C.muted,
        anchor: 'middle',
      })
      s += rect(mx + 260, my + 210, 180, 52, { fill: C.indigo, rx: 10 })
      s += txt(mx + 350, my + 236, 'Confirmar entrega', {
        size: 14,
        weight: 700,
        fill: '#fff',
        anchor: 'middle',
      })
      return s
    })(),
)

// c04 — modal nova encomenda
screens['c04-nova-encomenda'] = wrap(
  listaBody() +
    overlay() +
    (() => {
      const mx = W / 2 - 260
      const my = H / 2 - 210
      let s = rect(mx, my, 520, 420, { fill: '#fff', rx: 16 })
      s += txt(mx + 40, my + 46, 'Nova encomenda', { size: 20, weight: 700 })
      const field = (y, label, value) =>
        txt(mx + 40, y - 10, label, { size: 12, weight: 700, fill: C.muted }) +
        rect(mx + 40, y, 440, 44, { fill: '#fff', stroke: C.border, rx: 8 }) +
        txt(mx + 56, y + 22, value, { size: 13.5, fill: C.muted })
      s += field(my + 90, 'Destinatário', 'Buscar morador...')
      s += field(my + 164, 'Apartamento', 'Selecionar...')
      s += txt(mx + 40, my + 228, 'Foto do pacote', { size: 12, weight: 700, fill: C.muted })
      s += rect(mx + 40, my + 238, 440, 80, {
        fill: '#f8f9fc',
        stroke: C.border,
        rx: 8,
        sw: 1.5,
      })
      s += txt(mx + 260, my + 278, '📷  Tirar foto ou arrastar arquivo', {
        size: 13,
        fill: C.muted,
        anchor: 'middle',
      })
      s += rect(mx + 40, my + 340, 200, 52, { fill: '#fff', stroke: C.border, rx: 10 })
      s += txt(mx + 140, my + 366, 'Cancelar', {
        size: 14,
        weight: 600,
        fill: C.muted,
        anchor: 'middle',
      })
      s += rect(mx + 280, my + 340, 200, 52, { fill: C.indigo, rx: 10 })
      s += txt(mx + 380, my + 366, 'Salvar', {
        size: 14,
        weight: 700,
        fill: '#fff',
        anchor: 'middle',
      })
      return s
    })(),
)

for (const [name, svg] of Object.entries(screens)) {
  writeFileSync(resolve(OUT, `${name}.svg`), svg)
  console.log('gerado:', `public/prints/condominio/${name}.svg`)
}

const pct = (x, y, w, h) =>
  `x:${((x / W) * 100).toFixed(1)} y:${((y / H) * 100).toFixed(1)} w:${((w / W) * 100).toFixed(1)} h:${((h / H) * 100).toFixed(1)}`
console.log('\n— hotspots de referência (%):')
console.log('menu Encomendas       ', pct(12, MENU_Y0 + 3 * MENU_H, 228, 40))
console.log('Entregar (1a linha)   ', pct(1300, 202 + 18, 100, 36))
console.log('+ Nova encomenda      ', pct(1252, 104, 172, 40))
console.log('Confirmar entrega     ', pct(W / 2 - 240 + 260, H / 2 - 150 + 210, 180, 52))
console.log('campo Destinatário    ', pct(W / 2 - 260 + 40, H / 2 - 210 + 90, 440, 44))
console.log('Salvar (nova)         ', pct(W / 2 - 260 + 280, H / 2 - 210 + 340, 200, 52))
