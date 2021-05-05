import ButtonComponent from '@/components/elements/button'
import { RootState } from '@/store'
import { setOffset, updateContent } from '@/store/items/editor'
import '@/styles/editor/metadata.scss'
import { read } from 'fs/promises'
import React, { ChangeEvent, useState } from 'react'

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

  const [onDrag, setOnDrag] = useState<boolean>(false)

  const [localColor, setLocalColor] = useState<string>()

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

  const fileLoadHandler = (file: File) => {
    if (file.type !== 'application/json') {
      alert(
        '선택한 파일은 콜표 파일이 아닙니다. JSON 타입의 파일을 선택해주세요.'
      )

      return
    }

    if (!file.size) {
      alert('파일이 비어 있어요.')

      return
    }

    if (file.size > 1000000) {
      alert('파일이 1MB가 넘는데, 제대로 된 파일이 맞나요?')

      return
    }

    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      let data

      if (!reader.result) {
        return
      }

      let preData = reader.result

      if (preData instanceof ArrayBuffer) {
        preData = String.fromCharCode.apply(
          null,
          (new Uint16Array(preData) as unknown) as number[]
        )
      }

      try {
        data = JSON.parse(preData)
      } catch (e) {
        alert('올바른 데이터 파일이 아닙니다. ' + e.message)

        return
      }

      if (!data.timeline || !data.metadata) {
        alert('파일이 올바르지 않습니다. 콜표 파일이 맞나요?')

        return
      }

      dispatch(updateContent(data, true))

      alert('파일을 불러왔습니다.')
    }
  }

  const loadFileButton = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'

    document.body.appendChild(fileInput)

    fileInput.click()
    fileInput.onchange = (ev: Event) => {
      if (!ev.target) {
        return
      }

      let files = (ev.target as HTMLInputElement).files

      if (!files) {
        return
      }

      fileLoadHandler(files[0])
    }

    document.body.removeChild(fileInput)
  }

  const color =
    localColor ||
    (contents && contents.metadata.blade && contents.metadata.blade.color)

  const dragstart = (ev: React.DragEvent<HTMLDivElement>) => {
    setOnDrag(true)

    ev.stopPropagation()
    ev.preventDefault()
  }

  const dragover = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.stopPropagation()
    ev.preventDefault()
  }

  const dragend = (ev: React.DragEvent<HTMLDivElement>) => {
    setOnDrag(false)

    ev.stopPropagation()
    ev.preventDefault()
  }

  const drop: React.DragEventHandler = ev => {
    setOnDrag(false)

    const dt = ev.dataTransfer
    const files = dt.files

    if (files) {
      fileLoadHandler(files[0])
    }

    ev.stopPropagation()
    ev.preventDefault()
  }

  return (
    <div
      className='metadata-editor'
      onDragEnter={dragstart}
      onDragOver={dragover}
      onDragEnd={dragend}
      onDrop={drop}
    >
      <div
        className={['full-drop', onDrag ? 'show' : false]
          .filter(v => v !== false)
          .join(' ')}
      >
        <h3>이 곳에 파일을 끌어다 놓아 파일을 불러올 수 있습니다.</h3>
      </div>
      <div className='section'>
        <h3>작업 내역</h3>
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

        <ButtonComponent
          text='파일 불러오기'
          onClick={loadFileButton}
        ></ButtonComponent>
      </div>
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
