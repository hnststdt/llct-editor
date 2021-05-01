export default class CallTimeSync {
  root: HTMLDivElement
  timer?: number
  time: number

  caches: { [index: string]: NodeListOf<Element> }

  break: number

  constructor (element: HTMLDivElement) {
    this.root = element
    this.time = 0
    this.caches = {
      lines: element.querySelectorAll('.line')
    }

    this.break = 0
  }

  setTime (time: number) {
    this.time = Math.floor(time)
  }

  start () {
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
  }

  update () {
    if (this.break < 9) {
      this.break++

      return
    }
    this.break = 0

    if (!this.caches.lines || !this.caches.lines.length) {
      this.caches.lines = this.root.querySelectorAll('.line')
    }

    let counts = 0

    for (let i = 0; i < this.caches.lines.length; i++) {
      let item = this.caches.lines[i] as HTMLDivElement

      if (
        item.dataset.start === '0' ||
        item.dataset.end === '0' ||
        this.time < Number(item.dataset.start) ||
        this.time > Number(item.dataset.end)
      ) {
        continue
      }

      counts++

      console.log(item)
    }
  }
}
