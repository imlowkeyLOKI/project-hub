function fieldError(errors, field) {
  return errors.find(e => e.field === field)
}

function fieldWarning(warnings, field) {
  return warnings.find(w => w.field === field)
}

function Row({ id, label, placeholder, value, onChange, error, warning, describedBy }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <label htmlFor={id} className="text-base text-gray-300 shrink-0">
          {label}
        </label>
        <span className="flex-1 border-b border-dotted border-gray-700 min-w-8" />
        <input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-describedby={describedBy}
          className={`w-18 bg-transparent text-gray-100 text-base text-right border-b px-2 py-2 outline-none transition-colors placeholder:text-gray-700 ${
            error
              ? 'border-red-500 focus:border-red-400'
              : warning
                ? 'border-amber-500 focus:border-amber-400'
                : 'border-gray-600 focus:border-teal-500'
          }`}
        />
      </div>
      {error && (
        <p id={describedBy} className="text-xs text-red-400 mt-1.5 text-right">{error.message}</p>
      )}
      {!error && warning && (
        <p id={describedBy} className="text-xs text-amber-400 mt-1.5 text-right">{warning.message}</p>
      )}
    </div>
  )
}

export default function BmiForm({ unit, form, errors, warnings, onChange, onCalculate, onReset }) {
  const heightLabel = unit === 'imperial' ? 'Height (in)' : 'Height (cm)'
  const weightLabel = unit === 'imperial' ? 'Mass (lbs)' : 'Mass (kg)'
  const heightPlaceholder = unit === 'imperial' ? '70' : '178'
  const weightPlaceholder = unit === 'imperial' ? '150' : '68'

  function handleSubmit(e) {
    e.preventDefault()
    onCalculate()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.length > 0 && (
        <div className="border border-red-800 px-3 py-2 mb-5" role="alert">
          <p className="text-xs text-red-400">Incomplete or invalid data — correct flagged fields to proceed</p>
        </div>
      )}

      <Row
        id="height"
        label={heightLabel}
        placeholder={heightPlaceholder}
        value={form.height}
        onChange={v => onChange('height', v)}
        error={fieldError(errors, 'height')}
        warning={fieldWarning(warnings, 'height')}
        describedBy="height-msg"
      />
      <Row
        id="weight"
        label={weightLabel}
        placeholder={weightPlaceholder}
        value={form.weight}
        onChange={v => onChange('weight', v)}
        error={fieldError(errors, 'weight')}
        warning={fieldWarning(warnings, 'weight')}
        describedBy="weight-msg"
      />
      <Row
        id="age"
        label="Age (opt.)"
        placeholder="25"
        value={form.age}
        onChange={v => onChange('age', v)}
        error={fieldError(errors, 'age')}
        warning={fieldWarning(warnings, 'age')}
        describedBy="age-msg"
      />

      <div className="flex gap-3 mt-8">
        <button
          type="submit"
          aria-label="Calculate BMI"
          className="flex-1 bg-teal-500 hover:bg-teal-400 text-gray-950 text-base tracking-wider uppercase py-3 transition-colors"
        >
          Analyze
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset form"
          className="px-5 bg-transparent hover:bg-gray-800 text-gray-500 hover:text-gray-300 text-base tracking-wider uppercase py-3 border border-gray-700 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  )
}
