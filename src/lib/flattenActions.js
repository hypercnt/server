export const flattenActions = a => {
  const b = {}
  Object.keys(a).forEach(k => {
    const act = a[k]
    if (typeof act === 'object') {
      b[k] = flattenActions(a[k])
    } else if (typeof act === 'function') {
      b[k] = 'action'
    }
  })

  return b
}

export default flattenActions
