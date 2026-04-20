export function resolveText(value, lang = 'zh') {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return value[lang] ?? value.zh ?? value.en ?? ''
}
