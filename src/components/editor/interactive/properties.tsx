import ButtonComponent from '@/components/elements/button'
import EditorSelection from '@/core/selection'
import { useEffect, useRef, useState } from 'react'

// ㅋㅋㅋㅋㅋㅋㅋㅋㅋ
interface InteractiveEditorPropertiesComponentProps {
  lines: LLCTCallLine[]
  selection: EditorSelection
  updateWords: (words: WordsUpdates[]) => void
}

const diff = (args: number[]) => {
  return (
    args
      .slice(1)
      .map((n, i) => n - args[i])
      .reduce((a, c) => a + c) /
    (args.length - 1)
  )
}

const BeatCounterComponent = () => {
  const [lists, updateLists] = useState<number[]>([])
  const timerRef = useRef<number>(0)

  const clickHandler = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    updateLists([...lists, Date.now()])

    timerRef.current = (setTimeout(() => {
      if (!lists) {
        return
      }

      updateLists([])
    }, 3000) as unknown) as number
  }

  return (
    <ButtonComponent
      text={
        lists.length < 5
          ? `눌러서 박자 세기 (${5 - lists.length})`
          : (diff(lists) / 10).toFixed(2)
      }
      onClick={clickHandler}
      style={{ width: '150px' }}
    ></ButtonComponent>
  )
}

const InteractiveEditorPropertiesComponent = ({
  lines,
  selection,
  updateWords
}: InteractiveEditorPropertiesComponentProps) => {
  const [_, update] = useState<number>(0)

  useEffect(() => {
    selection.events.on('update', () => {
      update(Math.random())
    })
  }, [])

  const updateValue = (type: keyof LLCTCallWord, target: HTMLInputElement) => {
    let words = []

    for (let i = 0; i < selection.selected.length; i++) {
      let selected = selection.selected[i]

      selected.line

      let item = {
        line: selected.line,
        word: selected.word,
        datas: [
          {
            type,
            data:
              type === 'color' || type === 'text'
                ? target.value
                : Number(target.value)
          }
        ]
      }

      words.push(item)
    }

    updateWords(words)
  }

  const getPlaceValue = (type: keyof LLCTCallWord) => {
    let res = []

    for (let i = 0; i < selection.selected.length; i++) {
      let selected = selection.selected[i]

      if (!lines[selected.line] || !lines[selected.line].words[selected.word]) {
        continue
      }

      let word = lines[selected.line].words[selected.word]
      res.push(word[type])
    }

    let data = res.filter((v, i, a) => a.indexOf(v) === i)

    if (data.length === 1) {
      return [data[0] || 'X', data[0]]
    } else {
      return [!data.length ? 'X' : data.join(', '), undefined]
    }
  }

  const textV = getPlaceValue('text')
  const startV = getPlaceValue('start')
  const endV = getPlaceValue('end')
  const typeV = getPlaceValue('type')
  const repeatV = getPlaceValue('repeats')

  return (
    <div className='interactive-properties'>
      <p>
        선택된 {selection && selection.selected.length}개의 항목에 대한 옵션
      </p>

      <div className='item'>
        <span>텍스트 : </span>
        <input
          type='text'
          placeholder={textV[0] as string | undefined}
          defaultValue={textV[1] as string | undefined}
          onKeyDown={ev =>
            ev.code === 'Enter' &&
            updateValue('text', ev.nativeEvent.target as HTMLInputElement)
          }
        ></input>
      </div>

      <div className='item'>
        <span>시작 시간 : </span>
        <input
          type='number'
          placeholder={startV[0] as string | undefined}
          defaultValue={startV[1] as string | undefined}
          onChange={ev => updateValue('start', ev.target)}
        ></input>
      </div>

      <div className='item'>
        <span>종료 시간 : </span>
        <input
          type='number'
          placeholder={endV[0] as string | undefined}
          defaultValue={endV[1] as string | undefined}
          onChange={ev => updateValue('end', ev.target)}
        ></input>
      </div>

      <div className='item'>
        <span>단어 종류 : </span>

        <div className='radiobox'>
          <div className='radio lyrics'>
            <input
              type='radio'
              id='call_type_zero'
              name='type'
              checked={typeV[1] === 0}
              onChange={ev => updateValue('type', ev.target)}
              value='0'
            ></input>
            <label htmlFor='call_type_zero'>가사</label>
          </div>
          <div className='radio call'>
            <input
              type='radio'
              id='call_type_one'
              name='type'
              checked={typeV[1] === 1}
              onChange={ev => updateValue('type', ev.target)}
              value='1'
            ></input>
            <label htmlFor='call_type_one'>콜</label>
          </div>
          <div className='radio comment'>
            <input
              type='radio'
              id='call_type_two'
              name='type'
              checked={typeV[1] === 2}
              onChange={ev => updateValue('type', ev.target)}
              value='2'
            ></input>
            <label htmlFor='call_type_two'>주석</label>
          </div>
          <div className='radio calllyrics'>
            <input
              type='radio'
              id='call_type_three'
              name='type'
              checked={typeV[1] === 3}
              onChange={ev => updateValue('type', ev.target)}
              value='3'
            ></input>
            <label htmlFor='call_type_three'>가사 + 콜</label>
          </div>
        </div>
      </div>

      <div className='item'>
        <span>반복 시간 : </span>
        <input
          type='number'
          placeholder={repeatV[0] as string | undefined}
          defaultValue={repeatV[1] as string | undefined}
        ></input>

        <BeatCounterComponent></BeatCounterComponent>
      </div>
    </div>
  )
}

export default InteractiveEditorPropertiesComponent
