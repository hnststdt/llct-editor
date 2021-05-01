import { useEffect } from 'react'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'

import { updateContent } from '@/store/items/editor'

const EditorDataContainer = () => {
  const dispatch = useDispatch()
  const music = useSelector((state: RootState) => state.editor.music)
  const call = useSelector((state: RootState) => state.call)

  useEffect(() => {
    if (!music || !music.id) {
      return
    }

    dispatch({
      type: '@llct-editor/api_call/request',
      data: music.id
    })
  }, [music])

  useEffect(() => {
    if (!call.items) {
      return
    }

    dispatch(updateContent(call.items))
  }, [call])

  return <></>
}

export default EditorDataContainer
