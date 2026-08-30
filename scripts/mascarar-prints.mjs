/**
 * Mascara dados pessoais nos prints do Kommo (LGPD).
 *
 * Aplica blur destrutivo (grava por cima do PNG) nas regioes que contem
 * nomes, telefones, fotos de perfil, trechos de mensagem e metricas
 * comerciais do cliente. Preserva a estrutura da UI para o tutorial.
 *
 * Os originais sao copiados para ORIGINAIS_DIR (fora do repo) antes.
 *
 * Uso:  node scripts/mascarar-prints.mjs
 *       node scripts/mascarar-prints.mjs --dry   (so lista, nao grava)
 */
import { readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const PRINTS_DIR = path.resolve('public/prints/kommo')
const ORIGINAIS_DIR = path.resolve('../meu-app-prints-originais/kommo')
const SIGMA = 20 // intensidade do desfoque

/**
 * Repete um conjunto de blocos para cada card de uma lista.
 * @param {number[]} tops topo de cada card
 * @param {number[][]} blocos [x, dy, largura, altura] — dy relativo ao topo
 */
function cards(tops, blocos) {
  return tops.flatMap((top) => blocos.map(([x, dy, w, h]) => [x, top + dy, w, h]))
}

/** Card do kanban de leads: avatar + telefone/nome + previa da mensagem. */
const CARD_LEAD = [
  [104, 5, 42, 42], // avatar
  [146, 6, 180, 56], // "de: <telefone>" + nome do lead
  [146, 56, 240, 32], // previa da mensagem
]

/** Card do kanban de leads, recortado pelo painel de filtro sobreposto. */
const CARD_LEAD_ESTREITO = [
  [104, 5, 42, 42],
  [146, 6, 120, 56],
  [146, 56, 120, 32],
]

/** Card da coluna "Conversas iniciadas": avatar + nome (o "Lead #" pode ficar). */
const CARD_CONVERSA = [
  [438, 6, 40, 40], // avatar
  [478, 4, 250, 26], // nome do contato
]

/** Item da lista de conversas (inbox): avatar + 2a linha (nome + mensagem). */
const ITEM_INBOX = [
  [88, 6, 36, 36], // avatar
  [134, 32, 296, 48], // nome do contato + previa da mensagem
]

const TOPS_INBOX = [140, 222, 305, 388, 470, 553]

/**
 * Regioes por imagem: [x, y, largura, altura]
 * Coordenadas na resolucao original dos prints (1058 x 663).
 */
const REGIOES = {
  'k01-leads.png': [
    [613, 18, 178, 32], // 3662 leads: R$637.850
    [255, 100, 120, 30], // sem tarefas atribuidas: 1790
    [905, 100, 120, 30], // vendas em potencial
    [200, 178, 120, 22], // solicitacoes: 1872
    [520, 178, 130, 22], // 1261 leads: R$249.450
    [845, 178, 120, 22], // 2 leads: R$0
    ...cards([213, 300, 387, 474, 561, 645], CARD_LEAD),
    ...cards([275, 355, 435, 510, 585], CARD_CONVERSA),
    ...cards([218, 292], [
      [755, 4, 40, 40],
      [800, 2, 200, 26],
    ]),
  ],
  'k02-filtro.png': [
    [600, 18, 178, 32],
    ...cards([213, 300, 387, 474, 561, 645], CARD_LEAD_ESTREITO),
    [438, 592, 40, 40], // avatar do card no rodape
    [478, 590, 200, 26], // nome do card no rodape
  ],
  'k03-filtro-aplicar.png': [
    [490, 18, 178, 32],
    ...cards([213, 300, 387, 474, 561, 645], CARD_LEAD_ESTREITO),
    [438, 592, 40, 40],
    [478, 590, 200, 26],
  ],
  'k04-lista-filtrada.png': [
    [655, 18, 114, 32], // 92 leads: R$0
    [225, 98, 60, 22], // solicitacoes: 17
    [520, 98, 130, 22], // 74 leads: R$0
    [845, 98, 120, 22], // 0 leads: R$0
    ...cards([139, 213, 287, 361, 435, 509, 583, 650], CARD_LEAD),
    ...cards([139, 213, 287, 361, 435, 509, 583, 650], CARD_CONVERSA),
  ],
  'k05-filtro-data.png': [
    [655, 18, 114, 32],
    ...cards([139, 213, 287, 361, 435, 509, 583, 650], CARD_LEAD_ESTREITO),
    [438, 585, 40, 40],
    [478, 583, 200, 26],
  ],
  'k06-data-hoje.png': [
    [655, 18, 114, 32],
    ...cards([139, 213, 287, 361, 435, 509, 583, 650], CARD_LEAD_ESTREITO),
    [438, 585, 40, 40],
    [478, 583, 200, 26],
  ],
  'k07-data-aplicar.png': [
    [655, 18, 114, 32],
    ...cards([139, 213, 287, 361, 435, 509, 583, 650], CARD_LEAD_ESTREITO),
    [438, 585, 40, 40],
    [478, 583, 200, 26],
  ],
  'k08-chat-aceitar.png': [
    ...cards(TOPS_INBOX, ITEM_INBOX),
    [466, 292, 42, 42], // avatar no painel do lead
    [512, 292, 180, 24], // nome do lead
    [512, 314, 120, 20], // telefone (badge)
    [568, 376, 210, 24], // telefone comercial
    [800, 0, 258, 60], // mensagem no topo da timeline
    [910, 186, 148, 24], // telefone no cabecalho da conversa
    [806, 262, 252, 88], // avatar + mensagem (nome + conteudo)
    [1010, 122, 48, 24], // nome truncado na linha do robo
    [880, 612, 178, 32], // nome no rodape "Bate-papo com ..."
  ],
  'k09-chat-adicionar-tags.png': [
    ...cards(TOPS_INBOX, ITEM_INBOX),
    [568, 206, 204, 24], // usuario responsavel
    [466, 292, 42, 42],
    [512, 292, 180, 24],
    [512, 314, 120, 20],
    [568, 376, 210, 24],
    [806, 262, 252, 88],
    [880, 612, 178, 32],
  ],
  // k10: o painel do lead esta coberto pelo dropdown de tags — nao borrar ali
  'k10-chat-tag-valeria.png': [
    ...cards(TOPS_INBOX, ITEM_INBOX),
    [806, 262, 252, 88],
    [880, 612, 178, 32],
  ],
  'k12-chat-mensagem.png': [
    ...cards(TOPS_INBOX, ITEM_INBOX),
    [466, 150, 44, 44], // avatar na timeline
    [592, 118, 290, 24], // "Hoje 13:29 <nome>"
    [612, 262, 446, 52], // linhas de log com nome do usuario
    [560, 610, 320, 32], // rodape "Bate-papo com ..."
  ],
  'k13-chat-etapa-fechada.png': [
    ...cards(TOPS_INBOX, ITEM_INBOX),
    [466, 292, 42, 42],
    [512, 292, 180, 24],
    [512, 314, 120, 20],
    [568, 376, 210, 24],
    [910, 130, 148, 24], // telefone no cabecalho da conversa
    [806, 190, 252, 88], // avatar + mensagem
    [935, 148, 123, 22], // nome acima da mensagem
    [975, 302, 83, 24], // nome truncado na linha do robo
    [900, 582, 158, 30], // rodape "Bate-papo com ..."
  ],
  // k14: o painel do lead esta coberto pelo dropdown de etapas — nao borrar ali
  'k14-chat-etapa-aberta.png': [
    ...cards(TOPS_INBOX, ITEM_INBOX),
    [568, 376, 210, 24],
    [910, 130, 148, 24],
    [806, 190, 252, 88],
    [935, 148, 123, 22],
    [975, 302, 83, 24],
    [900, 582, 158, 30],
  ],
}

const seco = process.argv.includes('--dry')
const MASCARAS_JSON = path.resolve('scripts/mascaras.json')

async function existe(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/** Recorta cada regiao, desfoca e cola de volta na imagem. */
async function mascarar(arquivo, regioes) {
  const origem = path.join(PRINTS_DIR, arquivo)
  // parte sempre do original preservado, para o script ser idempotente
  const backup = path.join(ORIGINAIS_DIR, arquivo)
  const fonte = (await existe(backup)) ? backup : origem
  const buffer = await readFile(fonte)
  const base = sharp(buffer)
  const { width, height } = await base.metadata()

  const camadas = []
  for (const [x, y, w, h] of regioes) {
    const left = Math.max(0, Math.min(Math.round(x), width - 1))
    const top = Math.max(0, Math.min(Math.round(y), height - 1))
    const largura = Math.min(Math.round(w), width - left)
    const altura = Math.min(Math.round(h), height - top)
    if (largura < 1 || altura < 1) continue

    const recorte = await sharp(buffer)
      .extract({ left, top, width: largura, height: altura })
      .blur(SIGMA)
      .png()
      .toBuffer()

    camadas.push({ input: recorte, left, top })
  }

  const saida = await base.composite(camadas).png().toBuffer()
  if (!seco) await writeFile(origem, saida)
  return camadas.length
}

async function main() {
  // scripts/mascaras.json (exportado por /mascarar.html) tem prioridade
  let mapa = REGIOES
  if (await existe(MASCARAS_JSON)) {
    mapa = JSON.parse(await readFile(MASCARAS_JSON, 'utf8'))
    console.log('Usando regioes de scripts/mascaras.json\n')
  } else {
    console.log('Usando regioes padrao do script (sem scripts/mascaras.json)\n')
  }

  if (!seco) await mkdir(ORIGINAIS_DIR, { recursive: true })

  for (const [arquivo, regioes] of Object.entries(mapa)) {
    const origem = path.join(PRINTS_DIR, arquivo)
    if (!(await existe(origem))) {
      console.warn(`  ! nao encontrado: ${arquivo}`)
      continue
    }

    if (!seco) {
      const backup = path.join(ORIGINAIS_DIR, arquivo)
      if (!(await existe(backup))) await copyFile(origem, backup)
    }

    const n = await mascarar(arquivo, regioes)
    console.log(`  ${seco ? '[dry] ' : ''}${arquivo} -> ${n} regioes mascaradas`)
  }

  console.log(
    seco ? '\nNada foi gravado (--dry).' : `\nOriginais preservados em: ${ORIGINAIS_DIR}`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
