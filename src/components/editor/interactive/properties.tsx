import ButtonComponent from '@/components/elements/button'
import SelectComponent from '@/components/elements/select'
import EditorSelection from '@/core/selection'
import { useEffect, useRef, useState } from 'react'

// ㅋㅋㅋㅋㅋㅋㅋㅋㅋ
interface InteractiveEditorPropertiesComponentProps {
  lines: LLCTCallLine[]
  selection: EditorSelection
  updateWords: (words: WordsUpdates[]) => void
  updateLines: (lines: LinesUpdates[]) => void
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

interface MoveSyncComponentProps {
  lines: LLCTCallLine[]
  amount: number
  updateWords: (words: WordsUpdates[]) => void
}

const MoveSyncComponent = ({
  lines,
  amount,
  updateWords
}: MoveSyncComponentProps) => {
  const syncAdjust = () => {
    const result = []

    for (let i = 0; i < lines.length; i++) {
      const words = lines[i]

      if (words.words.length === 1 && words.words[0].text === '') {
        continue
      }

      for (let w = 0; w < words.words.length; w++) {
        const word = words.words[w]

        if (!word.start || !word.end || word.start < 0) {
          continue
        }

        const start: WordsUpdates['datas'][0] = {
          type: 'start',
          data: Number(Math.max(0, word.start + amount))
        }

        const end: WordsUpdates['datas'][0] = {
          type: 'end',
          data: Number(Math.max(0, word.end + amount))
        }

        const item: WordsUpdates = {
          line: i,
          word: w,
          datas: [start, end]
        }

        result.push(item)
      }
    }

    updateWords(result)
  }

  return (
    <ButtonComponent
      text={
        '가사 싱크를 ' +
        Math.abs(amount) +
        'tc ' +
        (amount < 0 ? ' 빠르게' : ' 느리게')
      }
      onClick={syncAdjust}
    ></ButtonComponent>
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

const useDebouncer = (
  placeHolder: string | number,
  defaultValue: string | number | undefined,
  update: (value: string | number) => void,
  selection: unknown
): [
  string | number,
  string | number | undefined,
  React.Dispatch<React.SetStateAction<string | number | undefined>>
] => {
  const [value, setValue] = useState<string | number | undefined>(defaultValue)

  useEffect(() => {
    setValue(undefined)
  }, [selection])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (defaultValue === value || !value) {
        return
      }

      update(value)
    }, 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [defaultValue, value])

  return [placeHolder, value, setValue]
}

const InteractiveEditorPropertiesComponent = ({
  lines,
  selection,
  updateWords,
  updateLines
}: InteractiveEditorPropertiesComponentProps) => {
  const [_, update] = useState<number>(0)

  useEffect(() => {
    selection.events.on('update', () => {
      update(Math.random())
    })
  }, [])

  const updateValue = (type: keyof LLCTCallWord, value: string | number) => {
    const words = []

    for (let i = 0; i < selection.selected.length; i++) {
      const selected = selection.selected[i]

      const item = {
        line: selected.line,
        word: selected.word,
        datas: [
          {
            type,
            data: type === 'color' || type === 'text' ? value : Number(value)
          }
        ]
      }

      words.push(item)
    }

    updateWords(words)
  }

  const updateLineValue = (type: 'text', value: string | number) => {
    const lines: LinesUpdates[] = []

    for (let i = 0; i < selection.selected.length; i++) {
      const selected = selection.selected[i]

      if (lines.filter(v => v.line === selected.line).length) {
        continue
      }

      const item = {
        line: selected.line,
        datas: [
          {
            type,
            data: value
          }
        ]
      }

      lines.push(item)
    }

    updateLines(lines)
  }

  const getPlaceValue = (
    type: keyof LLCTCallWord,
    lineOnly?: boolean
  ): [string | number, string | number | undefined] => {
    const res = []

    for (let i = 0; i < selection.selected.length; i++) {
      const selected = selection.selected[i]

      if (
        !lines[selected.line] ||
        (!lineOnly && !lines[selected.line].words[selected.word])
      ) {
        continue
      }

      if (lineOnly) {
        const line = lines[selected.line]
        res.push(line[type as keyof LLCTCallLine])
      } else {
        const word = lines[selected.line].words[selected.word]
        res.push(word[type as keyof LLCTCallWord])
      }
    }

    const data = (res.filter((v, i, a) => a.indexOf(v) === i) as unknown) as (
      | string
      | number
      | undefined
    )[]

    if (data.length === 1) {
      return [data[0] || 'X', data[0]]
    } else {
      return [!data.length ? 'X' : data.join(', '), undefined]
    }
  }

  const textV = useDebouncer(
    ...getPlaceValue('text'),
    value => {
      updateValue('text', value)
    },
    _
  )

  const startV = useDebouncer(
    ...getPlaceValue('start'),
    value => {
      updateValue('start', value)
    },
    _
  )

  const endV = useDebouncer(
    ...getPlaceValue('end'),
    value => {
      updateValue('end', value)
    },
    _
  )

  const typeV = useDebouncer(
    ...getPlaceValue('type'),
    value => {
      updateValue('type', value)
    },
    _
  )

  const repeatV = useDebouncer(
    ...getPlaceValue('repeats'),
    value => {
      updateValue('repeats', value)
    },
    _
  )

  const lineTextV = useDebouncer(
    ...getPlaceValue('text', true),
    value => {
      updateLineValue('text', value)
    },
    _
  )

  const [syncAmount, setSyncAmount] = useState(100)

  return (
    <div className='interactive-properties'>
      <p>
        선택된 {selection && selection.selected.length}개의 항목에 대한 옵션
      </p>

      {/* <ButtonComponent text='' onChange={}></ButtonComponent> */}
      <h3>라인</h3>
      <div className='item'>
        <span>가사 : </span>
        <input
          type='text'
          placeholder={lineTextV[0] as string | undefined}
          disabled={!selection || !selection.selected.length}
          value={(lineTextV[1] || '') as string | undefined}
          // onKeyDown={ev =>
          //   ev.code === 'Enter' &&
          //   updateValue('text', ev.nativeEvent.target as HTMLInputElement)
          // }
          onChange={ev => lineTextV[2](ev.target.value)}
        ></input>
      </div>

      <br></br>

      <h3>단어</h3>

      <div className='item'>
        <span>텍스트 : </span>
        <input
          type='text'
          disabled={!selection || !selection.selected.length}
          placeholder={textV[0] as string | undefined}
          value={(textV[1] || '') as string | undefined}
          // onKeyDown={ev =>
          //   ev.code === 'Enter' &&
          //   updateValue('text', ev.nativeEvent.target as HTMLInputElement)
          // }
          onChange={ev => textV[2](ev.target.value)}
        ></input>
      </div>

      <div className='item'>
        <span>시작 시간 : </span>
        <input
          type='number'
          disabled={!selection || !selection.selected.length}
          placeholder={startV[0] as string | undefined}
          value={(startV[1] || '') as string | undefined}
          onChange={ev => startV[2](ev.target.value)}
        ></input>
      </div>

      <div className='item'>
        <span>종료 시간 : </span>
        <input
          type='number'
          disabled={!selection || !selection.selected.length}
          placeholder={endV[0] as string | undefined}
          value={(endV[1] || '') as string | undefined}
          onChange={ev => endV[2](ev.target.value)}
        ></input>
      </div>

      <div className='item'>
        <span>단어 종류 : </span>

        <div className='radiobox'>
          <div className='radio lyrics'>
            <input
              type='radio'
              disabled={!selection || !selection.selected.length}
              id='call_type_zero'
              name='type'
              checked={typeV[1] === 0}
              onChange={ev => typeV[2](ev.target.value)}
              value='0'
            ></input>
            <label htmlFor='call_type_zero'>가사</label>
          </div>
          <div className='radio call'>
            <input
              type='radio'
              disabled={!selection || !selection.selected.length}
              id='call_type_one'
              name='type'
              checked={typeV[1] === 1}
              onChange={ev => typeV[2](ev.target.value)}
              value='1'
            ></input>
            <label htmlFor='call_type_one'>콜</label>
          </div>
          <div className='radio comment'>
            <input
              type='radio'
              disabled={!selection || !selection.selected.length}
              id='call_type_two'
              name='type'
              checked={typeV[1] === 2}
              onChange={ev => typeV[2](ev.target.value)}
              value='2'
            ></input>
            <label htmlFor='call_type_two'>주석</label>
          </div>
          <div className='radio calllyrics'>
            <input
              type='radio'
              disabled={!selection || !selection.selected.length}
              id='call_type_three'
              name='type'
              checked={typeV[1] === 3}
              onChange={ev => typeV[2](ev.target.value)}
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
          disabled={!selection || !selection.selected.length}
          placeholder={repeatV[0] as string | undefined}
          value={(repeatV[1] || '') as string | undefined}
          onChange={ev => repeatV[2](ev.target.value)}
        ></input>

        <BeatCounterComponent></BeatCounterComponent>
      </div>

      <br></br>
      <div className='item'>
        <SelectComponent
          prefix='조정 단위:'
          items={['1', '10', '100']}
          value='100'
          onChange={(item)=>{setSyncAmount(Number(item))}}
        />
        <MoveSyncComponent
          lines={lines}
          amount={-syncAmount}
          updateWords={updateWords}
        ></MoveSyncComponent>
        <MoveSyncComponent
          lines={lines}
          amount={syncAmount}
          updateWords={updateWords}
        ></MoveSyncComponent>
      </div>
    </div>
  )
}

export default InteractiveEditorPropertiesComponent
