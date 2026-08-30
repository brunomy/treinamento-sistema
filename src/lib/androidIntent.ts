// No tablet Android os links do Kommo são interceptados por App Links e abrem o
// aplicativo nativo em vez do navegador. Para forçar o Chrome, trocamos o href
// https:// por uma URL intent:// com package=com.android.chrome. O parâmetro
// S.browser_fallback_url garante que, se o Chrome não estiver instalado, o
// Android abra a URL https original normalmente.

export function ehAndroid(): boolean {
  if (typeof navigator === 'undefined') return false
  return /android/i.test(navigator.userAgent)
}

export function urlParaNavegador(urlHttps: string): string {
  if (!ehAndroid()) return urlHttps

  const url = new URL(urlHttps)
  // url.search é usado como está: os filtros do Kommo já vêm percent-encoded
  // e reencodar quebraria o filtro.
  const alvo = `${url.host}${url.pathname}${url.search}`

  return `intent://${alvo}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(urlHttps)};end`
}
