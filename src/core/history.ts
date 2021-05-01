const MAX_HISTORY_SIZE = 100

export default class WorkHistory {
  revision: number
  history: string[]

  constructor () {
    this.revision = 0
    this.history = []
  }

  add (data: Record<string, unknown>) {
    let addData = JSON.stringify(data)

    if (addData === this.history[this.history.length - 1]) {
      return -1
    }

    if (this.revision !== this.history.length - 1) {
      this.history = this.history.slice(0, this.revision + 1)
    }

    this.history.push(addData)

    if (this.history.length >= MAX_HISTORY_SIZE) {
      this.history = this.history.slice(-1 * MAX_HISTORY_SIZE)
    }

    this.revision = this.history.length - 1

    return this.revision
  }

  goBack () {
    if (this.history[this.revision - 1]) {
      this.revision--
    }

    return JSON.parse(this.history[this.revision])
  }

  goForward () {
    if (this.history[this.revision + 1]) {
      this.revision++
    }

    return JSON.parse(this.history[this.revision])
  }
}
