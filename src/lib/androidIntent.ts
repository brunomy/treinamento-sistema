// No tablet Android os links do Kommo são interceptados por App Links e abrem o
// aplicativo nativo em vez do navegador. Para forçar o Chrome, trocamos o href
// https:// por uma URL intent:// com package=com.android.chrome. O parâmetro
// S.browser_fallback_url garante que, se o Chrome não estiver instalado, o
// Android abra a URL https original normalmente.

// O TypeScript padrao ainda nao conhece navigator.userAgentData (User-Agent
// Client Hints), entao declaramos uma interface local em vez de usar any.
interface NavigatorComUAData extends Navigator {
  userAgentData?: { platform?: string }
}

export function ehAndroid(): boolean {
  if (typeof navigator === 'undefined') return false

  // 1) Client Hints e a fonte mais confiavel: nao muda no modo "site para
  // computador", diferente do user agent.
  const uaData = (navigator as NavigatorComUAData).userAgentData
  if (uaData && typeof uaData.platform === 'string') {
    return uaData.platform === 'Android'
  }

  const ua = navigator.userAgent

  // 2) Caso classico: user agent normal do Android.
  if (/android/i.test(ua)) return true

  // 3) Heuristica para tablet Android com "site para computador" ativado
  // (comum nos Samsung Galaxy Tab): o user agent perde a palavra "android" e
  // passa a se parecer com um desktop Linux. Nesse caso combinamos multitoque
  // + "linux" no user agent.
  // O X11 e excluido de proposito: desktops Linux enviam "X11; Linux x86_64" e
  // nao devem virar falso positivo quando tem tela sensivel ao toque.
  const temMultitoque = navigator.maxTouchPoints > 1
  const pareceLinux = /linux/i.test(ua)
  const pareceDesktop = /windows|macintosh|cros|x11/i.test(ua)

  return temMultitoque && pareceLinux && !pareceDesktop
}

export function urlParaNavegador(urlHttps: string): string {
  if (!ehAndroid()) return urlHttps

  const url = new URL(urlHttps)
  // url.search é usado como está: os filtros do Kommo já vêm percent-encoded
  // e reencodar quebraria o filtro.
  const alvo = `${url.host}${url.pathname}${url.search}`

  return `intent://${alvo}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(urlHttps)};end`
}
