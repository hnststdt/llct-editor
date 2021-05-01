import { createStore, combineReducers, applyMiddleware } from 'redux'
import sagaMiddleware, { rootSaga } from './sagas'

import SongsReducer from './items/songs'
import TabsReducer from './items/tabs'
import EditorReducer from './items/editor'
import CallReducer from './items/call'

// 최상위 Reducer. 하위 Reducer들을 여기다 집어넣습니다.
//
// 1) 하위 Reducer들을 items 폴더에 Reducer이름을 포함한 새로운 폴더를 만들어
// 그 안에 reducer.ts 파일을 만드는 형식으로 만들거나,
//
// 2) 하위 Reducer들을 items 폴더에 Reducer 이름을 포함한 새로운 ts 파일을 만들어
// 그 파일 안에서 action과 reducer 함수를 정의하는 방식으로 사용할 수 있습니다.
const reducers = combineReducers({
  songs: SongsReducer,
  tabs: TabsReducer,
  editor: EditorReducer,
  call: CallReducer
})

// 하위 컴포넌트에서 최상위 Reducer에서 추론된 타입을 이용할 수 있도록 RootState type을 지정합니다.
export type RootState = ReturnType<typeof reducers>

// react-redux 저장소를 만듭니다. 이 변수는 <Provider>의 store={}로 전달되어 사용됩니다.
const store = createStore(reducers, applyMiddleware(sagaMiddleware))

// 최상위 saga를 실행합니다.
sagaMiddleware.run(rootSaga)

export default store
