import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { Trophy } from 'lucide-react'

const COLORS = { 'Logistic Regression':'#60a5fa', 'Random Forest':'#34d399', 'XGBoost (GBM)':'#f43f5e', 'SVM':'#a78bfa' }

export default function ModelComparison({ comparisons = [] }) {
  const best = [...comparisons].sort((a,b) => b.accuracy - a.accuracy)[0]
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="section-head">Model Comparison</div>
          <p className="muted">Accuracy across all 4 algorithms</p>
        </div>
        {best && (
          <div className="flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-medium px-3 py-1.5 rounded-xl border border-rose-100">
            <Trophy className="w-3.5 h-3.5" /> {best.model}
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={comparisons} margin={{ top:0, right:0, left:0, bottom:0 }}>
          <XAxis dataKey="model" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis domain={[70,100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false}
            tickFormatter={v=>`${v}%`} tickLine={false} />
          <Tooltip formatter={v=>[`${v}%`,'Accuracy']}
            contentStyle={{ borderRadius:10, border:'1px solid #e2e8f0', fontSize:12 }} />
          <Bar dataKey="accuracy" radius={[6,6,0,0]} barSize={36}>
            {comparisons.map(c => <Cell key={c.model} fill={COLORS[c.model]||'#94a3b8'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 space-y-2">
        {[...comparisons].sort((a,b)=>b.accuracy-a.accuracy).map((c,i) => (
          <div key={c.model} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full" style={{ background: COLORS[c.model] }} />
              <span className="text-sm text-slate-700">{c.model}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full ${c.prediction==='High Risk'?'bg-red-50 text-red-600':'bg-emerald-50 text-emerald-600'}`}>
                {c.prediction}
              </span>
              <span className="text-sm font-semibold" style={{ color: COLORS[c.model] }}>{c.accuracy}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
