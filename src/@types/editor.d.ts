interface WordsUpdates {
  line: number
  word: number
  datas: { type: keyof LLCTCallWord; data: unknown }[]
}

interface LinesUpdates {
  line: number
  datas: { type: keyof LLCTCallLine; data: unknown }[]
}
