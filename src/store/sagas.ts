import createSagaMiddleware from 'redux-saga'
import { all, call, put, takeEvery } from 'typed-redux-saga'

import * as api from '@/core/api'

const sagaMiddleware = createSagaMiddleware()

function * fetchAPIData () {
  try {
    const data = yield * call(api.requestSongsLists)

    yield put({ type: '@llct-editor/api_songs/success', data: data })
  } catch (e) {
    yield put({ type: '@llct-editor/api_songs/failed', error: e.message })
  }
}

function * fetchAPICallData (action: { type: string; data: string }) {
  try {
    const data = yield * call(api.requestCallData, action.data)

    yield put({ type: '@llct-editor/api_call/success', data: data })
  } catch (e) {
    yield put({ type: '@llct-editor/api_call/failed', error: e.message })
  }
}

// 첫 번째 인자를 가진 Action이 Dispatch 되어 요청이 들어오면 그 Action을 처리할 수 있도록 호출할 함수를 2번째 인자로 지정합니다.
// 두 번째 인자가 가지는 함수는 generator이며 이 주석 위에다 정의하면 편합니다. 인자는 action 객체를 가집니다.
export function * defaultSaga () {
  yield takeEvery('@llct-editor/api_songs/request', fetchAPIData)
}

export function * callSaga () {
  yield takeEvery('@llct-editor/api_call/request', fetchAPICallData)
}

// 하위 saga들을 모두 실행합니다.
export function * rootSaga () {
  yield all([defaultSaga(), callSaga()])
}

export default sagaMiddleware
