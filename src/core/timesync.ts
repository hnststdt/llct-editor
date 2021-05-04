export default class CallTimeSync {
  root: HTMLDivElement
  timer?: number
  time: number

  caches: { lines: NodeListOf<Element>; lineWords: NodeListOf<Element>[] }
  fullRender: boolean

  // break: number

  constructor (element: HTMLDivElement) {
    this.root = element
    this.time = 0
    this.caches = {
      lines: element.querySelectorAll('.line'),
      lineWords: []
    }

    this.fullRender = false

    // this.break = 0
  }

  setTime (time: number) {
    this.time = Math.floor(time)
  }

  isStarted () {
    return this.timer !== 0 && typeof this.timer !== undefined
  }

  start () {
    if (this.timer) {
      return
    }

    const update = () => {
      this.update()

      this.timer = requestAnimationFrame(update.bind(this))
    }

    update()
  }

  stop () {
    if (!this.timer) {
      return
    }

    cancelAnimationFrame(this.timer)
    this.timer = undefined
  }

  fullRenderOnce () {
    this.fullRender = true
    this.update()
    this.fullRender = false

    requestAnimationFrame(() => {
      this.clearBefore()
    })
  }

  clearCache () {
    this.caches.lines = this.root.querySelectorAll('.line')
    this.caches.lineWords = []
  }

  clearBefore () {
    this.clearCache()

    for (let i = 0; i < this.caches.lines.length; i++) {
      let item = this.caches.lines[i] as HTMLDivElement

      if (item.dataset.passed) {
        item.dataset.passed = 'false'
      }

      let queries = item.querySelectorAll('.word')

      for (let w = 0; w < queries.length; w++) {
        let word = queries[w] as HTMLDivElement

        word.setAttribute('data-active', '')
        word.setAttribute('data-passed', '')
      }
    }
  }

  update () {
    // if (this.break < 3) {
    //   this.break++

    //   return
    // }
    // this.break = 0

    if (!this.caches.lines || !this.caches.lines.length) {
      this.clearCache()
    }

    for (let i = 0; i < this.caches.lines.length; i++) {
      let item = this.caches.lines[i] as HTMLDivElement

      const start = Number(item.dataset.start)
      const end = Number(item.dataset.end)

      if (!start || !end) {
        continue
      }

      if (this.time < end) {
        if (item.dataset.passed !== 'false') {
          item.dataset.passed = 'false'
        }
      } else if (item.dataset.passed !== 'true') {
        item.dataset.passed = 'true'
      }

      if (this.time < start || this.time > end) {
        if (!this.fullRender) {
          continue
        }
      }

      if (!this.caches.lineWords[i]) {
        this.caches.lineWords[i] = item.querySelectorAll(
          '.word[data-word="true"]'
        )
      }

      for (let w = 0; w < this.caches.lineWords[i].length; w++) {
        let word = this.caches.lineWords[i][w] as HTMLDivElement

        if (
          this.time > Number(word.dataset.start) &&
          this.time < Number(word.dataset.end)
        ) {
          if (word.dataset.active !== 'true') {
            word.dataset.active = 'true'
          }
        } else if (word.dataset.active !== 'false') {
          word.dataset.active = 'false'

          if (this.time > Number(word.dataset.end)) {
            word.dataset.passed = 'true'
          } else {
            word.dataset.passed = 'false'
          }
        }
      }
    }
  }
}
