import { RootState } from '@/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { removeWord, mergeWords, undo, redo } from '@/store/items/editor'
import WaveSurfer from 'wavesurfer.js'

interface InteractiveEditorKeyboardComponentProps {
  updateWords: (words: WordsUpdates[]) => void
  updateLines: (words: LinesUpdates[]) => void
}

const InteractiveEditorKeyboardComponent = ({
  updateWords,
  updateLines
}: InteractiveEditorKeyboardComponentProps) => {
  const dispatch = useDispatch()
  const instance = useSelector(
    (state: RootState) => state.editor.player.instance
  )
  const selection = useSelector((state: RootState) => state.editor.selection)
  const offset = useSelector((state: RootState) => state.editor.offset)

  const propertiesLineKeypressHandler = async (
    type: keyof LLCTCallLine,
    inst?: WaveSurfer,
    altKey?: boolean,
    shiftKey?: boolean
  ) => {
    const lines: LinesUpdates[] = []

    for (let i = 0; i < selection.selected.length; i++) {
      const selected = selection.selected[i]
      if (lines.filter(line => line.line === selected.line).length > 0) {
        continue
      }

      const item = {
        line: selected.line,
        word: selected.word,
        datas: [
          {
            type,
            data: await navigator.clipboard.readText()
          }
        ]
      }

      lines.push(item)

      if (altKey) {
        break
      }
    }
    if (altKey) {
      selection.remove(0)
    } else if (shiftKey) {
      selection.clear()
    }

    updateLines(lines)
  }

  const propertiesWordKeypressHandler = async (
    type: keyof LLCTCallWord,
    inst?: WaveSurfer,
    altKey?: boolean,
    shiftKey?: boolean
  ) => {
    const words = []

    for (let i = 0; i < selection.selected.length; i++) {
      const selected = selection.selected[i]

      let data: unknown = ''

      if (type === 'start' || type === 'end') {
        data = inst && Math.floor(inst.getCurrentTime() * 100) + offset
      } else {
        data = await navigator.clipboard.readText()
      }

      const item = {
        line: selected.line,
        word: selected.word,
        datas: [
          {
            type,
            data
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
    } else if (ev.code === 'KeyV' && (ev.metaKey || ev.ctrlKey)) {
      propertiesLineKeypressHandler('text', instance)
      selection.clear()
      activated = true
    } else if (ev.code === 'Escape') {
      selection.clear()
      activated = true
    } else if (ev.code === 'KeyS') {
      propertiesWordKeypressHandler('start', instance, ev.altKey, ev.shiftKey)
      activated = true
    } else if (ev.code === 'KeyW') {
      propertiesWordKeypressHandler('end', instance, ev.altKey, ev.shiftKey)
      activated = true
    } else if (ev.code === 'BracketLeft') {
      propertiesWordKeypressHandler('start', instance, true, false)
      activated = true
    } else if (ev.code === 'BracketRight') {
      propertiesWordKeypressHandler('end', instance, true, false)
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
