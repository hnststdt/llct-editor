interface CallAction {
  type: string
  data: unknown | null
  error?: Error | null
}

interface CallStateTypes {
  items?: LLCTCall
  error?: Error | null
}

const CallDefaults: CallStateTypes = {}

const CallReducer = (
  state = CallDefaults,
  action: CallAction
): CallStateTypes => {
  switch (action.type) {
    case '@llct-editor/api_call/success':
      return Object.assign({}, state, {
        items: action.data,
        error: null
      })
    case '@llct-editor/api_call/failed':
      return Object.assign({}, state, {
        items: null,
        error: action.error
      })
    default:
      return state
  }
}

export default CallReducer
