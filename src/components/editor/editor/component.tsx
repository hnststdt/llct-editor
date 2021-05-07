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
          <TextEditorContainer
            value={value}
            setValue={setValue}
            change={onChange}
          ></TextEditorContainer>
        )}
      </div>
    </>
  )
}

export default EditorComponent
