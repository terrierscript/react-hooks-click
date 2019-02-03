import * as React from "react"
import { useObservable } from "rxjs-hooks"
import { pluck, map, filter, scan } from "rxjs/operators"
import { fromEvent, pipe } from "rxjs"
import { Shake } from "reshake"

const konamiCommand = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"]

const arrowMap = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→"
}

const convertVisible = key => {
  if (arrowMap[key]) return arrowMap[key]
  if (key.length === 1) return key.toUpperCase()
  return null
}

const Konami = () => {
  return (
    <Shake
      h={74}
      v={80}
      r={0}
      dur={130}
      int={6.3}
      max={100}
      fixed={true}
      fixedStop={false}
      freez={false}
    >
      <h1>Konami Command Succeed</h1>
    </Shake>
  )
}

const keyEventStream = length => {
  return pipe(
    pluck("key"),
    map(convertVisible),
    filter(value => !!value),
    scan<string>((curr, next) => [...curr, next], []),
    map((cmd: string[]) => cmd.slice(-1 * length))
  )
}

export const useKonamiCommand = () => {
  const init = { keyeventLog: [], konami: false }
  return useObservable(() => {
    return fromEvent(document, "keydown").pipe(
      keyEventStream(konamiCommand.length),
      map((latestCmd: string[]) => ({
        keyeventLog: latestCmd,
        konami: konamiCommand.join("") === latestCmd.join("")
      }))
    )
  }, init)
}
export const App = () => {
  const { keyeventLog, konami } = useKonamiCommand()
  return (
    <div>
      <div>please key type: {keyeventLog}</div>
      <div>{konami ? <Konami /> : null}</div>
    </div>
  )
}

export default () => {
  return <App />
}
