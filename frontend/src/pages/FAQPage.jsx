import { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'

const FAQS = [
  {
    category: 'About the System',
    items: [
      { q: 'What is HeartAI?', a: 'HeartAI is an Explainable AI-based heart disease risk prediction system. It uses machine learning models trained on cardiac health data to estimate a patient\'s risk of heart disease and explains which factors drove the prediction.' },
      { q: 'Is HeartAI a medical diagnostic tool?', a: 'No. HeartAI is strictly for educational and research purposes. It should never be used as a substitute for professional medical diagnosis. Always consult a qualified cardiologist or physician for any health concerns.' },
      { q: 'What dataset was used to train the models?', a: 'The models were trained on synthetic data derived from the structure of the Cleveland Heart Disease dataset (UCI Machine Learning Repository). For production use, replace this with real clinical data.' },
    ]
  },
  {
    category: 'Input Features',
    items: [
      { q: 'What is ST Depression?', a: 'ST depression refers to the lowering of the ST segment on an ECG reading during exercise. Values > 2.0 are generally considered clinically significant and may indicate reduced blood flow to the heart.' },
      { q: 'What is chest pain type?', a: '0 = Typical Angina (chest tightness during exertion), 1 = Atypical Angina (chest pain with unusual characteristics), 2 = Non-anginal Pain (not heart-related chest pain), 3 = Asymptomatic (no chest pain despite disease).' },
      { q: 'What does "Vessels Colored" mean?', a: 'This refers to the number of major coronary vessels (0–3) colored by fluoroscopy during a cardiac catheterization procedure. More vessels colored typically indicates more significant coronary artery disease.' },
      { q: 'What is Thalassemia in this context?', a: '0 = Normal, 1 = Fixed Defect (damaged area doesn\'t receive blood flow), 2 = Reversible Defect (reduced blood flow under stress that normalizes at rest), 3 = Unknown. These are detected via thallium stress tests.' },
    ]
  },
  {
    category: 'Machine Learning',
    items: [
      { q: 'Why use Random Forest as the primary model?', a: 'Random Forest provides built-in feature importance values used for Explainable AI (SHAP-style explanations). It\'s also robust to outliers, handles non-linear relationships, and doesn\'t require feature scaling, making it ideal for clinical data.' },
      { q: 'What is Explainable AI (XAI)?', a: 'XAI refers to methods that make AI predictions interpretable to humans. HeartAI uses feature importance scores to show WHICH patient metrics (e.g., high cholesterol, elevated BP) contributed most to the prediction — critical for medical trust.' },
      { q: 'What do the model accuracy numbers mean?', a: 'Accuracy represents what percentage of test predictions were correct. However, in medical contexts, sensitivity (catching real positives) and specificity (avoiding false alarms) are more important metrics. For research, also look at AUC-ROC scores.' },
      { q: 'What is XGBoost (GBM)?', a: 'XGBoost is Gradient Boosting Machine — an ensemble method that builds decision trees sequentially, where each tree corrects errors of the previous. It typically achieves the highest accuracy but is less interpretable than Random Forest.' },
    ]
  },
  {
    category: 'Risk Score',
    items: [
      { q: 'How is the Risk Score (0–100) calculated?', a: 'The risk score is derived from the model\'s predicted probability of heart disease, scaled to 0–100. It combines all 13 input features weighted by the Random Forest model\'s learned patterns.' },
      { q: 'What do the risk levels mean?', a: '0–30 = Low Risk (routine monitoring), 31–60 = Medium Risk (lifestyle changes advised, consult a doctor), 61–100 = High Risk (immediate cardiology consultation recommended).' },
      { q: 'Can the risk score change?', a: 'Yes. The risk score reflects the values entered at the time of prediction. Improving controllable factors like blood pressure, cholesterol, and lifestyle choices can reduce risk over time.' },
    ]
  },
  {
    category: 'Health & Lifestyle',
    items: [
      { q: 'What lifestyle factors increase heart disease risk most?', a: 'Smoking (+25%), obesity (+18%), sedentary lifestyle (+20%), high stress (+15%), heavy alcohol use (+15%), poor diet (+12%), and poor sleep (+8%) all contribute significantly to long-term cardiac risk.' },
      { q: 'Can I use the BMI calculator results in my prediction?', a: 'BMI is not a direct input to the heart disease prediction model. However, it\'s a valuable complementary assessment — high BMI correlates with higher cholesterol, blood pressure, and cardiovascular risk.' },
      { q: 'What should I do if the system shows High Risk?', a: 'Immediately consult a qualified cardiologist. Do not self-medicate. The AI prediction is a screening tool only — a doctor will perform proper diagnostic tests (ECG, stress test, blood work) to give a real assessment.' },
    ]
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-xl transition-all duration-200 ${open ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-white'}`}>
      <button className="w-full flex items-center justify-between gap-3 p-4 text-left"
        onClick={() => setOpen(!open)}>
        <span className="text-sm font-medium text-slate-800">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-rose-500" /> Frequently Asked Questions
        </h1>
        <p className="muted mt-1">Everything you need to know about HeartAI and cardiac risk prediction.</p>
      </div>

      <div className="space-y-6">
        {FAQS.map(({ category, items }) => (
          <div key={category}>
            <div className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-2 px-1">{category}</div>
            <div className="space-y-2">
              {items.map(item => <FAQItem key={item.q} {...item} />)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-5 bg-amber-50 border-amber-100">
        <div className="font-semibold text-amber-800 mb-1">⚠️ Medical Disclaimer</div>
        <p className="text-sm text-amber-700 leading-relaxed">
          HeartAI is a research and educational tool. All predictions are based on statistical models and
          should never replace professional medical consultation. If you have any cardiac symptoms or concerns,
          please seek immediate medical attention.
        </p>
      </div>
    </div>
  )
}
