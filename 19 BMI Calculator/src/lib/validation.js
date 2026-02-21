export const LIMITS = {
  imperial: {
    height: { hard: [10, 120], soft: [48, 84], label: 'Height (in)' },
    weight: { hard: [30, 1500], soft: [80, 400], label: 'Mass (lbs)' },
  },
  metric: {
    height: { hard: [25, 250], soft: [120, 210], label: 'Height (cm)' },
    weight: { hard: [10, 700], soft: [35, 180], label: 'Mass (kg)' },
  },
  age: { hard: [1, 120] },
}

export function sanitize(value) {
  let s = value.replace(/[^0-9.]/g, '').trim()
  const first = s.indexOf('.')
  if (first !== -1) {
    s = s.slice(0, first + 1) + s.slice(first + 1).replace(/\./g, '')
  }
  return s
}

export function validate(form, unit) {
  const errors = []
  const warnings = []
  const limits = LIMITS[unit]

  const height = parseFloat(form.height)
  const weight = parseFloat(form.weight)
  const age = form.age ? parseFloat(form.age) : null

  if (!form.height || isNaN(height)) {
    errors.push({ field: 'height', message: 'Height is required to calculate index' })
  } else {
    const [hMin, hMax] = limits.height.hard
    const [sMin, sMax] = limits.height.soft
    if (height < hMin || height > hMax) {
      errors.push({ field: 'height', message: `Enter a value between ${hMin} and ${hMax}` })
    } else if (height < sMin || height > sMax) {
      warnings.push({ field: 'height', message: 'Value outside typical range — verify entry' })
    }
  }

  if (!form.weight || isNaN(weight)) {
    errors.push({ field: 'weight', message: 'Mass is required to calculate index' })
  } else {
    const [wMin, wMax] = limits.weight.hard
    const [sMin, sMax] = limits.weight.soft
    if (weight < wMin || weight > wMax) {
      errors.push({ field: 'weight', message: `Enter a value between ${wMin} and ${wMax}` })
    } else if (weight < sMin || weight > sMax) {
      warnings.push({ field: 'weight', message: 'Value outside typical range — verify entry' })
    }
  }

  if (age !== null) {
    const [aMin, aMax] = LIMITS.age.hard
    if (isNaN(age) || age < aMin || age > aMax) {
      errors.push({ field: 'age', message: `Enter a value between ${aMin} and ${aMax}` })
    } else if (age < 18) {
      warnings.push({ field: 'age', message: 'Pediatric patient — adult categories may not apply' })
    }
  }

  return { errors, warnings }
}
