import { EditorMouseMode } from '@/@types/editor-mode'
import { PlayingState } from '@/@types/playing'

import EditorSelection from '@/core/selection'
import CallTimeSync from '@/core/timesync'

import WaveSurfer from 'wavesurfer.js'

interface EditorAction {
  type: string
  data: unknown
}

interface EditorStateTypes {
  music?: MusicMetadataWithID
  player: {
    state: PlayingState
    instance?: WaveSurfer
    sync?: CallTimeSync
  }
  contents?: LLCTCall
  mode: EditorMouseMode
  selection: EditorSelection
}

const EditorDefaults: EditorStateTypes = {
  player: {
    state: PlayingState.Paused
  },
  mode: EditorMouseMode.Select,
  selection: new EditorSelection()
}

export const setState = (play: PlayingState) => {
  return {
    type: '@llct-editor/editor/setState',
    data: play
  }
}

export const toggleState = () => {
  return {
    type: '@llct-editor/editor/setState'
  }
}

export const setInstance = (instance: WaveSurfer) => {
  return {
    type: '@llct-editor/editor/setInstance',
    data: instance
  }
}

export const updateContent = (data: LLCTCall) => {
  return {
    type: '@llct-editor/editor/updateContent',
    data: data
  }
}

export const removeWord = (data: { line: number; word: number }[]) => {
  return {
    type: '@llct-editor/editor/removeWords',
    data: data
  }
}

export const setMode = (data: EditorMouseMode) => {
  return {
    type: '@llct-editor/editor/setMode',
    data: data
  }
}

export const setSync = (data: CallTimeSync) => {
  return {
    type: '@llct-editor/editor/setSync',
    data: data
  }
}

export const undo = () => {
  return {
    type: '@llct-editor/editor/undo'
  }
}

const removeWordsHandler = (
  state = EditorDefaults,
  action: EditorAction
): EditorStateTypes => {
  if (!state.contents || !state.contents.timeline) {
    return state
  }

  let data = action.data as { line: number; word: number }[]
  let contents = JSON.parse(JSON.stringify(state.contents))

  for (let i = 0; i < data.length; i++) {
    let pos = data[i]
    contents.timeline[pos.line].words[
      pos.word
    ] = (null as unknown) as LLCTCallWord
  }

  contents.timeline = contents.timeline
    .map((line: LLCTCallLine) => {
      line.words = line.words.filter(v => v !== null)

      if (!line.words.length) {
        return null
      }

      return line
    })
    .filter((v: LLCTCallLine | null) => v !== null)

  return Object.assign({}, state, {
    contents
  })
}

const updateWrapper = (
  state = EditorDefaults,
  action: EditorAction,
  func: (state: typeof EditorDefaults, action: EditorAction) => EditorStateTypes
) => {
  let data = func(state, action)

  // TODO : works

  return data
}

const undoHandler = (
  state = EditorDefaults,
  action: EditorAction
): EditorStateTypes => {
  console.log(state, action)

  return state
}

const EditorReducer = (
  state = EditorDefaults,
  action: EditorAction
): EditorStateTypes => {
  switch (action.type) {
    case '@llct-editor/editor/setMusic':
      return Object.assign({}, state, {
        music: action.data
      })
    case '@llct-editor/editor/setState':
      return Object.assign(
        {},
        state,
        typeof action.data === 'undefined'
          ? {
              player: {
                ...state.player,
                state:
                  state.player.state === PlayingState.Playing
                    ? PlayingState.Paused
                    : PlayingState.Playing
              }
            }
          : {
              player: {
                ...state.player,
                state: action.data
              }
            }
      )
    case '@llct-editor/editor/setInstance':
      return Object.assign({}, state, {
        player: {
          ...state.player,
          instance: action.data
        }
      })
    case '@llct-editor/editor/updateContent':
      return updateWrapper(state, action, (state, action) => {
        return Object.assign({}, state, {
          contents: action.data
        })
      })
    case '@llct-editor/editor/removeWords':
      return updateWrapper(state, action, removeWordsHandler)
    case '@llct-editor/editor/undo':
      return undoHandler(state, action)
    case '@llct-editor/editor/setMode':
      return Object.assign({}, state, {
        mode: action.data
      })
    case '@llct-editor/editor/setSync':
      return Object.assign({}, state, {
        player: {
          ...state.player,
          sync: action.data
        }
      })
    default:
      return state
  }
}

export default EditorReducer
