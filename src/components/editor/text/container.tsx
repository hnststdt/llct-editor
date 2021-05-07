import TextEditorComponent from './component'

import { useDispatch } from 'react-redux'
import { ChangeHandler } from 'react-monaco-editor'
import { updateContent } from '@/store/items/editor'
import * as calls from '@/utils/call'

import ButtonComponent from '@/components/elements/button'

interface TextEditorContainerProps {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  change: ChangeHandler
}

const TextEditorContainer = ({
  value,
  change,
  setValue
}: TextEditorContainerProps) => {
  const dispatch = useDispatch()

  const removeLineBreakOnce = () => {
    let text = value

    text = text.replace(/\n\n/g, '\n')

    setValue(text)
    dispatch(updateContent(calls.renderText(text)))
  }

  return (
    <div className='text-editor'>
      <p>
        경고:{' '}
        <span className='warning'>
          아래에 있는 편집기의 내용이 수정될 경우 현재 적용되어 있는 모든 싱크가
          초기 값으로 덮어 쓰입니다. 가사를 한 번에 모두 작성하실 때만
          사용하세요. 여기서 다 작성하셨다면 일반 에디터에서 수정하세요.
        </span>
        <br></br>
        (글자 단위로 추가, 삭제, 수정 정도는 일반 편집기에서도 이용할 수
        있습니다.)
      </p>
      <TextEditorComponent value={value} change={change}></TextEditorComponent>
      <div className='button-group'>
        <ButtonComponent
          text='2줄 바꿈 -> 1줄 바꿈'
          onClick={removeLineBreakOnce}
        ></ButtonComponent>
      </div>
    </div>
  )
}

export default TextEditorContainer
