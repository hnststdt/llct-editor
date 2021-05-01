import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import PlayerComponent from './component'
import PlayerKeyboardControllerComponent from './keyboard-component'

import utils from '@/utils/data'

const PlayerContainer = () => {
  const songs = useSelector((state: RootState) => state.editor.music)

  return (
    <>
      <PlayerKeyboardControllerComponent></PlayerKeyboardControllerComponent>
      <PlayerComponent
        audioSrc={songs && utils.getAudioURL(songs)}
      ></PlayerComponent>
    </>
  )
}

export default PlayerContainer
