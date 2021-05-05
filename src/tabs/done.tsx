import ButtonComponent from '@/components/elements/button'
import { download } from '@/store/items/editor'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import '@/styles/tabs/done.scss'
import { RootState } from '@/store'

const DoneTab = () => {
  const dispatch = useDispatch()
  const music = useSelector((state: RootState) => state.editor.music)

  const goTab = (id: number) => {
    dispatch({
      type: '@llct-editor/tabs/update',
      data: id
    })
  }

  const clickDownload = () => {
    dispatch(download())
  }

  const title = `${(music && music.title) || '노래 제목'} (${(music &&
    music.id) ||
    '노래 ID'})`

  const body = `**곡 이름, ID :**
${title}

**기타 사항이 있으면 알려주세요.**

> 파일을 이 곳에 끌어다 놓거나 아래에서 파일을 선택해주세요. Github 이슈는 JSON 파일을 지원하지 않으니 .zip 파일로 압축해서 올려주세요. 감사합니다!
`

  const goToGithubIssue = () => {
    window.open(
      `https://github.com/So-chiru/llct-editor/issues/new?assignees=So-chiru&labels=call&title=${encodeURIComponent(
        '콜표 작업 : ' + title
      )}&body=${encodeURIComponent(body)}`,
      'about:blank'
    )
  }

  return (
    <div className='tab done-tab'>
      <h1>완료</h1>

      <ButtonComponent
        text='파일 다운로드'
        theme='primary'
        onClick={clickDownload}
      ></ButtonComponent>

      <p>
        {' '}
        작업을 완료 했습니다. 작업된 파일을 받아{' '}
        <a onClick={goToGithubIssue}>Github Issue</a>에 올려주세요.
      </p>

      <div className='button-group'>
        <ButtonComponent
          onClick={() => goTab(1)}
          text='편집 페이지로 돌아가기'
        ></ButtonComponent>
        <ButtonComponent
          theme='primary'
          onClick={() => goTab(0)}
          text='메인 페이지로 돌아가기'
        ></ButtonComponent>
      </div>
    </div>
  )
}

export default DoneTab
