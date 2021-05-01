import PlayerContainer from '@/components/songs/player/container'

import { MdPlayArrow, MdPause, MdAdd, MdRemove } from 'react-icons/md'
import { RiCursorFill } from 'react-icons/ri'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'

import '@/styles/tabs/editor.scss'

import ButtonComponent from '@/components/elements/button'
import { PlayingState } from '@/@types/playing'

import EditorContainer from '@/components/editor/editor/container'
import { EditorMouseMode, EditorType } from '@/@types/editor-mode'

import { setState, setMode, setType } from '@/store/items/editor'

const getModeIcon = (mode: EditorMouseMode) => {
  if (mode === EditorMouseMode.Select) {
    return <RiCursorFill></RiCursorFill>
  } else if (mode === EditorMouseMode.Add) {
    return <MdAdd></MdAdd>
  }
}

const modeText = ['선택', '추가']
const typeText = ['일반', '텍스트']

const EditorTab = () => {
  const dispatch = useDispatch()
  const music = useSelector((state: RootState) => state.editor.music)
  const player = useSelector((state: RootState) => state.editor.player)
  const mode = useSelector((state: RootState) => state.editor.mode)
  const type = useSelector((state: RootState) => state.editor.type)

  const playStateChange = () => {
    dispatch(
      setState(
        player.state === PlayingState.Playing
          ? PlayingState.Paused
          : PlayingState.Playing
      )
    )
  }

  const selectMouseMode = () => {
    let to = mode + 1

    if (typeof EditorMouseMode[to] === 'undefined') {
      to = EditorMouseMode.Select
    }

    dispatch(setMode(to))
  }

  const selectEditorType = () => {
    let to = type + 1

    if (typeof EditorType[to] === 'undefined') {
      to = EditorType.Interactive
    }

    dispatch(setType(to))
  }

  const done = () => {}

  return (
    <div className='tab'>
      <div className='title-zone'>
        <h1 className='music-title'>
          편집기 <span className='mute'>{music && music.title}</span>
        </h1>
        <div className='control-zone'>
          <ButtonComponent onClick={selectEditorType}>
            {typeText[type]} 편집기
          </ButtonComponent>
          <ButtonComponent onClick={selectMouseMode}>
            편집기 모드 : {getModeIcon(mode)} ({modeText[mode]})
          </ButtonComponent>
          <ButtonComponent onClick={playStateChange}>
            {player.state === PlayingState.Playing ? (
              <MdPause></MdPause>
            ) : (
              <MdPlayArrow></MdPlayArrow>
            )}
          </ButtonComponent>
          <ButtonComponent
            text='완료'
            theme='primary'
            onClick={done}
          ></ButtonComponent>
        </div>
      </div>

      <PlayerContainer></PlayerContainer>
      <EditorContainer></EditorContainer>
    </div>
  )
}

export default EditorTab
