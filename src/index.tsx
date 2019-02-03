import * as React from "react"
import * as ReactDOM from "react-dom"
import { useObservable } from "rxjs-hooks"
import { pluck, map, filter, scan, bufferTime } from "rxjs/operators"
import { fromEvent, pipe } from "rxjs"
import { Shake } from "reshake"

const konamiCommand = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"]

const arrowMap = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→"
}

const convertKeyMap = (keys: number[]) => {
  const join = keys.join("_")
  switch (join) {
    case "37_38":
      return "↖"
    case "37_40":
      return "↙"
    case "38_39":
      return "↗"
    case "39_40":
      return "↘"
  }
  return null
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

export const useKeyCommnads = () => {
  return useObservable(() => {
    return fromEvent(document, "keydown").pipe(
      keyEventStream(konamiCommand.length)
    )
  }, [])
}

export const useKonamiCommand = () => {
  const keyeventLog = useKeyCommnads()
  return {
    keyeventLog,
    konami: konamiCommand.join("") === keyeventLog.join("")
  }
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

ReactDOM.render(<App />, document.getElementById("root"))
