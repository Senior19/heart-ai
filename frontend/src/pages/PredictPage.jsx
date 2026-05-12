import { useState } from 'react'
import { ChevronRight, RotateCcw, Heart } from 'lucide-react'

const DEFAULTS = {
  age:55, gender:1, chest_pain_type:2, resting_bp:130, cholesterol:240,
  fasting_blood_sugar:0, resting_ecg:1, max_heart_rate:150,
  exercise_angina:0, st_depression:1.5, slope:1, vessels_colored:1, thal:2
}

const CP_OPTS   = ['Typical Angina','Atypical Angina','Non-anginal Pain','Asymptomatic']
const ECG_OPTS  = ['Normal','ST-T Abnormality','LV Hypertrophy']
const SLOPE_OPTS= ['Upsloping','Flat','Downsloping']
const THAL_OPTS = ['Normal','Fixed Defect','Reversible Defect','Unknown']

function NumField({ label, name, value, onChange, hint, step=1 }) {
  return (
    <div>
      <label className="label">{label} {hint && <span className="text-slate-400">({hint})</span>}</label>
      <input type="number" step={step} className="input" value={value}
        onChange={e => onChange(name, parseFloat(e.target.value)||0)} />
    </div>
  )
}

function SelectField({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input cursor-pointer" value={value}
        onChange={e => onChange(name, +e.target.value)}>
        {options.map((o,i) => <option key={i} value={i}>{o}</option>)}
      </select>
    </div>
  )
}

function Toggle({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        {options.map(([lbl, val]) => (
          <button key={lbl} type="button" onClick={() => onChange(name, val)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
              ${value===val ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300'}`}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  )
}

function Section({ num, title, children }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center">{num}</span>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </div>
  )
}

export default function PredictPage({ onSubmit, loading }) {
  const [form, setForm] = useState(DEFAULTS)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500" /> Heart Risk Prediction
        </h1>
        <p className="muted mt-1">Enter patient vitals to generate an AI cardiac risk analysis.</p>
      </div>

      <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <Section num="1" title="Demographics">
          <NumField label="Age" name="age" value={form.age} onChange={set} hint="years" />
          <Toggle label="Gender" name="gender" options={[['Female',0],['Male',1]]} value={form.gender} onChange={set} />
          <SelectField label="Chest Pain Type" name="chest_pain_type" options={CP_OPTS} value={form.chest_pain_type} onChange={set} />
        </Section>

        <Section num="2" title="Cardiovascular Vitals">
          <NumField label="Resting Blood Pressure" name="resting_bp" value={form.resting_bp} onChange={set} hint="mmHg" />
          <NumField label="Serum Cholesterol" name="cholesterol" value={form.cholesterol} onChange={set} hint="mg/dL" />
          <NumField label="Max Heart Rate" name="max_heart_rate" value={form.max_heart_rate} onChange={set} hint="bpm" />
          <NumField label="ST Depression" name="st_depression" value={form.st_depression} onChange={set} step={0.1} />
          <SelectField label="ST Slope" name="slope" options={SLOPE_OPTS} value={form.slope} onChange={set} />
          <NumField label="Vessels Colored (0–3)" name="vessels_colored" value={form.vessels_colored} onChange={set} />
        </Section>

        <Section num="3" title="Clinical Tests">
          <Toggle label="Fasting Blood Sugar >120 mg/dL" name="fasting_blood_sugar" options={[['No',0],['Yes',1]]} value={form.fasting_blood_sugar} onChange={set} />
          <SelectField label="Resting ECG" name="resting_ecg" options={ECG_OPTS} value={form.resting_ecg} onChange={set} />
          <Toggle label="Exercise Angina" name="exercise_angina" options={[['No',0],['Yes',1]]} value={form.exercise_angina} onChange={set} />
          <SelectField label="Thalassemia" name="thal" options={THAL_OPTS} value={form.thal} onChange={set} />
        </Section>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => setForm(DEFAULTS)} className="btn-outline">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button type="submit" disabled={loading} className="btn-red min-w-36 justify-center">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analysing...</>
              : <><Heart className="w-4 h-4" /> Run Analysis <ChevronRight className="w-4 h-4" /></>}
          </button>
        </div>
      </form>
    </div>
  )
}
