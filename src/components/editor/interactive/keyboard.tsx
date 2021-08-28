import { RootState } from '@/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { removeWord, mergeWords, undo, redo } from '@/store/items/editor'
import WaveSurfer from 'wavesurfer.js'

interface InteractiveEditorKeyboardComponentProps {
  updateWords: (words: WordsUpdates[]) => void
}

const InteractiveEditorKeyboardComponent = ({
  updateWords
}: InteractiveEditorKeyboardComponentProps) => {
  const dispatch = useDispatch()
  const instance = useSelector(
    (state: RootState) => state.editor.player.instance
  )
  const selection = useSelector((state: RootState) => state.editor.selection)
  const offset = useSelector((state: RootState) => state.editor.offset)

  const propertiesKeypressHandler = (
    type: keyof LLCTCallWord,
    inst?: WaveSurfer,
    altKey?: boolean,
    shiftKey?: boolean
  ) => {
    const words = []

    for (let i = 0; i < selection.selected.length; i++) {
      const selected = selection.selected[i]

      const item = {
        line: selected.line,
        word: selected.word,
        datas: [
          {
            type,
            data: inst && Math.floor(inst.getCurrentTime() * 100) + offset
          }
        ]
      }

      words.push(item)

      if (altKey) {
        break
      }
    }

    if (altKey) {
      selection.remove(0)
    } else if (shiftKey) {
      selection.clear()
    }

    updateWords(words)
  }

  const keydownEvent = (ev: KeyboardEvent) => {
    if (
      (ev.target as HTMLElement).tagName === 'TEXTAREA' ||
      (ev.target as HTMLElement).tagName === 'INPUT'
    ) {
      return
    }

    let activated = false

    if (
      (ev.code === 'Backspace' || ev.code === 'Delete') &&
      selection.selected.length
    ) {
      const conf = confirm(
        `정말로 선택된 ${selection.selected.length}개의 단어를 제거할까요?`
      )

      if (conf) {
        dispatch(removeWord(selection.selected))

        selection.clear()
      }

      activated = true
    } else if (
      ev.code === 'KeyZ' &&
      ev.shiftKey &&
      (ev.ctrlKey || ev.metaKey)
    ) {
      dispatch(redo())
      activated = true
    } else if (ev.code === 'KeyZ' && (ev.ctrlKey || ev.metaKey)) {
      dispatch(undo())
      activated = true
    } else if (ev.code === 'KeyD' && ev.altKey) {
      dispatch(mergeWords(selection.selected))
      selection.clear()
      activated = true
    } else if (ev.code === 'Escape') {
      selection.clear()
      activated = true
    } else if (ev.code === 'KeyS') {
      propertiesKeypressHandler('start', instance, ev.altKey, ev.shiftKey)
      activated = true
    } else if (ev.code === 'KeyW') {
      propertiesKeypressHandler('end', instance, ev.altKey, ev.shiftKey)
      activated = true
    } else if (ev.code === 'BracketLeft') {
      propertiesKeypressHandler('start', instance, true, false)
      activated = true
    } else if (ev.code === 'BracketRight') {
      propertiesKeypressHandler('end', instance, true, false)
      activated = true
    }

    if (activated) {
      ev.preventDefault()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', keydownEvent)

    return () => {
      window.removeEventListener('keydown', keydownEvent)
    }
  }, [offset, instance])

  return <></>
}

export default InteractiveEditorKeyboardComponent
