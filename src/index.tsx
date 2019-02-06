import * as React from "react"
import * as ReactDOM from "react-dom"
import { useEventCallback } from "rxjs-hooks"
import { map, bufferTime, distinctUntilChanged, tap } from "rxjs/operators"
import { useState, useEffect } from "react"

const Button = ({ updateCount }) => {
  const [eventCallback, result] = useEventCallback(
    (event$) =>
      event$.pipe(
        bufferTime(1000),
        map((v) => v.length),
        distinctUntilChanged()
        // tap((result) => updateCount(result))　// useEffectの代わりにtapしてもよさそう
      ),
    0
  )
  useEffect(() => updateCount(result), [result])
  return (
    <div>
      <button onClick={eventCallback}>Click!</button>
    </div>
  )
}

const TripleClickableButton = ({ onTripleClick }) => {
  const [eventCallback, isTripleClicked] = useEventCallback(
    (event$) =>
      event$.pipe(
        bufferTime(400),
        map((v) => v.length === 3)
      ),
    false
  )
  // useEffect(() => {
  //   if (isTripleClicked) {
  //     onTripleClick()
  //   }
  // }, [isTripleClicked])
  if (isTripleClicked) {
    onTripleClick()
  }

  return <button onClick={eventCallback}>Triple Click</button>
}

export const App = () => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <Button updateCount={setCount} />
      <div>{count} click / second</div>
      <TripleClickableButton
        onTripleClick={(e) => {
          console.log("triple click")
        }}
      >
        triple
      </TripleClickableButton>
    </div>
  )
}

ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById("root")
)
