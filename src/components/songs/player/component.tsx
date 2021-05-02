import { RootState } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WaveSurfer from 'wavesurfer.js'

import { setInstance } from '@/store/items/editor'
import { PlayingState } from '@/@types/playing'

interface PlayerComponentProps {
  audioSrc?: string
}

const PlayerComponent = ({ audioSrc }: PlayerComponentProps) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)

  const player = useSelector((state: RootState) => state.editor.player)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [initialized, setInitialized] = useState<boolean>(false)

  /**
   * 플레이어 ref가 지정될 때 실행, WaveSurfer 초기화
   */
  useEffect(() => {
    if (!ref.current || player.instance) {
      return
    }

    const wave = WaveSurfer.create({
      container: ref.current
    })

    wave.on('ready', () => {
      setLoaded(true)
    })

    dispatch(setInstance(wave))
  }, [ref.current])

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

  /**
   * audioSrc가 변경될 때 실행
   */
  useEffect(() => {
    if (!player.instance || !audioSrc) {
      return
    }

    player.instance.load(audioSrc)
  }, [player.instance, audioSrc])

  /**
   * 플레이어 로드 완료시 실행
   */
  useEffect(() => {
    if (!player.instance) {
      return
    }

    if (player.state === PlayingState.Playing) {
      player.instance.play()
    } else {
      player.instance.pause()
    }
  }, [loaded])

  useEffect(() => {
    if (!player.instance) {
      return
    }

    if (player.state === PlayingState.Playing) {
      player.instance.play()
    } else {
      player.instance.pause()
    }

    // dispatch(setState(player.state))
  }, [player.state])

  useEffect(() => {
    if (!player.sync) {
      return
    }

    if (player.state === PlayingState.Playing) {
      player.sync.start()
    } else {
      player.sync.stop()
    }

    // dispatch(setState(player.state))
  }, [player.state])

  return (
    <div className='player'>
      <div className='player-wave' ref={ref}></div>
      <audio id='editor-player'></audio>
    </div>
  )
}

export default PlayerComponent
