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
import { fromEvent, pipe, combineLatest, zip } from "rxjs"
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

type State = {
  word: string
  result: string[]
}

export const App = () => {
  const initial: [string, string[]] = ["", []] //{ word: "", result: [] }
  const [keyboardCallack, [word, result]] = useEventCallback(
    (event$) =>
      combineLatest(
        event$.pipe(
          tap(console.log),
          map((a) => a)
        ),
        event$.pipe(
          startWith([]),
          debounceTime(400),
          distinctUntilChanged(),
          mergeMap((word) => searchApi(word)),
          tap(console.log),
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

ReactDOM.render(<App />, document.getElementById("root"))
