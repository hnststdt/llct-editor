import { RootState } from '@/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import '@/styles/songs/lists.scss'

import SongsListComponent from './component'

const flattenize = (metadata: MusicMetadata[][]) => {
  let groups = metadata
    .map((group, groupIndex) => {
      return group.map((song, songIndex) => {
        return {
          ...song,
          id: `${groupIndex}${songIndex + 1}`
        }
      })
    })
    .flat(1)

  return groups
}

interface SongsListContainerProps {
  onClick: (id: MusicMetadataWithID) => void
}

const SongsListContainer = ({ onClick }: SongsListContainerProps) => {
  const songs = useSelector((state: RootState) => state.songs)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!songs.items) {
      dispatch({
        type: '@llct-editor/api_songs/request'
      })
    }
  }, [])

  if (songs.error) {
    return (
      <div>서버 연결에 오류가 있어 노래 목록을 불러올 수 없습니다.</div>
    )
  }

  const items =
    (songs.items && songs.items.songs && flattenize(songs.items.songs)) || []

  return (
    <SongsListComponent items={items} onClick={onClick}></SongsListComponent>
  )
}

export default SongsListContainer
