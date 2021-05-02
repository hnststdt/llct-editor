import MonacoEditor, { ChangeHandler } from 'react-monaco-editor'

interface TextEditorComponentProps {
  value: string
  change: ChangeHandler
}

const TextEditorComponent = ({ value, change }: TextEditorComponentProps) => {
  return (
    <>
      <MonacoEditor
        options={{
          fontSize: 16,
          renderWhitespace: 'all',
          smoothScrolling: true,
          cursorBlinking: 'smooth'
        }}
        theme='vs-dark'
        language='plain'
        width='100%'
        height='800px'
        onChange={change}
        value={value}
      ></MonacoEditor>
    </>
  )
}

export default TextEditorComponent
