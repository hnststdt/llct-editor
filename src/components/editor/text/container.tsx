import TextEditorComponent from './component'

interface TextEditorContainerProps {
  value: string
}

const TextEditorContainer = ({ value }: TextEditorContainerProps) => {
  return <TextEditorComponent value={value}></TextEditorComponent>
}

export default TextEditorContainer
