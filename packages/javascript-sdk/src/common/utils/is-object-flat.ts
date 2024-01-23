export const isObjectFlat = (object: Record<string, any>): boolean => {
  return Object.keys(object).every((key) => {
    const value = object[key]
    // Check if the value is a non-null object or an array
    return !(value && (typeof value === 'object' || Array.isArray(value)))
  })
}
