import '@/styles/editor/metadata.scss'

import { SliderPicker } from 'react-color'

const MetadataEditorComponent = () => {
  return (
    <div className='metadata-editor'>
      <h3>색상</h3>

      <p>
        블레이드 추천 색상 : <SliderPicker></SliderPicker>
      </p>

      <p>
        블레이드 추천 색상 이름 : <input type='text' placeholder='ex) 치카 색 (귤색)'></input>
      </p>
    </div>
  )
}

export default MetadataEditorComponent
