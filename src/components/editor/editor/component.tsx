import InteractiveEditorContainer from '../interactive/container'
import TextEditorContainer from '../text/container'

import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { RootState } from '@/store'
import * as calls from '@/utils/call'
import { EditorType } from '@/@types/editor-mode'

const EditorComponent = () => {
  const call = useSelector((state: RootState) => state.call)
  const type = useSelector((state: RootState) => state.editor.type)
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    if (!call || !call.items) {
      return
    }

    setValue(calls.toText(call.items))
  }, [call])

  return (
    <div className='editor'>
      {type == EditorType.Interactive ? (
        <InteractiveEditorContainer></InteractiveEditorContainer>
      ) : (
        <>
          <p>
            경고:{' '}
            <span className='warning'>
              아래에 있는 편집기의 내용이 수정될 경우 작업 된 모든 싱크가 덮어 쓰입니다. 가사를 한 번에 모두 작성하실 때만
              사용하세요. 여기서 다 작성하셨다면 일반 에디터에서 수정하세요.
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
