import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import PredictPage from './pages/PredictPage'
import ResultsPage from './pages/ResultsPage'
import LifestylePage from './pages/LifestylePage'
import BMIPage from './pages/BMIPage'
import HistoryPage from './pages/HistoryPage'
import FAQPage from './pages/FAQPage'
import AboutPage from './pages/AboutPage'
import { predictHeartDisease, compareModels } from './utils/api'
import { Wifi, WifiOff } from 'lucide-react'

const BREADCRUMBS = {
  predict:'Predict', results:'Results', compare:'Compare',
  lifestyle:'Lifestyle', bmi:'BMI Calculator', history:'Patient History',
  faq:'FAQ', about:'About'
}

export default function App() {
  const [page, setPage] = useState('predict')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [comparisons, setComparisons] = useState([])
  const [patientData, setPatientData] = useState(null)
  const [error, setError] = useState(null)
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    fetch('/api/health')
      .then(r => setApiStatus(r.ok ? 'online' : 'offline'))
      .catch(() => setApiStatus('offline'))
  }, [])

  const handlePredict = async (formData) => {
    setLoading(true); setError(null); setPatientData(formData)
    try {
      const [predRes, compRes] = await Promise.all([
        predictHeartDisease(formData),
        compareModels(formData),
      ])
      setResult(predRes.data)
      setComparisons(compRes.data?.comparisons || [])
      setPage('results')
    } catch (err) {
      setError(`API Error: ${err.message} — Make sure the backend is running on port 8000.`)
    } finally { setLoading(false) }
  }

  const renderPage = () => {
    switch (page) {
      case 'predict':   return <PredictPage onSubmit={handlePredict} loading={loading} />
      case 'results':   return <ResultsPage result={result} comparisons={comparisons} patientData={patientData} onBack={() => setPage('predict')} />
      case 'compare':   return result ? (
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="page-title">Algorithm Benchmarks</h1>
          <p className="muted">Comparison of all 4 ML models on the same patient input.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {comparisons.map(c => {
              const colors = {'Logistic Regression':'border-blue-200 bg-blue-50','Random Forest':'border-emerald-200 bg-emerald-50','XGBoost (GBM)':'border-rose-200 bg-rose-50','SVM':'border-purple-200 bg-purple-50'}
              const textc = {'Logistic Regression':'text-blue-700','Random Forest':'text-emerald-700','XGBoost (GBM)':'text-rose-700','SVM':'text-purple-700'}
              return (
                <div key={c.model} className={`card p-4 text-center border ${colors[c.model]||''}`}>
                  <div className={`text-2xl font-bold ${textc[c.model]||'text-slate-700'}`}>{c.accuracy}%</div>
                  <div className="text-xs text-slate-500 mt-1">{c.model}</div>
                  <div className={`text-xs mt-2 font-medium ${c.prediction==='High Risk'?'text-red-600':'text-emerald-600'}`}>{c.prediction}</div>
                </div>
              )
            })}
          </div>
          <div className="card p-5">
            <div className="section-head">Why Random Forest is the Primary Model</div>
            <ul className="space-y-2 mt-3">
              {['Native feature importances for XAI explanations','Robust to outliers and missing clinical data','No feature scaling required','Handles non-linear relationships well','Good balance of accuracy and interpretability'].map(t=>(
                <li key={t} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-500 mt-0.5">✓</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-semibold text-slate-800">Run a prediction first</h3>
          <button onClick={() => setPage('predict')} className="btn-red mt-4">Go to Predict</button>
        </div>
      )
      case 'lifestyle': return <LifestylePage />
      case 'bmi':       return <BMIPage />
      case 'history':   return <HistoryPage />
      case 'faq':       return <FAQPage />
      case 'about':     return <AboutPage />
      default: return null
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active={page} onChange={setPage} />
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5
          bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="text-sm text-slate-400">
            <span className="text-slate-600 font-medium">HeartAI</span>
            <span className="mx-1.5 text-slate-300">/</span>
            <span>{BREADCRUMBS[page]}</span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium
            ${apiStatus==='online' ? 'bg-emerald-50 text-emerald-600' : apiStatus==='offline' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
            {apiStatus==='online' ? <Wifi className="w-3 h-3"/> : <WifiOff className="w-3 h-3"/>}
            API {apiStatus}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="max-w-3xl mx-auto mb-4 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}
          {renderPage()}
        </div>
      </main>
    </div>
  )
}
