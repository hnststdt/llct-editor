import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { toggleState } from '@/store/items/editor'
import { RootState } from '@/store'

const PlayerKeyboardControllerComponent = () => {
  const dispatch = useDispatch()
  const instance = useSelector(
    (state: RootState) => state.editor.player.instance
  )

  useEffect(() => {
    window.addEventListener('keydown', ev => {
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
        dispatch(instance && instance.skipBackward(-0.3))

        activated = true
      } else if (ev.code === 'ArrowRight') {
        dispatch(instance && instance.skipForward(0.3))

        activated = true
      }

      if (activated) {
        ev.preventDefault()
      }
    })
  }, [])

  return <></>
}

export default PlayerKeyboardControllerComponent
