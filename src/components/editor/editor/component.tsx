import InteractiveEditorContainer from '../interactive/container'
import TextEditorContainer from '../text/container'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { RootState } from '@/store'
import * as calls from '@/utils/call'
import { EditorMode, EditorType } from '@/@types/editor-mode'

import { updateContent } from '@/store/items/editor'
import MetadataEditorContainer from '../metadata/container'

interface EditorComponentProps {
  mode: EditorMode
}

const MetadataEditor = <MetadataEditorContainer></MetadataEditorContainer>
const InteractiveEditor = (
  <InteractiveEditorContainer></InteractiveEditorContainer>
)

const EditorComponent = ({ mode }: EditorComponentProps) => {
  const dispatch = useDispatch()

  const call = useSelector((state: RootState) => state.call)
  const contents = useSelector((state: RootState) => state.editor.contents)
  const type = useSelector((state: RootState) => state.editor.type)
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    if (!call || !call.items) {
      return
    }

    setValue(calls.toText(call.items))
  }, [call])

  useEffect(() => {
    if (!contents) {
      return
    }

    setValue(calls.toText(contents))
  }, [contents])

  const onChange = (text: string) => {
    setValue(text)
    dispatch(updateContent(calls.renderText(text)))
  }

  return (
    <>
      <div
        className={['editor', mode === EditorMode.Metadata ? 'show' : ''].join(
          ' '
        )}
      >
        {MetadataEditor}
      </div>
      <div
        className={['editor', mode !== EditorMode.Metadata ? 'show' : ''].join(
          ' '
        )}
      >
        {type == EditorType.Interactive ? (
          InteractiveEditor
        ) : (
          <div className='text-editor'>
            <p>
              경고:{' '}
              <span className='warning'>
                아래에 있는 편집기의 내용이 수정될 경우 현재 적용되어 있는 모든
                싱크가 초기 값으로 덮어 쓰입니다. 가사를 한 번에 모두 작성하실
                때만 사용하세요. 여기서 다 작성하셨다면 일반 에디터에서
                수정하세요.
              </span>
              <br></br>
              (글자 단위로 추가, 삭제, 수정 정도는 일반 편집기에서도 이용할 수
              있습니다.)
            </p>
            <TextEditorContainer
              value={value}
              change={onChange}
            ></TextEditorContainer>
          </div>
        )}
      </div>
    </>
  )
}

export default EditorComponent
