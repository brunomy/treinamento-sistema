/**
 * Atalhos de atendimento: conteudos que a equipe cola com frequencia na
 * conversa com o lead. Cada item copia um texto para a area de
 * transferencia, ou entrega um arquivo (o navegador nao permite copiar
 * PDF/video para a area de transferencia, entao esses caem no download).
 */

export interface AtalhoTexto {
  id: string
  label: string
  tipo: 'texto'
  /** conteudo copiado literalmente, incluindo quebras de linha */
  texto: string
}

export interface AtalhoArquivo {
  id: string
  label: string
  tipo: 'arquivo'
  /** caminho servido a partir de public/ */
  url: string
  /** nome sugerido no download */
  nomeArquivo: string
  mime: string
}

export type Atalho = AtalhoTexto | AtalhoArquivo

export const ATALHOS_ATENDIMENTO: Atalho[] = [
  {
    id: 'localizacao',
    label: 'Localização',
    tipo: 'texto',
    texto: 'https://maps.app.goo.gl/B376S4V8hrnyFixr9',
  },
  {
    id: 'pdf-apresentacao',
    label: 'PDF apresentação',
    tipo: 'arquivo',
    url: '/assets/dvs-apresentacao.pdf',
    nomeArquivo: 'DVS Experience - Apresentacao.pdf',
    mime: 'application/pdf',
  },
  {
    id: 'video-apresentacao',
    label: 'Vídeo apresentação',
    tipo: 'arquivo',
    url: '/assets/dvs-apresentacao.mp4',
    nomeArquivo: 'DVS Experience - Apresentacao.mp4',
    mime: 'video/mp4',
  },
  {
    id: 'instagram',
    label: 'Instagram Dr Douglas',
    tipo: 'texto',
    texto:
      'https://www.instagram.com/dr_douglasvinicius?igsh=b3dkODVsYmZ4YWJ0&igsi=b3dkODVsYmZ4YWJ0',
  },
  {
    id: 'formulario',
    label: 'Formulário de cadastro',
    tipo: 'texto',
    texto: 'Podemos seguir com esse formulário? \nhttps://douglas63.yayforms.link/yGmqaxw',
  },
  {
    id: 'valores',
    label: 'Mensagem de valores',
    tipo: 'texto',
    texto:
      'O valor da consulta é R$850,00 reais \nSe você pagar no momento do agendamento é R$500,00 reais\nE se quiser deixar pro dia da consulta fica R$850,00 com um sinal de R$150,00 reais.',
  },
]
