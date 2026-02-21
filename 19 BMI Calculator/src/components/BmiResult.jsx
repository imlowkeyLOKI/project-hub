const RANGES = {
  Underweight: '< 18.5',
  Normal: '18.5 – 24.9',
  Overweight: '25.0 – 29.9',
  Obese: '>= 30.0',
}

const NOTES = {
  Underweight: 'Subject presents below standard body mass threshold.',
  Normal: 'Subject within standard body mass parameters.',
  Overweight: 'Subject exceeds standard body mass threshold.',
  Obese: 'Subject significantly exceeds body mass parameters.',
}

function ResultRow({ label, value, valueClass }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-base text-gray-300 shrink-0">{label}</span>
      <span className="flex-1 border-b border-dotted border-gray-700" />
      <span className={`text-base text-right ${valueClass || 'text-gray-100'}`}>{value}</span>
    </div>
  )
}

export default function BmiResult({ result, warnings }) {
  const resultWarning = warnings.find(w => w.field === 'result')

  return (
    <div>
      <ResultRow label="Index" value={result.bmi} />
      <ResultRow label="Classification" value={result.label.toUpperCase()} valueClass={result.color} />
      <ResultRow label="Ref. Range" value={RANGES[result.label]} />

      <p className="text-sm text-gray-600 mt-6">
        Note: {NOTES[result.label]}
      </p>
      {resultWarning && (
        <p className="text-xs text-amber-400 mt-1">{resultWarning.message}</p>
      )}
    </div>
  )
}
