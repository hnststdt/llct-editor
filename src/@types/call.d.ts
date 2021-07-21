interface LLCTCallLine {
  start: number
  end: number
  words: LLCTCallWord[]
  text?: string
}

declare enum LLCTCallWordType {
  Lyrics,
  Call,
  Comment,
  SingAlong
}
interface LLCTCallWord {
  text: string
  type?: LLCTCallWordType
  start: number
  end: number
  color?: string
  repeats?: number
  ruby?: string
}

interface LLCTCallMetadataFlags {
  notPerformed?: boolean
  notAccurate?: boolean
  singAlong?: boolean
}

interface LLCTCallMetadata {
  editor?: {
    lastEdit?: number
  }
  flags?: LLCTCallMetadataFlags
  blade?: {
    text?: string
    color?: string
  }
}

interface LLCTCall {
  metadata: LLCTCallMetadata
  timeline: LLCTCallLine[]
}
