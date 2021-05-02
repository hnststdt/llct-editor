import { useDispatch } from 'react-redux'
import MetadataEditorComponent from './component'

const MetadataEditorContainer = () => {
  const dispatch = useDispatch()

  return <MetadataEditorComponent></MetadataEditorComponent>
}

export default MetadataEditorContainer
