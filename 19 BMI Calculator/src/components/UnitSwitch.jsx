export default function UnitSwitch({ unit, onChange }) {
  return (
    <div
      className="relative flex border border-gray-600 p-0.5 w-16"
      role="radiogroup"
      aria-label="Unit system"
    >
      <div
        className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-teal-500 transition-transform duration-200 ease-out ${
          unit === 'metric' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
        }`}
      />
      <button
        role="radio"
        aria-checked={unit === 'imperial'}
        aria-label="Imperial units (inches, pounds)"
        title="Imperial"
        onClick={() => onChange('imperial')}
        className={`relative z-10 flex-1 py-0.5 text-xs font-mono transition-colors duration-200 ${
          unit === 'imperial' ? 'text-gray-950 font-bold' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        I
      </button>
      <button
        role="radio"
        aria-checked={unit === 'metric'}
        aria-label="Metric units (centimeters, kilograms)"
        title="Metric"
        onClick={() => onChange('metric')}
        className={`relative z-10 flex-1 py-0.5 text-xs font-mono transition-colors duration-200 ${
          unit === 'metric' ? 'text-gray-950 font-bold' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        M
      </button>
    </div>
  )
}
