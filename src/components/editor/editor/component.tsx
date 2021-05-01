import InteractiveEditorContainer from '../interactive/container'
import TextEditorContainer from '../text/container'

import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { RootState } from '@/store'
import * as calls from '@/utils/call'

const EditorComponent = () => {
  const call = useSelector((state: RootState) => state.call)

  const [value, setValue] = useState<string>('')
  const [showTextEditor, setShowTextEditor] = useState<boolean>(true)

  useEffect(() => {
    if (!call || !call.items) {
      return
    }

    setValue(calls.toText(call.items))
  }, [call])

  return (
    <div className='editor'>
      <InteractiveEditorContainer></InteractiveEditorContainer>

      {showTextEditor && (
        <>
          <p>
            경고:{' '}
            <span className='warning'>
              아래에 있는 편집기의 내용이 수정될 경우 작업된 모든 싱크 / 가사
              표시가 사라집니다. 그러니 맨 처음에 가사를 한번에 작성하실 때만
              사용하세요. 다 작성하셨다면 다시 한번 더 확인 해봅시다.
            </span>
            <br></br>
            (글자 단위로 추가, 삭제, 수정 정도는 마우스 오른쪽 버튼을 눌러
            이용하세요.)
          </p>
          <TextEditorContainer value={value}></TextEditorContainer>
        </>
      )}
    </div>
  )
}

export default EditorComponent
