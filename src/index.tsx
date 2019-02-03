import * as React from "react"
import * as ReactDOM from "react-dom"
import { useObservable, useEventCallback } from "rxjs-hooks"
import {
  map,
  filter,
  scan,
  bufferTime,
  tap,
  debounceTime,
  mergeMap,
  combineAll,
  startWith,
  distinctUntilChanged
} from "rxjs/operators"
import { fromEvent, pipe, combineLatest, zip, from, of } from "rxjs"
import { useState } from "react"
import { searchApi } from "./api"

const Search = ({ word, result, changeInput }) => {
  return (
    <div>
      <input value={word} onChange={(e) => changeInput(e.target.value)} />
      <h3>Result</h3>
      <ul>
        {result.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  )
}

type State = [string, string[]]

export const App = () => {
  const initial: [string, string[]] = ["", []] //{ word: "", result: [] }
  const [keyboardCallack, [word, result]] = useEventCallback(
    (event$) =>
      combineLatest(
        event$, // 入力を即時反映させるために、
        event$.pipe(
          startWith([]),
          debounceTime(400),
          distinctUntilChanged(),
          mergeMap((word) => searchApi(word)),
          map((result) => (result !== undefined ? result : []))
        )
      ),
    initial
  )
  return (
    <div>
      <Search changeInput={keyboardCallack} word={word} result={result} />
    </div>
  )
}

const useSearch = (word) =>
  useObservable<string[], string[]>(
    (word$) =>
      word$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        mergeMap((word) => searchApi(word)),
        map((result) => (result !== undefined ? result : []))
      ),
    [],
    [word]
  )

export const App2 = () => {
  const [word, setWord] = useState("")
  let result = useSearch(word)
  return (
    <div>
      <Search changeInput={setWord} word={word} result={result} />
    </div>
  )
}

ReactDOM.render(
  <div>
    <App />
    <App2 />
  </div>,
  document.getElementById("root")
)
