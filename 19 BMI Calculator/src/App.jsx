import { useEffect, useState } from 'react'
import UnitSwitch from './components/UnitSwitch'
import BmiForm from './components/BmiForm'
import BmiResult from './components/BmiResult'
import { calcBmi, getCategory } from './lib/bmi'
import { convert } from './lib/conversion'
import { validate, sanitize } from './lib/validation'
import { load, save, clear } from './lib/storage'

const EMPTY_FORM = { height: '', weight: '', age: '' }

function App() {
  const [unit, setUnit] = useState('imperial')
  const [form, setForm] = useState(EMPTY_FORM)
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState([])
  const [warnings, setWarnings] = useState([])

  useEffect(() => {
    const saved = load()
    if (saved) {
      setUnit(saved.unit || 'imperial')
      setForm(saved.form || EMPTY_FORM)
      setResult(saved.result || null)
    }
  }, [])

  useEffect(() => {
    save({ unit, form, result })
  }, [unit, form, result])

  function handleUnitChange(newUnit) {
    if (newUnit === unit) return

    const { height, weight, warnings: convWarnings } = convert(form, newUnit)

    setUnit(newUnit)
    setForm({ height, weight, age: form.age })
    setResult(null)
    setErrors([])
    setWarnings(
      convWarnings.map(msg => ({ field: 'conversion', message: msg }))
    )
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: sanitize(value) }))
  }

  function handleCalculate() {
    const { errors: errs, warnings: warns } = validate(form, unit)
    setErrors(errs)
    setWarnings(warns)

    if (errs.length > 0) {
      setResult(null)
      return
    }

    const bmi = calcBmi(form.height, form.weight, unit)

    if (bmi && (bmi < 5 || bmi > 120)) {
      warns.push({ field: 'result', message: 'Atypical index value — verify patient data' })
    }

    setWarnings(warns)
    setResult(bmi ? { bmi, ...getCategory(bmi) } : null)
  }

  function handleReset() {
    setUnit('imperial')
    setForm(EMPTY_FORM)
    setResult(null)
    setErrors([])
    setWarnings([])
    clear()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 p-10">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg tracking-widest text-gray-300 uppercase">Body Mass Index Report</h1>
          <UnitSwitch unit={unit} onChange={handleUnitChange} />
        </div>
        <hr className="border-gray-700 mb-8" />

        {warnings.some(w => w.field === 'conversion') && (
          <div className="border border-amber-700 px-3 py-2 mb-4">
            {warnings.filter(w => w.field === 'conversion').map((w, i) => (
              <p key={i} className="text-sm text-amber-400 font-mono">{w.message}</p>
            ))}
          </div>
        )}

        <p className="text-sm tracking-widest text-gray-500 uppercase mb-3">Patient Intake</p>
        <hr className="border-gray-800 mb-6" />

        <BmiForm
          unit={unit}
          form={form}
          errors={errors}
          warnings={warnings}
          onChange={handleChange}
          onCalculate={handleCalculate}
          onReset={handleReset}
        />

        {result && (
          <>
            <hr className="border-gray-700 my-8" />
            <p className="text-sm tracking-widest text-gray-500 uppercase mb-3">Assessment</p>
            <hr className="border-gray-800 mb-6" />
            <BmiResult result={result} warnings={warnings} />
          </>
        )}

      </div>
    </div>
  )
}

export default App
