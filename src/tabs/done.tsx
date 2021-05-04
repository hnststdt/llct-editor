import ButtonComponent from '@/components/elements/button'
import { download } from '@/store/items/editor'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const DoneTab = () => {
  const dispatch = useDispatch()

  const goTab = (id: number) => {
    dispatch({
      type: '@llct-editor/tabs/update',
      data: id
    })
  }

  useEffect(() => {
    dispatch(download())
  }, [])

  return (
    <div className='tab done-tab'>
      <h1>완료</h1>
      <p>
        {' '}
        작업을 완료 했습니다. 작업된 파일은{' '}
        <a href='https://github.com/So-chiru/llct-editor/issues/new?assignees=So-chiru&labels=call&template=-----.md&title=%EC%BD%9C%ED%91%9C+%EC%9E%91%EC%97%85+%3A+%EB%85%B8%EB%9E%98+%EC%9D%B4%EB%A6%84+%28ID%29'>
          Github Issue
        </a>
        나 sochiru@sochiru.pw 메일로 보내주시면 됩니다.
      </p>

      <div className='done'>
        <ButtonComponent
          theme='primary'
          onClick={() => goTab(1)}
          text='편집 페이지로 돌아가기'
        ></ButtonComponent>
        <ButtonComponent
          onClick={() => goTab(0)}
          text='메인 페이지로 돌아가기'
        ></ButtonComponent>
      </div>
    </div>
  )
}

export default DoneTab
