import { useEffect } from 'react'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'

const getMusicByID = (
  id: string,
  store: LLCTSongDataV2
): MusicMetadataWithID | null => {
  if (!store || !store.songs) {
    return null
  }

  return {
    ...store.songs[Number(id.substring(0, 1))][Number(id.substring(1)) - 1],
    id
  }
}

const SongsDataContainer = () => {
  const dispatch = useDispatch()
  const songs = useSelector((state: RootState) => state.songs.items)

  useEffect(() => {
    if (!songs) {
      return
    }

    let id = new URL(window.location.href).searchParams.get('id')

    if (!id) {
      return
    }

    const music = getMusicByID(id, songs)

    if (id && music) {
      dispatch({
        type: '@llct-editor/tabs/update',
        data: 1
      })

      dispatch({
        type: '@llct-editor/editor/setMusic',
        data: music
      })
    }
  }, [songs])

  return <></>
}

export default SongsDataContainer
