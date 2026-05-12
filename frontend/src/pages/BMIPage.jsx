import { useState } from 'react'
import { Scale, ChevronRight } from 'lucide-react'
import { calculateBMI } from '../utils/api'

const BMI_RANGES = [
  { label: 'Underweight', range: '< 18.5', color: 'bg-blue-100 text-blue-700' },
  { label: 'Normal',      range: '18.5 – 24.9', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Overweight',  range: '25 – 29.9', color: 'bg-amber-100 text-amber-700' },
  { label: 'Obese I',     range: '30 – 34.9', color: 'bg-orange-100 text-orange-700' },
  { label: 'Obese II+',   range: '≥ 35', color: 'bg-red-100 text-red-700' },
]

export default function BMIPage() {
  const [form, setForm] = useState({ weight_kg: 70, height_cm: 170, age: 30, gender: 1, waist_cm: 0, hip_cm: 0 })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null)
    try { const r = await calculateBMI(form); setResult(r.data) }
    catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const bmiPercent = result ? Math.min(((result.bmi - 10) / 30) * 100, 100) : 0
  const bmiColor = result?.cardiac_risk === 'Low' ? '#10b981'
    : result?.cardiac_risk === 'Moderate' ? '#f59e0b' : '#ef4444'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <Scale className="w-6 h-6 text-rose-500" /> BMI & Body Metrics
        </h1>
        <p className="muted mt-1">Calculate your Body Mass Index and cardiac risk correlation.</p>
      </div>

      <form onSubmit={submit} className="card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Weight (kg)</label>
            <input type="number" className="input" value={form.weight_kg}
              onChange={e => set('weight_kg', parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className="label">Height (cm)</label>
            <input type="number" className="input" value={form.height_cm}
              onChange={e => set('height_cm', parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className="label">Age</label>
            <input type="number" className="input" value={form.age}
              onChange={e => set('age', parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label className="label">Gender</label>
            <div className="flex gap-2">
              {[['Female', 0], ['Male', 1]].map(([lbl, val]) => (
                <button key={lbl} type="button" onClick={() => set('gender', val)}
                  className={`flex-1 py-2 rounded-xl text-sm border transition-all
                    ${form.gender === val ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border-slate-200'}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Waist (cm) <span className="text-slate-400">optional</span></label>
            <input type="number" className="input" value={form.waist_cm}
              onChange={e => set('waist_cm', parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className="label">Hip (cm) <span className="text-slate-400">optional</span></label>
            <input type="number" className="input" value={form.hip_cm}
              onChange={e => set('hip_cm', parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-red">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Calculating...</>
              : <>Calculate BMI <ChevronRight className="w-4 h-4" /></>
            }
          </button>
        </div>
      </form>

      {error && <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>}

      {result && (
        <div className="mt-5 space-y-4 fade-in">
          {/* BMI Score */}
          <div className="card p-6 text-center">
            <div className="text-5xl font-bold mb-1" style={{ color: bmiColor }}>{result.bmi}</div>
            <div className="text-slate-400 text-sm mb-3">BMI Score</div>
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4
              ${result.cardiac_risk === 'Low' ? 'bg-emerald-100 text-emerald-700'
                : result.cardiac_risk === 'Moderate' ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'}`}>
              {result.category}
            </div>

            {/* BMI scale bar */}
            <div className="relative h-3 rounded-full overflow-hidden mb-2"
              style={{ background: 'linear-gradient(to right, #60a5fa, #10b981, #f59e0b, #ef4444)' }}>
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-700 shadow"
                style={{ left: `${bmiPercent}%`, transform: 'translate(-50%,-50%)' }} />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4">
              <div className="text-xs text-slate-400 mb-1">Ideal Weight Range</div>
              <div className="font-bold text-slate-800">{result.ideal_weight_min} – {result.ideal_weight_max} kg</div>
            </div>
            <div className="card p-4">
              <div className="text-xs text-slate-400 mb-1">Estimated Body Fat</div>
              <div className="font-bold text-slate-800">{result.body_fat_percent}%</div>
            </div>
            <div className="card p-4">
              <div className="text-xs text-slate-400 mb-1">Cardiac Risk (BMI)</div>
              <div className={`font-bold ${result.cardiac_risk==='Low'?'text-emerald-600':result.cardiac_risk==='Moderate'?'text-amber-600':'text-red-600'}`}>
                {result.cardiac_risk}
              </div>
            </div>
            {result.weight_to_lose > 0 && (
              <div className="card p-4">
                <div className="text-xs text-slate-400 mb-1">Weight to Lose</div>
                <div className="font-bold text-rose-600">{result.weight_to_lose} kg</div>
              </div>
            )}
            {result.whr && (
              <div className="card p-4 col-span-2">
                <div className="text-xs text-slate-400 mb-1">Waist-to-Hip Ratio (WHR)</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{result.whr}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${result.whr_risk==='High'?'bg-red-50 text-red-600':'bg-emerald-50 text-emerald-600'}`}>
                    {result.whr_risk} Risk
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Advice */}
          <div className="card p-4 bg-blue-50 border border-blue-100">
            <div className="text-sm font-medium text-blue-800 mb-1">💡 Recommendation</div>
            <p className="text-sm text-blue-700">{result.advice}</p>
          </div>

          {/* BMI chart */}
          <div className="card p-5">
            <div className="section-head mb-3">BMI Categories Reference</div>
            <div className="space-y-2">
              {BMI_RANGES.map(({ label, range, color }) => (
                <div key={label} className={`flex items-center justify-between px-3 py-2 rounded-lg
                  ${result.category.includes(label.split(' ')[0]) || (label==='Normal' && result.category==='Normal Weight') ? color + ' font-semibold ring-1 ring-current ring-opacity-30' : 'bg-slate-50 text-slate-500'}`}>
                  <span className="text-sm">{label}</span>
                  <span className="text-sm font-mono">{range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
