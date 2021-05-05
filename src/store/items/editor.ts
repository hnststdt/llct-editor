import {
  EditorMode,
  EditorSelectionMode,
  EditorType
} from '@/@types/editor-mode'
import { PlayingState } from '@/@types/playing'
import caches from '@/core/caches'
import WorkHistory from '@/core/history'

import EditorSelection from '@/core/selection'
import CallTimeSync from '@/core/timesync'

import WaveSurfer from 'wavesurfer.js'

interface EditorAction {
  type: string
  data: unknown
  saveToCache?: boolean
}

interface EditorStateTypes {
  music?: MusicMetadataWithID
  player: {
    state: PlayingState
    instance?: WaveSurfer
    sync?: CallTimeSync
  }
  contents?: LLCTCall
  selectionMode: EditorSelectionMode
  mode: EditorMode
  offset: number
  type: EditorType
  selection: EditorSelection
}

const EditorDefaults: EditorStateTypes = {
  player: {
    state: PlayingState.Paused
  },
  selectionMode: EditorSelectionMode.Select,
  mode: EditorMode.Metadata,
  offset: -10,
  type: EditorType.Interactive,
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

export const updateContent = (data: LLCTCall, systemChanges?: boolean) => {
  if (!systemChanges) {
    if (!data.metadata) {
      data.metadata = {}
    }

    if (!data.metadata.editor) {
      data.metadata.editor = {}
    }

    data.metadata.editor.lastEdit = Date.now()
  }

  return {
    type: '@llct-editor/editor/updateContent',
    data,
    saveToCache: !systemChanges
  }
}

export const removeWord = (data: { line: number; word: number }[]) => {
  return {
    type: '@llct-editor/editor/removeWords',
    data: data
  }
}

export const setSelectionMode = (data: EditorSelectionMode) => {
  return {
    type: '@llct-editor/editor/setSelectionMode',
    data: data
  }
}

export const setType = (data: EditorType) => {
  return {
    type: '@llct-editor/editor/setType',
    data: data
  }
}

export const setOffset = (data: number) => {
  return {
    type: '@llct-editor/editor/setOffset',
    data: data
  }
}

export const setMode = (data: EditorMode) => {
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

export const redo = () => {
  return {
    type: '@llct-editor/editor/redo'
  }
}

export const download = () => {
  return {
    type: '@llct-editor/editor/requestDownload'
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

const histories = new WorkHistory()

const updateWrapper = (
  state = EditorDefaults,
  action: EditorAction,
  func: (state: typeof EditorDefaults, action: EditorAction) => EditorStateTypes
) => {
  let data = func(state, action)

  if (data.contents) {
    histories.add((data.contents as unknown) as Record<string, unknown>)
  }

  return data
}

const undoHandler = (state = EditorDefaults): EditorStateTypes => {
  return Object.assign({}, state, {
    contents: histories.goBack()
  })
}

const redoHandler = (state = EditorDefaults): EditorStateTypes => {
  return Object.assign({}, state, {
    contents: histories.goForward()
  })
}

const downloadHandler = (contents: LLCTCall | undefined) => {
  if (!contents) {
    return
  }

  let obj = JSON.stringify(contents)

  let blob = new Blob([obj], { type: 'application/json' })
  let elem = document.createElement('a')
  elem.href = URL.createObjectURL(blob)

  elem.download = 'karaoke.json'
  document.body.appendChild(elem)
  elem.click()
  document.body.removeChild(elem)
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
        if (state.music && action.saveToCache) {
          caches.save(state.music && state.music.id, action.data as LLCTCall)
        }

        return Object.assign({}, state, {
          contents: action.data
        })
      })
    case '@llct-editor/editor/removeWords':
      return updateWrapper(state, action, removeWordsHandler)
    case '@llct-editor/editor/undo':
      return undoHandler(state)
    case '@llct-editor/editor/redo':
      return redoHandler(state)
    case '@llct-editor/editor/setSelectionMode':
      return Object.assign({}, state, {
        selectionMode: action.data
      })
    case '@llct-editor/editor/setMode':
      return Object.assign({}, state, {
        mode: action.data
      })
    case '@llct-editor/editor/setType':
      return Object.assign({}, state, {
        type: action.data
      })
    case '@llct-editor/editor/setOffset':
      return Object.assign({}, state, {
        offset: action.data
      })
    case '@llct-editor/editor/setSync':
      return Object.assign({}, state, {
        player: {
          ...state.player,
          sync: action.data
        }
      })
    case '@llct-editor/editor/requestDownload':
      downloadHandler(state.contents)
      return state
    default:
      return state
  }
}

export default EditorReducer
