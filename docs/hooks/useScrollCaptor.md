# `useScrollCaptor`

`useScrollCaptor` is a hook that serves as a cross-browser replacement for the
[`overscroll-behavior` CSS
property](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior),
which is not supported by Safari. The passed HTML node's scroll behavior
will match that of a node with `overscroll-behavior: none;` in supported
browsers.

# Arguments

| Argument | Type                 | Description                                                                            |
| -------- | -------------------- | -------------------------------------------------------------------------------------- |
| `node`   | `HTMLElement | null` | A scrollable element which should block "overscrolling" on any of its parent elements. |
