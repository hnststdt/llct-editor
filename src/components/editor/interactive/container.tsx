import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import InteractiveEditorComponent from './component'

import { updateContent, updateWordsContents } from '@/store/items/editor'
import InteractiveEditorKeyboardComponent from './keyboard'
import InteractiveEditorPropertiesComponent from './properties'

interface EditorContainerProps {}

const InteractiveEditorContainer = ({}: EditorContainerProps) => {
  const dispatch = useDispatch()
  const editorContent = useSelector((state: RootState) => state.editor.contents)
  const editorSelectionMode = useSelector(
    (state: RootState) => state.editor.selectionMode
  )
  const selection = useSelector((state: RootState) => state.editor.selection)

  const addWord = (lineIndex: number, wordIndex?: number) => {
    if (!editorContent || !editorContent.timeline) {
      return
    }

    let contents = Object.assign({}, editorContent)

    if (typeof wordIndex === 'undefined') {
      contents.timeline.splice(lineIndex, 0, {
        start: 0,
        end: 0,
        words: [
          {
            text: '',
            start: 0,
            end: 0
          }
        ]
      })
    } else {
      contents.timeline[lineIndex].words.splice(wordIndex, 0, {
        text: '',
        start: 0,
        end: 0
      })
    }

    dispatch(updateContent(contents))
  }

  const removeWord = (lineIndex: number, wordIndex: number) => {
    if (!editorContent || !editorContent.timeline) {
      return
    }

    let contents = Object.assign({}, editorContent)

    contents.timeline[lineIndex].words.splice(wordIndex, 1)

    dispatch(updateContent(contents))
  }

  const clickWord = (lineIndex: number, wordIndex: number) => {
    let index = selection.getIndex(lineIndex, wordIndex)

    if (index === -1) {
      selection.add({
        line: lineIndex,
        word: wordIndex
      })
    } else {
      selection.remove(index)
    }
  }

  const updateWords = (words: WordsUpdates[]) => {
    dispatch(updateWordsContents(words))
  }

  return (
    <>
      <InteractiveEditorKeyboardComponent
        updateWords={updateWords}
      ></InteractiveEditorKeyboardComponent>
      <InteractiveEditorComponent
        lines={(editorContent && editorContent.timeline) || []}
        mouseMode={editorSelectionMode}
        addWord={addWord}
        clickWord={clickWord}
      ></InteractiveEditorComponent>
      <InteractiveEditorPropertiesComponent
        lines={(editorContent && editorContent.timeline) || []}
        selection={selection}
        updateWords={updateWords}
      ></InteractiveEditorPropertiesComponent>
    </>
  )
}

export default InteractiveEditorContainer
