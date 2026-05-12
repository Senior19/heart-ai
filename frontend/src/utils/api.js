const BASE = import.meta.env.VITE_API_URL || '/api'

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || `HTTP ${res.status}`) }
  return res.json()
}

export const predictHeartDisease = (d) => fetchJSON(`${BASE}/predict/`, { method: 'POST', body: JSON.stringify(d) })
export const compareModels       = (d) => fetchJSON(`${BASE}/compare/`, { method: 'POST', body: JSON.stringify(d) })
export const assessLifestyle     = (d) => fetchJSON(`${BASE}/lifestyle/`, { method: 'POST', body: JSON.stringify(d) })
export const calculateBMI        = (d) => fetchJSON(`${BASE}/bmi/calculate`, { method: 'POST', body: JSON.stringify(d) })
export const saveHistory         = (d) => fetchJSON(`${BASE}/history/save`, { method: 'POST', body: JSON.stringify(d) })
export const getHistory          = ()  => fetchJSON(`${BASE}/history/all`)
export const deleteHistory       = (id) => fetchJSON(`${BASE}/history/${id}`, { method: 'DELETE' })
export const clearHistory        = ()  => fetchJSON(`${BASE}/history/clear/all`, { method: 'DELETE' })
export const checkHealth         = ()  => fetchJSON(`${BASE}/health`)

export async function downloadReport(data) {
  const res = await fetch(`${BASE}/report/pdf`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Report generation failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url
  a.download = `heartai_report_${Date.now()}.pdf`; a.click()
  URL.revokeObjectURL(url)
}
