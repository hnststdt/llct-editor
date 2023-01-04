import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { toggleState } from '@/store/items/editor'
import { RootState } from '@/store'

const PlayerKeyboardControllerComponent = () => {
  const dispatch = useDispatch()
  const instance = useSelector(
    (state: RootState) => state.editor.player.instance
  )

  const handler = (ev: KeyboardEvent) => {
    if (
      (ev.target as HTMLElement).tagName === 'TEXTAREA' ||
      (ev.target as HTMLElement).tagName === 'INPUT'
    ) {
      return
    }

    let activated = false

    if (ev.code === 'Space') {
      dispatch(toggleState())

      activated = true
    } else if (ev.code === 'ArrowLeft') {
      instance && instance.seekTo(instance.getCurrentTime() - 0.3, true)

      activated = true
    } else if (ev.code === 'ArrowRight') {
      instance && instance.seekTo(instance.getCurrentTime() + 0.3, true)

      activated = true
    }

    if (activated) {
      ev.preventDefault()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [instance])

  return <></>
}

export default PlayerKeyboardControllerComponent
