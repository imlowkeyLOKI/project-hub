export function calcBmi(height, weight, unit) {
  const h = parseFloat(height)
  const w = parseFloat(weight)
  if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return null

  let bmi
  if (unit === 'imperial') {
    bmi = (703 * w) / (h * h)
  } else {
    const meters = h / 100
    bmi = w / (meters * meters)
  }

  return Math.round(bmi * 10) / 10
}

export function getCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-sky-400' }
  if (bmi < 25) return { label: 'Normal', color: 'text-teal-400' }
  if (bmi < 30) return { label: 'Overweight', color: 'text-amber-400' }
  return { label: 'Obese', color: 'text-red-400' }
}
