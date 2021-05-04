import '@/styles/editor/metadata.scss'

import { SliderPicker } from 'react-color'

const MetadataEditorComponent = () => {
  return (
    <div className='metadata-editor'>
      <h3>색상</h3>

      <div>
        블레이드 추천 색상 : <SliderPicker></SliderPicker>
      </div>

      <div>
        블레이드 추천 색상 이름 :{' '}
        <input type='text' placeholder='ex) 치카 색 (귤색)'></input>
      </div>
    </div>
  )
}

export default MetadataEditorComponent
