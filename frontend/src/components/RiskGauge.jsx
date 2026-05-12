import { useEffect, useState } from 'react'

export default function RiskGauge({ score = 0, level = 'Low Risk' }) {
  const [anim, setAnim] = useState(0)
  useEffect(() => {
    let cur = 0; const step = score / 50
    const t = setInterval(() => { cur += step; if (cur >= score) { setAnim(score); clearInterval(t) } else setAnim(Math.round(cur)) }, 16)
    return () => clearInterval(t)
  }, [score])

  const R = 70, cx = 90, cy = 90
  const total = 240
  const circ = 2 * Math.PI * R
  const arc = (circ * total) / 360
  const fillLen = (arc * anim) / 100

  const color = level === 'Low Risk' ? '#10b981' : level === 'Medium Risk' ? '#f59e0b' : '#ef4444'
  const bg = level === 'Low Risk' ? 'bg-emerald-50' : level === 'Medium Risk' ? 'bg-amber-50' : 'bg-red-50'
  const border = level === 'Low Risk' ? 'border-emerald-100' : level === 'Medium Risk' ? 'border-amber-100' : 'border-red-100'

  return (
    <div className={`card p-6 text-center ${bg} border ${border}`}>
      <svg width="180" height="160" viewBox="0 0 180 160" className="mx-auto">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#e2e8f0" strokeWidth="14"
          strokeDasharray={`${arc} ${circ}`} strokeLinecap="round"
          transform={`rotate(150 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={`${fillLen} ${circ}`} strokeLinecap="round"
          transform={`rotate(150 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.05s linear', filter: `drop-shadow(0 0 6px ${color}40)` }} />
        <text x={cx} y={cy - 6} textAnchor="middle" fill={color} fontSize="28" fontWeight="700" fontFamily="Inter">{anim}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter">/100</text>
      </svg>
      <div className="mt-1">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold
          ${level === 'Low Risk' ? 'bg-emerald-100 text-emerald-700' : level === 'Medium Risk' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
          <span className={`w-2 h-2 rounded-full ${level === 'Low Risk' ? 'bg-emerald-500' : level === 'Medium Risk' ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`} />
          {level}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {score < 30 ? 'Routine monitoring recommended' : score < 60 ? 'Lifestyle changes advised' : 'Consult a cardiologist'}
        </p>
      </div>
    </div>
  )
}
