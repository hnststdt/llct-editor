import { RootState } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import YouTube from 'react-youtube'

import { setInstance, clearInstance } from '@/store/items/editor'
import { PlayingState } from '@/@types/playing'
import { EditorMode } from '@/@types/editor-mode'

interface PlayerComponentProps {
  audioSrc?: string
}

const PlayerComponent = ({ audioSrc }: PlayerComponentProps) => {
  const dispatch = useDispatch()

  const player = useSelector((state: RootState) => state.editor.player)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [initialized, setInitialized] = useState<boolean>(false)
  const mode = useSelector((state: RootState) => state.editor.mode)

  useEffect(() => {
    return () => {
      dispatch(clearInstance())
    }
  }, [])

  useEffect(() => {
    if (!player.sync || !player.instance || initialized) {
      return
    }

    player.sync.updateHook = () => {
      player.sync?.setTime(player.instance.getCurrentTime() * 100)
    }

    setInitialized(true)
  }, [player.instance, player.sync, initialized])

  useEffect(() => {
    if (!player.sync) {
      return
    }

    if (mode !== EditorMode.Timeline) {
      player.sync.stop()
    } else if (player.state === PlayingState.Playing) {
      player.sync.start()
    }
  }, [mode, player.sync])

  /**
   * audioSrc가 변경될 때 실행
   */
  useEffect(() => {
    if (!player.instance || !audioSrc) {
      return
    }

    player.instance.cueVideoById(audioSrc, 0, 'small')
  }, [player.instance, audioSrc])

  useEffect(() => {
    if (!player.instance) {
      return
    }

    if (player.state === PlayingState.Playing) {
      player.instance.playVideo()
    } else {
      player.instance.pauseVideo()
    }
  }, [loaded, player.state])

  useEffect(() => {
    if (!player.sync) {
      return
    }

    if (player.state === PlayingState.Playing) {
      player.sync.start()
    } else if (player.state === PlayingState.Paused) {
      player.sync.stop()
    }
  }, [player.state, player.sync])

  return (
    <YouTube
    className='player'
    videoId={audioSrc}
    opts={{width:200, height:200}}
    onReady={(event) => {
      dispatch(setInstance(event.target))
      setLoaded(true)}
    }
    onStateChange={(event) => {event.data == 3 ? player.sync?.fullRenderOnce() : {}}}
    />
  )
}

export default PlayerComponent
