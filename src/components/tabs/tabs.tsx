import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import SongChooseTab from '@/tabs/song-choose'
import EditorTab from '@/tabs/editor'
import DoneTab from '@/tabs/done'

import '@/styles/tab.scss'

export const tabs = [
  {
    id: 'song-choose',
    element: <SongChooseTab></SongChooseTab>,
    title: '곡 선택'
  },
  {
    id: 'editor',
    element: <EditorTab></EditorTab>,
    title: '가사 작성'
  },
  {
    id: 'done',
    element: <DoneTab></DoneTab>,
    title: '완료'
  }
]

const TabsContainer = () => {
  const currentTab = useSelector((state: RootState) => state.tabs.current)
  const dispatch = useDispatch()

  useEffect(() => {
    window.addEventListener('popstate', ev => {
      let tab = 0

      let id = new URL(location.href).searchParams.get('id')

      if (ev.state && typeof ev.state.page !== 'undefined') {
        tab = ev.state.page
      } else if (id !== null) {
        tab = 1
      }

      dispatch({
        type: '@llct-editor/tabs/update',
        data: tab
      })
    })
  }, [])

  return <div className='tab-container'>{tabs[currentTab].element}</div>
}

export default TabsContainer
