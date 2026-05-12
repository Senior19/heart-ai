import { ArrowLeft, Download, Save } from 'lucide-react'
import RiskGauge from '../components/RiskGauge'
import ShapChart from '../components/ShapChart'
import ModelComparison from '../components/ModelComparison'
import Recommendations from '../components/Recommendations'
import HealthDashboard from '../components/HealthDashboard'
import { downloadReport, saveHistory } from '../utils/api'
import { useState } from 'react'

export default function ResultsPage({ result, comparisons, patientData, onBack }) {
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [name, setName] = useState('')

  if (!result) return (
    <div className="flex flex-col items-center justify-center h-80 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <span className="text-2xl">🫀</span>
      </div>
      <h3 className="font-semibold text-slate-800 text-lg">No results yet</h3>
      <p className="muted mt-1">Run an analysis from the Predict tab first.</p>
      <button onClick={onBack} className="btn-red mt-5">Go to Predict</button>
    </div>
  )

  const { risk_score, risk_level, top_factors, recommendations, model_used } = result

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveHistory({
        patient_name: name || 'Anonymous',
        age: patientData.age, gender: patientData.gender,
        risk_score, risk_level,
        cholesterol: patientData.cholesterol,
        resting_bp: patientData.resting_bp,
        max_heart_rate: patientData.max_heart_rate,
      })
      setSavedMsg('✓ Saved to history')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch(e) { setSavedMsg('Save failed') }
    setSaving(false)
  }

  const handleDownload = async () => {
    try {
      await downloadReport({
        patient_name: name || 'Anonymous',
        age: patientData.age, gender: patientData.gender,
        risk_score, risk_level,
        cholesterol: patientData.cholesterol,
        resting_bp: patientData.resting_bp,
        max_heart_rate: patientData.max_heart_rate,
        st_depression: patientData.st_depression,
        vessels_colored: patientData.vessels_colored,
        top_factors, recommendations,
      })
    } catch(e) { alert('PDF download failed. Check backend.') }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Prediction Results</h1>
          <p className="muted mt-0.5">Model: <span className="font-medium text-slate-700">{model_used}</span></p>
        </div>
        <button onClick={onBack} className="btn-outline"><ArrowLeft className="w-4 h-4" /> New Analysis</button>
      </div>

      {/* Patient name + actions */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <input className="input flex-1 min-w-40" placeholder="Patient name (optional)"
          value={name} onChange={e => setName(e.target.value)} />
        <button onClick={handleSave} disabled={saving} className="btn-outline">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Record'}
        </button>
        <button onClick={handleDownload} className="btn-red">
          <Download className="w-4 h-4" /> Download PDF
        </button>
        {savedMsg && <span className="text-sm text-emerald-600 font-medium">{savedMsg}</span>}
      </div>

      {/* Risk gauge + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RiskGauge score={risk_score} level={risk_level} />
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          <div className="card p-4">
            <div className="text-xs text-slate-400 mb-1">Probability</div>
            <div className="text-3xl font-bold text-slate-800">{(result.probability*100).toFixed(1)}%</div>
            <div className="text-xs text-slate-400 mt-0.5">disease likelihood</div>
          </div>
          <div className={`card p-4 border ${risk_level==='Low Risk'?'border-emerald-100':risk_level==='Medium Risk'?'border-amber-100':'border-red-100'}`}>
            <div className="text-xs text-slate-400 mb-1">Classification</div>
            <div className={`text-xl font-bold ${risk_level==='Low Risk'?'text-emerald-600':risk_level==='Medium Risk'?'text-amber-600':'text-red-600'}`}>{risk_level}</div>
            <div className="text-xs text-slate-400 mt-0.5">AI prediction</div>
          </div>
          <div className="card p-4 col-span-2">
            <div className="text-xs text-slate-400 mb-1">Top Risk Driver (XAI)</div>
            {top_factors[0] && (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{top_factors[0].feature}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Value: {top_factors[0].value} · Impact: {top_factors[0].importance}%</div>
                </div>
                <span className="text-3xl">🔬</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ShapChart factors={top_factors} />
      <div>
        <h2 className="font-semibold text-slate-800 mb-3">Patient Health Dashboard</h2>
        <HealthDashboard patientData={patientData} riskScore={risk_score} />
      </div>
      {comparisons?.length > 0 && <ModelComparison comparisons={comparisons} />}
      <Recommendations recommendations={recommendations} />

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
        <p className="text-xs text-slate-400">⚠️ Educational purposes only. Not a substitute for professional medical advice.</p>
      </div>
    </div>
  )
}
