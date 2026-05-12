import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

export default function HealthDashboard({ patientData, riskScore }) {
  if (!patientData) return null
  const radarData = [
    { metric: 'Age Risk',     value: Math.min((patientData.age/80)*100, 100) },
    { metric: 'Blood Press',  value: Math.min(((patientData.resting_bp-80)/120)*100, 100) },
    { metric: 'Cholesterol',  value: Math.min(((patientData.cholesterol-100)/500)*100, 100) },
    { metric: 'Heart Rate',   value: Math.max(100-(patientData.max_heart_rate/200)*100, 0) },
    { metric: 'ST Depression',value: Math.min((patientData.st_depression/6)*100, 100) },
  ]
  const pieData = [
    { name: 'Disease Risk', value: riskScore },
    { name: 'Healthy',      value: 100 - riskScore },
  ]
  const vitals = [
    { label:'Blood Pressure', val:`${patientData.resting_bp} mmHg`, ok: patientData.resting_bp < 140 },
    { label:'Cholesterol',    val:`${patientData.cholesterol} mg/dL`, ok: patientData.cholesterol < 200 },
    { label:'Max Heart Rate', val:`${patientData.max_heart_rate} bpm`, ok: patientData.max_heart_rate > 120 },
    { label:'ST Depression',  val:patientData.st_depression.toFixed(1), ok: patientData.st_depression < 2 },
    { label:'Vessels',        val:`${patientData.vessels_colored}`,  ok: patientData.vessels_colored === 0 },
    { label:'Age',            val:`${patientData.age} yrs`, ok: patientData.age < 60 },
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="section-head">Health Radar</div>
          <p className="muted mb-3">Multi-factor risk overview</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize:10, fill:'#94a3b8' }} />
              <Radar dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <div className="section-head">Risk Breakdown</div>
          <p className="muted mb-3">Disease probability distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                <Cell fill="#ef4444" />
                <Cell fill="#e2e8f0" />
              </Pie>
              <Tooltip formatter={v=>[`${v.toFixed(1)}%`]}
                contentStyle={{ borderRadius:10, border:'1px solid #e2e8f0', fontSize:12 }} />
              <Legend formatter={v=><span style={{ color:'#64748b', fontSize:12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card p-5">
        <div className="section-head mb-3">Vitals Summary</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {vitals.map(({ label, val, ok }) => (
            <div key={label} className={`p-3 rounded-xl border text-center ${ok?'bg-emerald-50 border-emerald-100':'bg-red-50 border-red-100'}`}>
              <div className="font-semibold text-slate-800 text-sm">{val}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              <div className={`text-xs mt-1 font-medium ${ok?'text-emerald-600':'text-red-500'}`}>
                {ok ? '✓ OK' : '⚠ High'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
