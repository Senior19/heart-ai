export default function Recommendations({ recommendations = [] }) {
  const cfg = {
    critical: 'border-red-200 bg-red-50',
    high:     'border-orange-200 bg-orange-50',
    medium:   'border-amber-200 bg-amber-50',
    low:      'border-emerald-200 bg-emerald-50',
  }
  const dot = { critical:'bg-red-500 animate-pulse', high:'bg-orange-500', medium:'bg-amber-500', low:'bg-emerald-500' }
  return (
    <div className="card p-5">
      <div className="section-head">Health Recommendations</div>
      <p className="muted mb-4">Personalised guidance based on your values</p>
      <div className="space-y-2.5">
        {recommendations.map((r,i) => (
          <div key={i} className={`flex gap-3 p-3.5 rounded-xl border fade-in ${cfg[r.severity]||cfg.low}`}
            style={{ animationDelay:`${i*60}ms` }}>
            <span className="text-xl flex-shrink-0">{r.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">{r.title}</span>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot[r.severity]||dot.low}`} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{r.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
