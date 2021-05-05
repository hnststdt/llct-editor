import { RootState } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WaveSurfer from 'wavesurfer.js'

import { setInstance } from '@/store/items/editor'
import { PlayingState } from '@/@types/playing'
import { EditorMode } from '@/@types/editor-mode'

interface PlayerComponentProps {
  audioSrc?: string
}

const PlayerComponent = ({ audioSrc }: PlayerComponentProps) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)

  const player = useSelector((state: RootState) => state.editor.player)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [initialized, setInitialized] = useState<boolean>(false)
  const mode = useSelector((state: RootState) => state.editor.mode)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const wave = WaveSurfer.create({
      container: ref.current
    })

    wave.on('ready', () => {
      if (wave) {
        setLoaded(true)
      }
    })
    dispatch(setInstance(wave))

    return () => {
      if (player.instance && player.instance.isReady) {
        player.instance.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (!player.sync || !player.instance || initialized) {
      return
    }

    player.instance.on('audioprocess', () => {
      requestAnimationFrame(() => {
        player.sync!.setTime(player.instance!.getCurrentTime() * 100)
      })
    })

    player.instance.on('seek', () => {
      player.sync!.fullRenderOnce()
    })

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

    player.instance.load(audioSrc)
  }, [player.instance, audioSrc])

  useEffect(() => {
    if (!player.instance) {
      return
    }

    if (player.state === PlayingState.Playing) {
      player.instance.play()
    } else {
      player.instance.pause()
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
    <div className='player'>
      <div className='player-wave' ref={ref}></div>
      <audio id='editor-player'></audio>
    </div>
  )
}

export default PlayerComponent
