interface TabsAction {
  type: string
  data: number
}

interface TabStateTypes {
  current: number
}

const TabsDefaults: TabStateTypes = {
  current: 0
}

const TabsReducer = (
  state = TabsDefaults,
  action: TabsAction
): TabStateTypes => {
  switch (action.type) {
    case '@llct-editor/tabs/update':
      return Object.assign({}, state, {
        current: action.data
      })
    default:
      return state
  }
}

export default TabsReducer
