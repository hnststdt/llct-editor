import { RootState } from '@/store'
import { setOffset, updateContent } from '@/store/items/editor'
import '@/styles/editor/metadata.scss'
import React, { useState } from 'react'

import { ChromePicker, ColorChangeHandler } from 'react-color'
import { useDispatch, useSelector } from 'react-redux'

interface FlagsCheckboxComponentProps {
  id: keyof LLCTCallMetadataFlags
  text: string
  contents: LLCTCall | undefined
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

const FlagsCheckboxComponent = ({
  id,
  text,
  contents,
  onChange
}: FlagsCheckboxComponentProps) => {
  return (
    <div className='item'>
      <label htmlFor={id + '-checkbox'}>{text || id} : </label>

      <input
        type='checkbox'
        id={id + '-checkbox'}
        data-type={id}
        defaultChecked={
          contents && contents.metadata.flags && contents.metadata.flags[id]
        }
        onChange={onChange}
      ></input>
    </div>
  )
}

const MetadataEditorComponent = () => {
  const dispatch = useDispatch()
  const contents = useSelector((state: RootState) => state.editor.contents)
  const offset = useSelector((state: RootState) => state.editor.offset)

  const [localColor, setLocalColor] = useState<string>()

  const update = () => {}

  const colorChange: ColorChangeHandler = color => {
    setLocalColor(color.hex)
  }

  const colorChangeComplete: ColorChangeHandler = color => {
    setLocalColor(undefined)

    const content = Object.assign({}, contents)
    content.metadata

    if (!content.metadata) {
      content.metadata = {}
    }

    if (!content.metadata.blade) {
      content.metadata.blade = {}
    }

    content.metadata.blade.color = color.hex

    dispatch(updateContent(content))
  }

  const flagsCheck = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let type = (ev.target as HTMLInputElement).dataset
      .type! as keyof LLCTCallMetadataFlags
    let value = (ev.target as HTMLInputElement).checked

    const content = Object.assign({}, contents)
    content.metadata

    if (!content.metadata) {
      content.metadata = {}
    }

    if (!content.metadata.flags) {
      content.metadata.flags = {}
    }

    content.metadata.flags[type] = value

    dispatch(updateContent(content))
  }

  const bladeColorTextChange = (value: string) => {
    const content = Object.assign({}, contents)
    content.metadata

    if (!content.metadata) {
      content.metadata = {}
    }

    if (!content.metadata.blade) {
      content.metadata.blade = {}
    }

    content.metadata.blade.text = value

    dispatch(updateContent(content))
  }

  const color =
    localColor ||
    (contents && contents.metadata.blade && contents.metadata.blade.color)

  return (
    <div className='metadata-editor'>
      <div className='section'>
        <h3>색상</h3>

        <div className='item'>
          블레이드 추천 색상 :{' '}
          <span style={{ color: color }}>{color || '없음'}</span>
          <ChromePicker
            color={
              localColor ||
              (contents &&
                contents.metadata.blade &&
                contents.metadata.blade.color)
            }
            onChange={colorChange}
            onChangeComplete={colorChangeComplete}
          ></ChromePicker>
        </div>

        <div className='item'>
          블레이드 추천 색상 이름 :{' '}
          <input
            type='text'
            placeholder='ex) 치카 색 (귤색)'
            defaultValue={
              contents &&
              contents.metadata.blade &&
              contents.metadata.blade.text
            }
            onChange={ev =>
              bladeColorTextChange((ev.target as HTMLInputElement).value)
            }
          ></input>
        </div>
      </div>
      <div className='section'>
        <h3>플래그</h3>
        <FlagsCheckboxComponent
          id='notPerformed'
          text='현재까지 공연된 적 없음'
          contents={contents}
          onChange={ev => flagsCheck(ev)}
        ></FlagsCheckboxComponent>
        <FlagsCheckboxComponent
          id='notAccurate'
          text='정확하지 않은 콜표'
          contents={contents}
          onChange={ev => flagsCheck(ev)}
        ></FlagsCheckboxComponent>
        <FlagsCheckboxComponent
          id='singAlong'
          text='가사를 따라 부르는 곡'
          contents={contents}
          onChange={ev => flagsCheck(ev)}
        ></FlagsCheckboxComponent>
      </div>
      <div className='section'>
        <h3>에디터 설정</h3>
        <div className='item'>
          마지막 수정 시각 :{' '}
          <span>
            {new Date(
              (contents &&
                contents.metadata &&
                contents.metadata.editor &&
                contents.metadata.editor.lastEdit) ||
                0
            ).toString()}
          </span>
        </div>
        <div className='item'>
          단축키 (S, W, [, ]) 오프셋 (tick)
          <input
            type='number'
            name='offset'
            id='offset'
            defaultValue={offset}
            onChange={ev =>
              dispatch(setOffset(Number((ev.target as HTMLInputElement).value)))
            }
          />
        </div>
      </div>
    </div>
  )
}

export default MetadataEditorComponent
