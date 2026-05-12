import { Heart, Activity, BarChart2, User, Scale, Clock, HelpCircle, Info } from 'lucide-react'

const nav = [
  { id: 'predict',   icon: Heart,       label: 'Predict',   desc: 'Run analysis' },
  { id: 'results',   icon: Activity,    label: 'Results',   desc: 'View output' },
  { id: 'compare',   icon: BarChart2,   label: 'Compare',   desc: 'Model scores' },
  { id: 'lifestyle', icon: User,        label: 'Lifestyle', desc: 'Risk factors' },
  { id: 'bmi',       icon: Scale,       label: 'BMI',       desc: 'Body metrics' },
  { id: 'history',   icon: Clock,       label: 'History',   desc: 'Past records' },
  { id: 'faq',       icon: HelpCircle,  label: 'FAQ',       desc: 'Learn more' },
  { id: 'about',     icon: Info,        label: 'About',     desc: 'System info' },
]

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-slate-100 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white heartbeat fill-white/30" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base leading-none">HeartAI</div>
            <div className="text-xs text-slate-400 mt-0.5">v2.0</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(({ id, icon: Icon, label, desc }) => {
          const on = active === id
          return (
            <button key={id} onClick={() => onChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                ${on ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Icon className={`w-4 h-4 flex-shrink-0 ${on ? 'text-rose-500' : 'text-slate-400'}`} />
              <div>
                <div className={`text-sm font-medium leading-none ${on ? 'text-rose-700' : ''}`}>{label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
              </div>
            </button>
          )
        })}
      </nav>

      <div className="p-3 m-3 rounded-xl bg-amber-50 border border-amber-100">
        <p className="text-xs text-amber-700 leading-relaxed">
          ⚠️ For educational use only. Not medical advice.
        </p>
      </div>
    </aside>
  )
}
