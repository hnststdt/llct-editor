import { useEffect, useState } from 'react'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'

import { updateContent } from '@/store/items/editor'

import caches from '@/core/caches'

const EditorDataContainer = () => {
  const dispatch = useDispatch()
  const music = useSelector((state: RootState) => state.editor.music)
  const call = useSelector((state: RootState) => state.call)
  const [useLocalFile, setUseLocalFile] = useState<boolean>(false)

  useEffect(() => {
    if (!music || !music.id) {
      return
    }

    setUseLocalFile(false)

    let cache = caches.load(music.id)
    if (cache && cache.data) {
      let check = confirm(
        new Date(cache.lastSaved).toLocaleString() +
          '에 저장된 데이터가 있습니다. 이 파일을 불러올까요?'
      )

      if (check) {
        dispatch(updateContent(cache.data, true))
        setUseLocalFile(true)

        return
      }
    }

    dispatch({
      type: '@llct-editor/api_call/request',
      data: music.id
    })
  }, [music])

  useEffect(() => {
    if (!call.items || useLocalFile) {
      return
    }

    dispatch(updateContent(call.items, true))
  }, [call])

  useEffect(() => {
    window.onbeforeunload = () => {
      return ''
    }

    return () => {
      window.onbeforeunload = null
    }
  }, [])

  return <></>
}

export default EditorDataContainer
