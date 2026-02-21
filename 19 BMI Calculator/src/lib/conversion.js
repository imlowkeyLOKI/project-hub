import { LIMITS } from './validation'

export function convert(form, toUnit) {
  const warnings = []
  let height = ''
  let weight = ''

  if (form.height) {
    const h = parseFloat(form.height)
    if (!isNaN(h)) {
      const converted = toUnit === 'metric' ? h * 2.54 : h / 2.54
      const [min, max] = LIMITS[toUnit].height.hard
      if (converted >= min && converted <= max) {
        height = (Math.round(converted * 100) / 100).toString()
      } else {
        warnings.push(`Height conversion (${converted.toFixed(1)}) exceeds ${toUnit} parameters`)
      }
    }
  }

  if (form.weight) {
    const w = parseFloat(form.weight)
    if (!isNaN(w)) {
      const converted = toUnit === 'metric' ? w * 0.45359237 : w / 0.45359237
      const [min, max] = LIMITS[toUnit].weight.hard
      if (converted >= min && converted <= max) {
        weight = (Math.round(converted * 100) / 100).toString()
      } else {
        warnings.push(`Mass conversion (${converted.toFixed(1)}) exceeds ${toUnit} parameters`)
      }
    }
  }

  return { height, weight, warnings }
}
