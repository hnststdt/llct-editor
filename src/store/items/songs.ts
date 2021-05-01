interface SongsAction {
  type: string
  data: LLCTSongDataV2 | Record<string, unknown>
  error?: Error
}

interface SongStateTypes {
  items?: LLCTSongDataV2
  error?: Error
}

const SongsDefaults: SongStateTypes = {}

const SongsReducer = (
  state = SongsDefaults,
  action: SongsAction
): SongStateTypes => {
  switch (action.type) {
    case '@llct-editor/api_songs/success':
      return Object.assign({}, state, {
        items: action.data
      })
    case '@llct-editor/api_songs/failed':
      return Object.assign({}, state, {
        items: undefined,
        error: action.error
      })
    default:
      return state
  }
}

export default SongsReducer
