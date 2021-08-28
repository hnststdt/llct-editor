import {
  EditorMode,
  EditorSelectionMode,
  EditorType
} from '@/@types/editor-mode'
import { PlayingState } from '@/@types/playing'
import caches from '@/core/caches'
import WorkHistory from '@/core/history'

import EditorSelection, { EditorSelected } from '@/core/selection'
import CallTimeSync from '@/core/timesync'
import calls from '@/utils/call'

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

const updatePreHandler = (data: LLCTCall, saveToCache?: boolean) => {
  if (saveToCache) {
    if (!data.metadata) {
      data.metadata = {}
    }

    if (!data.metadata.editor) {
      data.metadata.editor = {}
    }

    data.metadata.editor.lastEdit = Date.now()
  }

  data = calls.correctLineStartEndTime(data)

  return data
}

export const updateContent = (data: LLCTCall, systemChanges?: boolean) => {
  return {
    type: '@llct-editor/editor/updateContent',
    data,
    saveToCache: !systemChanges
  }
}

export const updateWordsContents = (words: WordsUpdates[]) => {
  return {
    type: '@llct-editor/editor/updateWords',
    data: words,
    saveToCache: true
  }
}

export const updateLinesContents = (lines: LinesUpdates[]) => {
  return {
    type: '@llct-editor/editor/updateLines',
    data: lines,
    saveToCache: true
  }
}

export const removeWord = (data: { line: number; word: number }[]) => {
  return {
    type: '@llct-editor/editor/removeWords',
    data: data,
    saveToCache: true
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

export const mergeWords = (words: EditorSelected[]) => {
  return {
    type: '@llct-editor/editor/mergeWords',
    data: words,
    saveToCache: true
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

  const data = action.data as { line: number; word: number }[]
  const contents = JSON.parse(JSON.stringify(state.contents))

  for (let i = 0; i < data.length; i++) {
    const pos = data[i]
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

  updatePreHandler(contents, action.saveToCache)

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
  const data = func(state, action)

  if (data.contents) {
    histories.add((data.contents as unknown) as Record<string, unknown>)
  }

  if (state.music && action.saveToCache) {
    caches.save(state.music && state.music.id, data.contents as LLCTCall)
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

  const obj = JSON.stringify(contents)

  const blob = new Blob([obj], { type: 'application/json' })
  const elem = document.createElement('a')
  elem.href = URL.createObjectURL(blob)

  elem.download = 'karaoke-' + new Date().toISOString() + '.json'
  document.body.appendChild(elem)
  elem.click()
  document.body.removeChild(elem)
}

const updateWordsHandler = (
  state: typeof EditorDefaults,
  action: EditorAction
): EditorStateTypes => {
  if (!state.contents || !state.contents.timeline) {
    return state
  }

  const contents = Object.assign({}, state.contents)
  const words = action.data as WordsUpdates[]

  for (let i = 0; i < words.length; i++) {
    const updates = words[i]

    for (let d = 0; d < updates.datas.length; d++) {
      const data = updates.datas[d]
      contents.timeline[updates.line].words[updates.word][
        data.type
      ] = data.data as never
    }
  }

  updatePreHandler(contents, action.saveToCache)

  return {
    ...state,
    contents
  }
}

const mergeWordsHandler = (
  state: typeof EditorDefaults,
  action: EditorAction
): EditorStateTypes => {
  if (!state.contents || !state.contents.timeline) {
    return state
  }

  let contents = Object.assign({}, state.contents)
  const words = action.data as EditorSelected[]

  let texts = ''
  for (let i = 0; i < words.length; i++) {
    const updates = words[i]
    if (i == 0) {
      continue
    }

    texts += contents.timeline[updates.line].words[updates.word].text

    contents = removeWordsHandler(state, {
      type: '',
      data: [
        {
          line: updates.line,
          word: updates.word
        }
      ]
    }).contents!
  }

  if (words.length) {
    contents.timeline[words[0].line].words[words[0].word].text += texts
  }

  updatePreHandler(contents, action.saveToCache)

  return {
    ...state,
    contents
  }
}

const updateLinesHandler = (
  state: typeof EditorDefaults,
  action: EditorAction
): EditorStateTypes => {
  if (!state.contents || !state.contents.timeline) {
    return state
  }

  const contents = Object.assign({}, state.contents)
  const lines = action.data as LinesUpdates[]

  for (let i = 0; i < lines.length; i++) {
    const updates = lines[i]

    for (let d = 0; d < updates.datas.length; d++) {
      const data = updates.datas[d]
      contents.timeline[updates.line][data.type] = data.data as never
    }
  }

  updatePreHandler(contents, action.saveToCache)

  return {
    ...state,
    contents
  }
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
        updatePreHandler(action.data as LLCTCall, action.saveToCache)

        return Object.assign({}, state, {
          contents: action.data
        })
      })
    case '@llct-editor/editor/updateWords':
      return updateWrapper(state, action, updateWordsHandler)
    case '@llct-editor/editor/mergeWords':
      return updateWrapper(state, action, mergeWordsHandler)
    case '@llct-editor/editor/updateLines':
      return updateWrapper(state, action, updateLinesHandler)
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
