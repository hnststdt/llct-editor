import TextEditorComponent from './component'

import { useDispatch } from 'react-redux'
import { ChangeHandler } from 'react-monaco-editor'

interface TextEditorContainerProps {
  value: string
  change: ChangeHandler
}

const TextEditorContainer = ({ value, change }: TextEditorContainerProps) => {
  return (
    <TextEditorComponent value={value} change={change}></TextEditorComponent>
  )
}

export default TextEditorContainer
