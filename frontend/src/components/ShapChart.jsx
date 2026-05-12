import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#ef4444','#f97316','#f59e0b','#84cc16','#06b6d4']

export default function ShapChart({ factors = [] }) {
  return (
    <div className="card p-5">
      <div className="section-head">Feature Importance (XAI)</div>
      <p className="muted mb-4">Which factors influenced the prediction most</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={factors} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 30]} tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="feature" width={120}
            tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v) => [`${v}%`, 'Importance']}
            contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Bar dataKey="importance" radius={[0,6,6,0]} barSize={18}>
            {factors.map((_, i) => <Cell key={i} fill={COLORS[i] || '#94a3b8'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-3">
        {factors.slice(0,4).map((f,i) => (
          <div key={i} className="flex justify-between items-center bg-slate-50 rounded-lg px-3 py-2">
            <span className="text-xs text-slate-500">{f.feature}</span>
            <span className="text-xs font-medium text-slate-700">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
