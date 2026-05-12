import { useState } from 'react'
import { User, ChevronRight } from 'lucide-react'
import { assessLifestyle } from '../utils/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

const DEFAULTS = { smoking:false, alcohol:'none', exercise:'moderate', stress:'low', diet:'good', sleep:'good', obesity:false }

function Chips({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map(([lbl,val]) => (
          <button key={lbl} type="button" onClick={() => onChange(name, val)}
            className={`px-3 py-1.5 rounded-xl text-sm border transition-all
              ${value===val ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300'}`}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function LifestylePage() {
  const [form, setForm] = useState(DEFAULTS)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }))

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null)
    try { const r = await assessLifestyle(form); setResult(r.data) }
    catch(e) { setError(e.message) } finally { setLoading(false) }
  }

  const proj = result ? [
    { label:'Now',    risk: result.current_risk },
    { label:'5 Yrs',  risk: result.projected_5yr },
    { label:'10 Yrs', risk: result.projected_10yr },
  ] : []

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2"><User className="w-6 h-6 text-rose-500" /> Lifestyle Risk Analysis</h1>
        <p className="muted mt-1">Understand how daily habits affect your long-term cardiac risk.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Chips label="Smoking" name="smoking" options={[['Non-smoker',false],['Smoker',true]]} value={form.smoking} onChange={set} />
          <Chips label="Alcohol" name="alcohol" options={[['None','none'],['Moderate','moderate'],['Heavy','heavy']]} value={form.alcohol} onChange={set} />
          <Chips label="Exercise" name="exercise" options={[['None','none'],['Low','low'],['Moderate','moderate'],['High','high']]} value={form.exercise} onChange={set} />
          <Chips label="Stress Level" name="stress" options={[['Low','low'],['Moderate','moderate'],['High','high']]} value={form.stress} onChange={set} />
          <Chips label="Diet Quality" name="diet" options={[['Good','good'],['Moderate','moderate'],['Poor','poor']]} value={form.diet} onChange={set} />
          <Chips label="Sleep Quality" name="sleep" options={[['Good','good'],['Poor','poor']]} value={form.sleep} onChange={set} />
          <Chips label="Obesity / Overweight" name="obesity" options={[['No',false],['Yes',true]]} value={form.obesity} onChange={set} />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-red">
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Calculating...</> : <>Assess Risk <ChevronRight className="w-4 h-4" /></>}
          </button>
        </div>
      </form>

      {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>}

      {result && (
        <div className="mt-6 space-y-4 fade-in">
          <div className="grid grid-cols-3 gap-3">
            {[['Current Risk', result.current_risk,'text-slate-800'],['5-Year', result.projected_5yr,'text-amber-600'],['10-Year', result.projected_10yr,'text-red-600']].map(([l,v,c]) => (
              <div key={l} className="card p-4 text-center">
                <div className={`text-2xl font-bold ${c}`}>{v.toFixed(1)}%</div>
                <div className="text-xs text-slate-400 mt-1">{l}</div>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <div className="section-head">Risk Progression</div>
            <p className="muted mb-4">Projected future risk based on current lifestyle</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={proj}>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} />
                <YAxis domain={[0,100]} tick={{ fontSize:11, fill:'#94a3b8' }} tickFormatter={v=>`${v}%`} axisLine={false} />
                <Tooltip formatter={v=>[`${v.toFixed(1)}%`,'Risk']}
                  contentStyle={{ borderRadius:10, border:'1px solid #e2e8f0', fontSize:12 }} />
                <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2.5} dot={{ r:5, fill:'#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {result.risk_factors.length > 0 && (
            <div className="card p-5">
              <div className="section-head">Risk Factor Breakdown</div>
              <div className="space-y-2.5 mt-3">
                {result.risk_factors.map((f,i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-sm text-slate-600 w-40">{f.factor}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width:`${(f.impact/30)*100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-rose-600 w-10 text-right">+{f.impact}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
