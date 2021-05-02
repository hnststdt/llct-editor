import { EditorSelectionMode } from '@/@types/editor-mode'
import { RootState } from '@/store'
import '@/styles/editor/interactive.scss'
import React, { useState, useEffect, useRef } from 'react'
import {
  MdAdd,
  MdLineWeight,
  MdSpaceBar,
  MdSubdirectoryArrowLeft
} from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'

import { setSync } from '@/store/items/editor'
import CallTimeSync from '@/core/timesync'

const isEndSpace = (str: string) => {
  return str[str.length - 1] === ' '
}

interface EditorComponentProps {
  lines: LLCTCallLine[]
  mouseMode: EditorSelectionMode
  addWord: (lineIndex: number, wordIndex?: number) => void
  clickWord: (lineIndex: number, wordIndex: number) => void
}

interface WordComponentProps {
  word: LLCTCallWord
  index: number
  selected: boolean
  // words: LLCTCallWord[]
  clickHandler: () => void
}

interface AddWordComponentProps {
  lineIndex: number
  at: number
  upLine?: boolean
  line?: boolean
  show?: boolean
  addWord: (lineIndex: number, wordIndex?: number) => void
}

interface WordsCollectionComponentProps {
  line: LLCTCallLine
  lineIndex: number
  addWord: (lineIndex: number, wordIndex?: number) => void
  clickWord: (lineIndex: number, wordIndex: number) => void
}

const parentTraversal = (
  elem: HTMLElement,
  maxDepth?: number,
  arr?: HTMLElement[],
  currentDepth?: number
): HTMLElement[] => {
  if (!arr) {
    arr = [elem]
  }

  if (
    elem.parentElement &&
    (typeof currentDepth === 'undefined' ||
      typeof maxDepth === 'undefined' ||
      currentDepth < maxDepth)
  ) {
    arr.unshift(elem.parentElement)

    if (typeof currentDepth !== 'number') {
      currentDepth = 1
    }

    currentDepth++

    return parentTraversal(elem.parentElement, maxDepth, arr, currentDepth)
  }

  return arr
}

const WordComponent = ({
  word,
  index,
  selected,
  clickHandler
}: WordComponentProps) => {
  return (
    <div
      className={['word', selected ? 'selected' : false]
        .filter(v => typeof v !== 'undefined')
        .join(' ')}
      data-space={isEndSpace(word.text)}
      data-word='true'
      data-start={word.start}
      data-end={word.end}
      data-type={word.type}
      data-index={index}
      onClick={clickHandler}
    >
      {(word.text.length &&
        word.text.match(/./g)!.map((v, i) => {
          if (v === ' ') {
            return (
              <span className='space' key={i}>
                <MdSpaceBar></MdSpaceBar>
              </span>
            )
          } else if (v === '<' || v === '>' || v === '(' || v === ')') {
            return (
              <span className='bracket' key={i}>
                {v}
              </span>
            )
          } else {
            return <span key={i}>{v}</span>
          }
        })) ||
        ''}
    </div>
  )
}

const AddWordComponent = ({
  lineIndex,
  line,
  upLine,
  at,
  show,
  addWord
}: AddWordComponentProps) => {
  return (
    <div
      className={[
        'word',
        'add',
        show ? 'show' : false,
        line ? 'line' : false,
        upLine ? 'upLine' : false
      ]
        .filter(v => typeof v === 'string')
        .join(' ')}
      data-index={at}
      onClick={() =>
        addWord(
          upLine || (!upLine && !line) ? lineIndex : lineIndex + 1,
          line || upLine ? undefined : at
        )
      }
    >
      {line || upLine ? (
        <MdSubdirectoryArrowLeft
          style={{ transform: upLine ? 'rotate(90deg)' : '' }}
        ></MdSubdirectoryArrowLeft>
      ) : (
        <MdAdd></MdAdd>
      )}
    </div>
  )
}

const WordsCollectionComponent = ({
  line,
  lineIndex,
  addWord,
  clickWord
}: WordsCollectionComponentProps) => {
  const [wordHoverAt, setWordHoverAt] = useState<number>(-1)
  const selection = useSelector((state: RootState) => state.editor.selection)

  const [_, update] = useState<number>(0)

  useEffect(() => {
    let id = selection.events.on('update', (l: number, w: number) => {
      if (
        l === lineIndex ||
        (typeof l === 'undefined' && typeof w === 'undefined')
      ) {
        update(Math.random())
      }
    })

    return () => {
      selection.events.off('update', id)
    }
  }, [])

  const wordMouseOver = (ev: React.MouseEvent<HTMLDivElement>) => {
    let elem = parentTraversal(ev.target as HTMLElement, 3).filter(elem =>
      elem.classList.contains('word')
    )[0]

    if (elem && wordHoverAt !== Number(elem.dataset.index)) {
      setWordHoverAt(Number(elem.dataset.index))
    }
  }

  const wordMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
    setWordHoverAt(-1)
  }

  return (
    <div
      className='words'
      onMouseOver={wordMouseOver}
      onMouseLeave={wordMouseLeave}
    >
      <AddWordComponent
        lineIndex={lineIndex}
        at={-1}
        upLine={true}
        addWord={addWord}
        show={wordHoverAt === 0}
      ></AddWordComponent>
      <AddWordComponent
        lineIndex={lineIndex}
        at={0}
        addWord={addWord}
      ></AddWordComponent>
      {line.words.map((word, wordIndex) => {
        return (
          <>
            <WordComponent
              key={wordIndex}
              word={word}
              index={wordIndex}
              selected={selection.isSelected(lineIndex, wordIndex)}
              clickHandler={() => clickWord(lineIndex, wordIndex)}
            ></WordComponent>
            <AddWordComponent
              addWord={addWord}
              lineIndex={lineIndex}
              at={wordIndex + 1}
            ></AddWordComponent>
          </>
        )
      })}
      <AddWordComponent
        lineIndex={lineIndex}
        at={line.words.length - 1}
        line={true}
        addWord={addWord}
        show={wordHoverAt === line.words.length - 1}
      ></AddWordComponent>
    </div>
  )
}

const mouseModes = ['mode-select', 'mode-add']

const InteractiveEditorComponent = ({
  lines,
  mouseMode,
  addWord,
  clickWord
}: EditorComponentProps) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const sync = useSelector((state: RootState) => state.editor.player.sync)

  const clickLine = (lineIndex: number, wordsLength: number) => {
    for (let i = 0; i < wordsLength; i++) {
      clickWord(lineIndex, i)
    }
  }

  useEffect(() => {
    if (!ref.current || sync) {
      return
    }

    const syncer = new CallTimeSync(ref.current)

    dispatch(setSync(syncer))
  }, [ref.current, sync])

  return (
    <div
      ref={ref}
      className={['interactive-editor', mouseModes[mouseMode]]
        .filter(v => typeof v === 'string')
        .join(' ')}
    >
      {lines.map((line, lineIndex) => {
        return (
          <div
            className='line'
            key={lineIndex}
            data-start={line.start}
            data-end={line.end}
          >
            <div
              className='line-number'
              onClick={() => clickLine(lineIndex, line.words.length)}
            >
              <span>{lineIndex}</span>
            </div>
            <WordsCollectionComponent
              line={line}
              key={lineIndex}
              lineIndex={lineIndex}
              addWord={addWord}
              clickWord={clickWord}
            ></WordsCollectionComponent>
          </div>
        )
      })}
    </div>
  )
}

export default InteractiveEditorComponent
