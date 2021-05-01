import MonacoEditor from 'react-monaco-editor'

interface TextEditorComponentProps {
  value: string
}

const TextEditorComponent = ({ value }: TextEditorComponentProps) => {
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
        value={value}
      ></MonacoEditor>
    </>
  )
}

export default TextEditorComponent
