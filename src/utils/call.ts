export const toText = (call: LLCTCall) => {
  return call.timeline
    .map(line => line.words.map(word => word.text).join(''))
    .join('\n')
}

const mergeNextTexts = [
  '-',
  ')',
  '>',
  '}',
  ' ',
  '!',
  '?',
  '　', // 전각 공백
  '！',
  '？',
  ':',
  ']',
  '.',
  ',',
  "'",
  '"',
  '」',
  '”',
  '’',
  'ー',
  '。',
  '、',
  '・'
]
const mergePrevTexts = ['(', '<', '{', '[', '"', "'", '「']

const mergeSpecializedWords = (words: RegExpMatchArray | null) => {
  if (!words) {
    return words
  }

  for (let i = 0; i < words.length; i++) {
    let word = words[i]

    let prevWord = words[i - 1]
    let nextWord = words[i + 1]

    if (prevWord) {
      // 이전 단어에 mergePrevTexts에 해당하는 문자가 있을 경우
      if (mergePrevTexts.filter(v => v == prevWord).length) {
        words[i - 1] += word
        words.splice(i, 1)
        i--

        continue
      }
    }

    if (nextWord) {
      // 다음 단어에 mergeNextTexts에 해당하는 문자가 있을 경우
      if (mergeNextTexts.filter(v => v === nextWord).length) {
        words[i] += nextWord
        words.splice(i + 1, 1)
        i--

        continue
      }
    }
  }

  return words
}

const emptyWord = {
  start: 0,
  end: 0,
  text: '',
  type: 0
}

export const renderText = (text: string): LLCTCall => {
  const timeline: LLCTCallLine[] = []

  let lines = text.split('\n')

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    let line = lines[lineIndex]
    let words = mergeSpecializedWords(line.match(/./g))

    let finalizedWords: LLCTCallWord[] = []

    if (words) {
      finalizedWords = words.map(v => ({
        start: 0,
        end: 0,
        text: v,
        type: 0
      }))
    }

    if (!finalizedWords.length) {
      finalizedWords.push(emptyWord)
    }

    timeline[lineIndex] = {
      start: 0,
      end: 0,
      words: finalizedWords
    }
  }

  return {
    metadata: {},
    timeline
  }
}

const LINE_OFFSET = 100

export const correctLineStartEndTime = (call: LLCTCall) => {
  if (!call || !call.timeline || !call.timeline.length) {
    return call
  }

  for (let lineIndex = 0; lineIndex < call.timeline.length; lineIndex++) {
    let line = call.timeline[lineIndex]

    if (!line.words || !line.words.length) {
      continue
    }

    let start = line.words[0].start - LINE_OFFSET
    let end = line.words[line.words.length - 1].end + LINE_OFFSET

    if (start === -100) {
      start = 0
    }

    if (end === 100) {
      end = 100
    }

    if (line.start !== start) {
      line.start = start
    }

    if (line.end !== end) {
      line.end = end
    }
  }

  return call
}

export default {
  toText,
  renderText,
  correctLineStartEndTime
}
