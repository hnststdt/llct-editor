import { RootState } from '@/store'
import { setOffset } from '@/store/items/editor'
import '@/styles/editor/metadata.scss'

import { SliderPicker } from 'react-color'
import { useDispatch, useSelector } from 'react-redux'

const MetadataEditorComponent = () => {
  const dispatch = useDispatch()
  const contents = useSelector((state: RootState) => state.editor.contents)
  const offset = useSelector((state: RootState) => state.editor.offset)

  return (
    <div className='metadata-editor'>
      <h3>색상</h3>

      <div>
        블레이드 추천 색상 : <SliderPicker></SliderPicker>
      </div>

      <div>
        블레이드 추천 색상 이름 :{' '}
        <input
          type='text'
          placeholder='ex) 치카 색 (귤색)'
          defaultValue={contents?.metadata.blade?.color}
        ></input>
      </div>

      <h3>플래그</h3>
      <div></div>

      <h3>에디터 설정</h3>
      <div>
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
  )
}

export default MetadataEditorComponent
