import { RootState } from '@/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { removeWord, undo, redo } from '@/store/items/editor'

const InteractiveEditorKeyboardComponent = () => {
  const dispatch = useDispatch()
  const selection = useSelector((state: RootState) => state.editor.selection)

  useEffect(() => {
    window.addEventListener('keydown', ev => {
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
      }

      if (activated) {
        ev.preventDefault()
      }
    })
  }, [])

  return <></>
}

export default InteractiveEditorKeyboardComponent
