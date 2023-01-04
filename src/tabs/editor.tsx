import PlayerContainer from '@/components/songs/player/container'

import { MdPlayArrow, MdPause, MdAdd, MdHelp } from 'react-icons/md'
import { RiCursorFill } from 'react-icons/ri'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'

import '@/styles/tabs/editor.scss'

import ButtonComponent from '@/components/elements/button'
import { PlayingState } from '@/@types/playing'

import EditorContainer from '@/components/editor/editor/container'
import {
  EditorSelectionMode,
  EditorType,
  EditorMode
} from '@/@types/editor-mode'

import {
  setState,
  setSelectionMode,
  setType,
  setMode,
  download
} from '@/store/items/editor'
import { useState } from 'react'

const getModeIcon = (mode: EditorSelectionMode) => {
  if (mode === EditorSelectionMode.Select) {
    return <RiCursorFill></RiCursorFill>
  } else if (mode === EditorSelectionMode.Add) {
    return <MdAdd></MdAdd>
  }
}

const selectionModeText = ['선택', '추가']
const modeText = ['metadata', 'timeline']
const typeText = ['일반', '텍스트']

const EditorTab = () => {
  const dispatch = useDispatch()
  const music = useSelector((state: RootState) => state.editor.music)
  const player = useSelector((state: RootState) => state.editor.player)
  const selectionMode = useSelector(
    (state: RootState) => state.editor.selectionMode
  )
  const mode = useSelector((state: RootState) => state.editor.mode)
  const type = useSelector((state: RootState) => state.editor.type)
  const [_, update] = useState<number>(0)
  const [playbackRate, setPlaybackRate] = useState(1)

  const playStateChange = () => {
    dispatch(
      setState(
        player.state === PlayingState.Playing
          ? PlayingState.Paused
          : PlayingState.Playing
      )
    )
  }

  const changePlayRate = (add: number) => {
    if (!player.instance) {
      return
    }

    let rate = playbackRate

    if (rate + add > 2) {
      rate = 0.25
    } else if (rate + add < 0.25) {
      rate = 2
    } else {
      rate += add
    }

    player.instance.setPlaybackRate(rate)
    setPlaybackRate(rate)
    update(Math.random())
  }

  const selectSelectionMode = () => {
    let to = selectionMode + 1

    if (typeof EditorSelectionMode[to] === 'undefined') {
      to = EditorSelectionMode.Select
    }

    dispatch(setSelectionMode(to))
  }

  const selectEditorMode = () => {
    let to = mode + 1

    if (typeof EditorMode[to] === 'undefined') {
      to = EditorMode.Metadata
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

  const done = () => {
    dispatch(
      dispatch({
        type: '@llct-editor/tabs/update',
        data: 2
      })
    )
  }

  const openHelpPage = () => {
    window.open(
      'https://llct.notion.site/385adb149c2c488dbc4ca1c77d9577f9',
      '_blank'
    )
  }

  return (
    <div className='tab'>
      <div className='title-zone'>
        <h1 className='music-title'>
          편집기 <span className='mute'>{music && music.title}</span>
        </h1>
        <PlayerContainer></PlayerContainer>
        <div className='control-zone'>
          <ButtonComponent onClick={openHelpPage}>
            <MdHelp></MdHelp> 도움말
          </ButtonComponent>
          <ButtonComponent onClick={selectEditorMode}>
            {modeText[mode]}
          </ButtonComponent>
          <ButtonComponent onClick={selectEditorType}>
            {typeText[type]} 편집기
          </ButtonComponent>
          <ButtonComponent onClick={selectSelectionMode}>
            선택 모드 : {getModeIcon(selectionMode)} (
            {selectionModeText[selectionMode]})
          </ButtonComponent>
          <ButtonComponent
            onClick={() => changePlayRate(0.25)}
            onRightClick={() => changePlayRate(-0.25)}
          >
            {player.instance && playbackRate}x
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

      <EditorContainer mode={mode}></EditorContainer>
    </div>
  )
}

export default EditorTab
