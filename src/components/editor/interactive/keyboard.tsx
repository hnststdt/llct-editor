import { RootState } from '@/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { removeWord, undo, redo } from '@/store/items/editor'

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
    altKey?: boolean,
    shiftKey?: boolean
  ) => {
    let words = []

    for (let i = 0; i < selection.selected.length; i++) {
      let selected = selection.selected[i]

      let item = {
        line: selected.line,
        word: selected.word,
        datas: [
          {
            type,
            data:
              instance && Math.floor(instance.getCurrentTime() * 100) + offset
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
      let conf = confirm(
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
    } else if (ev.code === 'KeyZ' && (ev.ctrlKey || ev.metaKey)) {
      dispatch(undo())
    } else if (ev.code === 'Escape') {
      selection.clear()
    } else if (ev.code === 'KeyS') {
      propertiesKeypressHandler('start', ev.altKey, ev.shiftKey)
    } else if (ev.code === 'KeyW') {
      propertiesKeypressHandler('end', ev.altKey, ev.shiftKey)
    } else if (ev.code === 'BracketLeft') {
      propertiesKeypressHandler('start', true, false)
    } else if (ev.code === 'BracketRight') {
      propertiesKeypressHandler('end', true, false)
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
  }, [offset])

  return <></>
}

export default InteractiveEditorKeyboardComponent
