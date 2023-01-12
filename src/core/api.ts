const makeItJSON = (result: Response) => result.json()
const makeItJSONResult = (result: Response) => ({
  result: 'success', data: result.json()
})
// HACK: hardcoded group name
const groups = ["muse", "aqours", "nijigasaki", "liella"]

export const requestSongsLists = async (): Promise<LLCTSongDataV2> => {
  return fetch(
    process.env.STATIC_MODE === 'true'
      ? 'calls/lists.json'
      : `${process.env.API_SERVER}/lists`
    ).then(v => {
      if (v.status === 404) {
        throw new Error('노래 목록이 없어요.')
      }

      if (v.status > 500) {
        throw new Error('서버 오류로 노래 목록을 불러올 수 없어요.')
      }

      return v
    })
    .then(process.env.STATIC_MODE === 'true' ? makeItJSONResult : makeItJSON)
    .then(p => {
      if (!p.result || p.result === 'error') {
        throw new Error(p.data || '서버에서 오류를 반환하였습니다.')
      }

      return p.data
    })
}

export const requestCallData = async (id: string): Promise<LLCTCall> => {
  return fetch(
      process.env.STATIC_MODE === 'true'
      ? `calls/${groups[Number(id.substring(0, 1))]}/${id.substring(1)}/call.json`
      : `{process.env.API_SERVER}/call/${id}`
    ).then(v => {
      if (v.status === 404) {
        throw new Error('콜이 없어요.')
      }

      if (v.status > 500) {
        throw new Error('서버 오류로 콜을 불러올 수 없어요.')
      }

      return v
    })
    .then(makeItJSON)
}
