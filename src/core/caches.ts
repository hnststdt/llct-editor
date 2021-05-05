const NAMESPACE = '@llct-editor/saved/'

export const save = (id: string, data: LLCTCall) => {
  const saveData = JSON.stringify({
    lastSaved: Date.now(),
    data
  })

  localStorage.setItem(`${NAMESPACE}${id}`, saveData)
}

export const load = (id: string) => {
  let item = localStorage.getItem(
    id.indexOf(NAMESPACE) > -1 ? id : `${NAMESPACE}${id}`
  )

  if (!item) {
    return
  }

  let parsed

  try {
    parsed = JSON.parse(item)
  } catch (e) {
    return null
  }

  if (!parsed.lastSaved || !parsed.data) {
    return
  }

  return parsed
}

export const clearOldItems = () => {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i)

    if (!key) {
      continue
    }

    if (key.indexOf(NAMESPACE) > -1) {
      let data = load(key)

      if (Date.now() - data.lastSaved > 2629800000) {
        localStorage.removeItem(key)
      }
    }
  }
}

export default {
  save,
  load,
  clearOldItems
}
