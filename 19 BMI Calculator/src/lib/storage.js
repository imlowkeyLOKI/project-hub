const KEY = 'bmi_app_state'

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    if (!['imperial', 'metric'].includes(data.unit)) return null
    if (typeof data.form !== 'object') return null
    return data
  } catch {
    return null
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {}
}

export function clear() {
  try {
    localStorage.removeItem(KEY)
  } catch {}
}
