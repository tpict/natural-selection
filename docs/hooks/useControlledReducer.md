# `useControlledReducer`

React's [built-in `useReducer`
hook](https://reactjs.org/docs/hooks-reference.html#usereducer) is a great fit
for selection components, which tend to have interdependent state, and
which often have similar-yet-different variants that share core logic.
`useControlledReducer` is a wrapper around `useReducer` that allows you to control
pieces of state from outside the component.

# Arguments

| Argument       | Type                                                       | Description                                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reducer`      | `Reducer<State, Action>`                                   | The reducer function.                                                                                                                                                                                                                                                                                                                                             |
| `initialState` | `State`                                                    | The initial state.                                                                                                                                                                                                                                                                                                                                                |
| `props`        | `Partial<State>`                                           | A subset of state that will override the corresponding state properties. If the reducer receives an action that would modify these properties, those changes will be overridden; if the reducer receives an action that _only_ updates those properties, the hook will bail out of the state update and won't trigger a render. This argument should be memoized. |
| onStateChange  | `(state: State, action: Action, prevState: State) => void` | A callback that will be invoked whenever the reducer modifies the state. It will receive the current state, the action that caused the state update, and the previous state, in that order. This is useful if you're using the "controlled props" pattern and need to update external state in response to dispatched actions.                                    |

# Return value

| Property | Type                | Description                     |
| -------- | ------------------- | ------------------------------- |
|          | `[State, Dispatch]` | Just like vanilla `useReducer`. |
