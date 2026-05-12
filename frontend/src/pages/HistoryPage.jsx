import { useState, useEffect } from 'react'
import { Clock, Trash2, RefreshCw, User } from 'lucide-react'
import { getHistory, deleteHistory, clearHistory } from '../utils/api'

export default function HistoryPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    try { const r = await getHistory(); setRecords(r.data || []) }
    catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    try { await deleteHistory(id); setRecords(r => r.filter(x => x.id !== id)) }
    catch (e) { alert('Delete failed') }
  }

  const handleClear = async () => {
    if (!confirm('Clear all history?')) return
    try { await clearHistory(); setRecords([]) }
    catch (e) { alert('Clear failed') }
  }

  const riskBadge = (level) => {
    if (level === 'Low Risk') return 'badge-green'
    if (level === 'Medium Risk') return 'badge-orange'
    return 'badge-red'
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Clock className="w-6 h-6 text-rose-500" /> Patient History
          </h1>
          <p className="muted mt-1">All saved prediction records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-outline"><RefreshCw className="w-4 h-4" /> Refresh</button>
          {records.length > 0 && (
            <button onClick={handleClear} className="btn-outline text-red-500 border-red-200 hover:bg-red-50">
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-40">
          <span className="w-6 h-6 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
      )}

      {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>}

      {!loading && records.length === 0 && (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">📋</div>
          <div className="font-semibold text-slate-700">No records yet</div>
          <p className="muted mt-1">Run a prediction and click "Save Record" to store it here.</p>
        </div>
      )}

      {!loading && records.length > 0 && (
        <div className="space-y-3">
          {[...records].reverse().map(rec => (
            <div key={rec.id} className="card p-4 flex items-center gap-4 fade-in hover:border-rose-100 transition-all">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-800">{rec.patient_name || 'Anonymous'}</span>
                  <span className={riskBadge(rec.risk_level)}>{rec.risk_level}</span>
                </div>
                <div className="flex gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-slate-400">Age: <span className="text-slate-600">{rec.age}</span></span>
                  <span className="text-xs text-slate-400">BP: <span className="text-slate-600">{rec.resting_bp} mmHg</span></span>
                  <span className="text-xs text-slate-400">Chol: <span className="text-slate-600">{rec.cholesterol} mg/dL</span></span>
                  <span className="text-xs text-slate-400">{rec.timestamp}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-center">
                  <div className={`text-xl font-bold ${rec.risk_level==='Low Risk'?'text-emerald-600':rec.risk_level==='Medium Risk'?'text-amber-600':'text-red-600'}`}>
                    {rec.risk_score}
                  </div>
                  <div className="text-xs text-slate-400">score</div>
                </div>
                <button onClick={() => handleDelete(rec.id)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && records.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">{records.length}</div>
            <div className="text-xs text-slate-400 mt-0.5">Total Records</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-rose-600">
              {records.filter(r => r.risk_level === 'High Risk').length}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">High Risk</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">
              {records.length ? Math.round(records.reduce((a, r) => a + r.risk_score, 0) / records.length) : 0}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Avg Score</div>
          </div>
        </div>
      )}
    </div>
  )
}
