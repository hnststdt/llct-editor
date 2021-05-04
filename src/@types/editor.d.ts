interface WordsUpdates {
  line: number
  word: number
  datas: { type: keyof LLCTCallWord; data: unknown }[]
}
