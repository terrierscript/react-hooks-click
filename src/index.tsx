import * as React from "react"
import * as ReactDOM from "react-dom"
import { useEventCallback } from "rxjs-hooks"
import {
  map,
  tap,
  debounceTime,
  mapTo,
  bufferTime,
  filter,
  distinctUntilChanged
} from "rxjs/operators"

const Button = () => {
  const [eventCallback, result] = useEventCallback(
    (event$) =>
      event$.pipe(
        bufferTime(1000),
        map((v) => v.length),
        distinctUntilChanged()
      ),
    0
  )

  return (
    <div>
      <button onClick={eventCallback}>Click!</button>
      <div>{result} click / second</div>
    </div>
  )
}

export const App = () => {
  return (
    <div>
      <Button />
    </div>
  )
}

ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById("root")
)
