/**
 * Conteudos que a equipe usa com frequencia na conversa com o lead.
 *
 * Estao em dois grupos porque o navegador so aceita texto e imagem na area
 * de transferencia: PDF e video sao recusados (NotAllowedError), entao esses
 * viram download em vez de copia.
 */

export interface AtalhoTexto {
  id: string
  label: string
  /** conteudo copiado literalmente, incluindo quebras de linha */
  texto: string
}

export interface AtalhoArquivo {
  id: string
  label: string
  /** caminho servido a partir de public/ */
  url: string
  /** nome sugerido no download */
  nomeArquivo: string
}

export const ATALHOS_COPIAR: AtalhoTexto[] = [
  {
    id: 'localizacao',
    label: 'Localização',
    texto: 'https://maps.app.goo.gl/B376S4V8hrnyFixr9',
  },
  {
    id: 'instagram',
    label: 'Instagram Dr Douglas',
    texto:
      'https://www.instagram.com/dr_douglasvinicius?igsh=b3dkODVsYmZ4YWJ0&igsi=b3dkODVsYmZ4YWJ0',
  },
  {
    id: 'formulario',
    label: 'Formulário de cadastro',
    texto: 'Podemos seguir com esse formulário? \nhttps://douglas63.yayforms.link/yGmqaxw',
  },
  {
    id: 'valores',
    label: 'Mensagem de valores',
    texto:
      'O valor da consulta é R$850,00 reais \nSe você pagar no momento do agendamento é R$500,00 reais\nE se quiser deixar pro dia da consulta fica R$850,00 com um sinal de R$150,00 reais.',
  },
]

export const ATALHOS_DOWNLOAD: AtalhoArquivo[] = [
  {
    id: 'pdf-apresentacao',
    label: 'PDF apresentação',
    url: '/assets/dvs-apresentacao.pdf',
    nomeArquivo: 'DVS Experience - Apresentacao.pdf',
  },
  {
    id: 'video-apresentacao',
    label: 'Vídeo apresentação',
    url: '/assets/dvs-apresentacao.mp4',
    nomeArquivo: 'DVS Experience - Apresentacao.mp4',
  },
]
