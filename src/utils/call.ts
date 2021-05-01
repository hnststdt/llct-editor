export const toText = (call: LLCTCall) => {
  return call.timeline
    .map(line => line.words.map(word => word.text).join(''))
    .join('\n')
}
