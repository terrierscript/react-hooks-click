import * as React from "react"
import * as ReactDOM from "react-dom"
import { useObservable } from "rxjs-hooks"
import { map, filter, scan, bufferTime, tap } from "rxjs/operators"
import { fromEvent, pipe } from "rxjs"
import { Shake } from "reshake"

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

const convertVisible = (key) => {
  if (arrowMap[key]) return arrowMap[key]
  if (key.length === 1) return key.toUpperCase()
  return null
}

const SucceedCommand = ({ succeedCommand }) => {
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
      <h1>{succeedCommand} Succeed</h1>
    </Shake>
  )
}

const convertKeys = (keys) =>
  keys.length === 1
    ? convertVisible(keys[0].key)
    : convertKeyMap(keys.map(({ keyCode }) => keyCode).sort())

type KeyTuple = { key: string; keyCode: number }

const keyEventStream = (length) => {
  return pipe(
    map<KeyboardEvent, KeyTuple>(({ key, keyCode }) => ({ key, keyCode })),
    tap((k) => console.log("key", k)),
    bufferTime(60),
    filter((item) => item.length > 0),
    map((keys) => convertKeys(keys)),
    filter((value) => !!value),
    scan<string>((curr, next) => [...curr, next], []),
    map((cmd: string[]) => cmd.slice(-1 * length))
  )
}

export const useKeyCommnads = (length: number) => {
  return useObservable(
    () =>
      fromEvent<KeyboardEvent>(document, "keydown").pipe(
        keyEventStream(length)
      ),
    []
  )
}

const isCommandSucceed = (keyeventLog: string[], command: string[]) => {
  const current = keyeventLog.slice(-1 * command.length)
  return command.join("") === current.join("")
}

export const useCommands = () => {
  const commands = {
    konami: ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"],
    shoryuken: ["↓", "→", "↘", "P"],
    hadoken: ["↓", "↘", "→", "P"]
  }
  const saveLength = Math.max(...Object.values(commands).map((l) => l.length))
  const keyeventLog = useKeyCommnads(saveLength)
  const succeedCommands = Object.entries(commands)
    .filter(([_, command]) => {
      return isCommandSucceed(keyeventLog, command)
    })
    .map(([name, commands]) => name)
  return { keyeventLog, succeedCommands }
}

export const App = () => {
  const { keyeventLog, succeedCommands } = useCommands()
  return (
    <div>
      <div>please key type: {keyeventLog}</div>
      <div>
        {succeedCommands.map((command) => (
          <SucceedCommand succeedCommand={command} />
        ))}
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
