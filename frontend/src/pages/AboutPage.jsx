import { Info, Cpu, Database, Shield, GitBranch, BookOpen, Lightbulb, User, Code2, BrainCircuit } from 'lucide-react'

const PHASES = [
  { n:'1',  title:'Basic Prediction',   desc:'LR, Random Forest, XGBoost, SVM with risk scoring',    color:'bg-blue-50 text-blue-700 border-blue-100' },
  { n:'2',  title:'Model Comparison',   desc:'Side-by-side accuracy benchmarks for all 4 models',     color:'bg-purple-50 text-purple-700 border-purple-100' },
  { n:'3',  title:'Explainable AI',     desc:'SHAP-style feature importance & top risk drivers',       color:'bg-rose-50 text-rose-700 border-rose-100' },
  { n:'4',  title:'Health Dashboard',   desc:'Radar chart, pie chart, and vitals summary table',       color:'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { n:'5',  title:'Recommendations',    desc:'Severity-coded personalised health guidance',             color:'bg-amber-50 text-amber-700 border-amber-100' },
  { n:'6',  title:'Lifestyle Analysis', desc:'8 lifestyle factors + 10-year risk projection',           color:'bg-orange-50 text-orange-700 border-orange-100' },
  { n:'7',  title:'BMI Calculator',     desc:'BMI, body fat %, WHR, ideal weight range',               color:'bg-teal-50 text-teal-700 border-teal-100' },
  { n:'8',  title:'Patient History',    desc:'Save, view, and delete patient prediction records',       color:'bg-indigo-50 text-indigo-700 border-indigo-100' },
  { n:'9',  title:'PDF Report Export',  desc:'Downloadable clinical-style PDF report',                  color:'bg-pink-50 text-pink-700 border-pink-100' },
  { n:'10', title:'FAQ & Education',    desc:'Detailed explanations of features and AI methods',        color:'bg-slate-50 text-slate-700 border-slate-200' },
]

const SUGGESTIONS = [
  { icon:'🧬', title:'Real SHAP Library',  desc:'Install pip install shap and replace feature importances with actual SHAP values for true XAI.' },
  { icon:'📊', title:'Real Dataset',        desc:'Replace synthetic data with the actual Cleveland UCI dataset (303 patients, 14 features).' },
  { icon:'🔐', title:'Login System',        desc:'Add JWT-based doctor/patient login with FastAPI OAuth2 + React protected routes.' },
  { icon:'🏥', title:'Doctor Dashboard',    desc:'Separate doctor view with patient management, comparison charts, and bulk records.' },
  { icon:'📈', title:'AUC-ROC Curves',     desc:'Add ROC curve visualisation for each model — critical for medical ML credibility.' },
  { icon:'🤖', title:'Deep Learning',       desc:'Add a PyTorch / Keras neural network model tab for comparison against classical ML.' },
  { icon:'☁️', title:'Cloud Deploy',       desc:'Frontend → Vercel. Backend → Render (free). Gets a live URL for your portfolio.' },
  { icon:'📱', title:'Mobile UI',           desc:'Add responsive breakpoints for phone-friendly access using Tailwind sm: / md: classes.' },
  { icon:'🔔', title:'Risk Alerts',         desc:"Email alerts (via SMTP) when a patient's risk crosses a threshold after re-prediction." },
  { icon:'📋', title:'CSV Import',          desc:'Allow bulk patient import via CSV file upload for batch predictions.' },
]

const TECH = [
  { icon: Cpu,       label:'Frontend',    value:'React 18 + Tailwind CSS + Recharts + Vite' },
  { icon: GitBranch, label:'Backend',     value:'FastAPI + Scikit-learn + ReportLab + Pydantic' },
  { icon: Database,  label:'Dataset',     value:'Cleveland Heart Disease (UCI) — synthetic variant' },
  { icon: Shield,    label:'XAI Method',  value:'Random Forest Feature Importances (SHAP-style)' },
  { icon: BookOpen,  label:'Project Use', value:'Academic / Portfolio / Internship' },
]

const SKILLS = [
  { icon: BrainCircuit, label: 'Machine Learning', desc: 'Scikit-learn · XGBoost · Model Evaluation · XAI' },
  { icon: Code2,        label: 'Backend Dev',       desc: 'FastAPI · Python · REST APIs · Pydantic' },
  { icon: Cpu,          label: 'Frontend Dev',      desc: 'React 18 · Tailwind CSS · Recharts · Vite' },
]

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Page header */}
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Info className="w-6 h-6 text-rose-500" /> About HeartAI
        </h1>
        <p className="muted mt-1 leading-relaxed">
          <span className="font-medium text-slate-700">
            "Development of an Explainable AI-Based Heart Disease Prediction and Risk Analysis System"
          </span>
          {' '}— a full-stack ML project for academic, portfolio, and internship use.
        </p>
      </div>

      {/* ── Developer Card ── */}
      <div className="card p-5 border-rose-100 bg-gradient-to-br from-white to-rose-50">
        <div className="section-head flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-rose-500" /> Developer
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-start">

          {/* Avatar initials */}
          <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-rose-100">
            <span className="text-white text-2xl font-bold tracking-tight">AK</span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800">Ashish Kumar Jha</h2>
            <p className="text-sm text-rose-500 font-medium mt-0.5">ML Enthusiast &amp; Backend Developer</p>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Passionate about building intelligent, explainable systems that solve real-world problems.
              Ashish designed and developed HeartAI end-to-end — from training the ML models and crafting
              the FastAPI backend to building a clean, interactive React frontend. He believes that
              AI should be transparent, accessible, and useful beyond the lab.
            </p>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['Python', 'FastAPI', 'Scikit-learn', 'React', 'Tailwind CSS', 'XAI'].map(tag => (
                <span key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Skill rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
          {SKILLS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-700">{label}</div>
                <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card p-5">
        <div className="section-head">Technology Stack</div>
        <div className="space-y-2 mt-3">
          {TECH.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <div className="text-xs text-slate-400">{label}</div>
                <div className="text-sm text-slate-700 font-medium">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phases */}
      <div className="card p-5">
        <div className="section-head">All 10 Project Phases</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {PHASES.map(({ n, title, desc, color }) => (
            <div key={n} className={`p-3 rounded-xl border ${color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold opacity-60">#{n}</span>
                <span className="text-sm font-semibold">{title}</span>
              </div>
              <p className="text-xs opacity-70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="card p-5">
        <div className="section-head flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" /> Suggestions to Improve Further
        </div>
        <div className="space-y-2.5 mt-3">
          {SUGGESTIONS.map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
              <span className="text-lg flex-shrink-0">{icon}</span>
              <div>
                <div className="text-sm font-medium text-slate-800">{title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card p-4 bg-amber-50 border-amber-100">
        <div className="font-semibold text-amber-800 text-sm mb-1">Disclaimer</div>
        <p className="text-xs text-amber-700 leading-relaxed">
          This system is for educational and research purposes only. Not for clinical use.
          Always consult a qualified healthcare provider.
        </p>
      </div>

    </div>
  )
}