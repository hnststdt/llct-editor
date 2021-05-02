import { EditorMode } from '@/@types/editor-mode'
import EditorDataContainer from '../data/container'
import EditorComponent from './component'

interface EditorContainerProps {
  mode: EditorMode
}

const EditorContainer = ({ mode }: EditorContainerProps) => {
  return (
    <>
      <EditorDataContainer></EditorDataContainer>
      <EditorComponent mode={mode}></EditorComponent>
    </>
  )
}

export default EditorContainer
