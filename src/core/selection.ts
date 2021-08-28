import eventBus from './eventbus'

export interface EditorSelected {
  line: number
  word: number
}

interface EditorSelectionEvents {
  update: (line: number, word: number) => void
}

export default class EditorSelection {
  selected: EditorSelected[]
  events: eventBus<EditorSelectionEvents>

  constructor () {
    this.selected = []
    this.events = new eventBus()
  }

  isSelected (line: number, word: number) {
    return (
      this.selected.filter(v => v.line === line && v.word === word).length > 0
    )
  }

  getIndex (line: number, word: number) {
    for (let i = 0; i < this.selected.length; i++) {
      if (this.selected[i].line === line && this.selected[i].word === word) {
        return i
      }
    }

    return -1
  }

  add (item: EditorSelected) {
    const index = this.selected.push(item)

    this.events.runAll('update', item.line, item.word)

    return index
  }

  remove (index: number) {
    this.events.runAll(
      'update',
      this.selected[index].line,
      this.selected[index].word
    )

    this.selected.splice(index, 1)
  }

  clear () {
    this.selected = []
    this.events.runAll('update')
  }
}
