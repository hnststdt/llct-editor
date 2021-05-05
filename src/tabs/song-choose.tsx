import SongsListContainer from '@/components/songs/lists/container'
import { useDispatch } from 'react-redux'

const SongChooseTab = () => {
  const dispatch = useDispatch()

  const click = (music: MusicMetadataWithID) => {
    dispatch({
      type: '@llct-editor/tabs/update',
      data: 1
    })

    dispatch({
      type: '@llct-editor/editor/setMusic',
      data: music
    })

    history.pushState(
      {
        music,
        page: 1
      },
      document.title,
      '/?id=' + music.id
    )
  }

  return (
    <div className='tab'>
      <div className='title'>
        <h1>곡 선택</h1>
        <p>콜표를 작성할 곡을 선택하세요.</p>
      </div>
      <SongsListContainer onClick={click}></SongsListContainer>
    </div>
  )
}

export default SongChooseTab
