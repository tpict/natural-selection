# `useEnsuredId`

A hook that wraps a possibly-undefined ID and provides a unique fallback if
it's not present. This is useful for components that require unique DOM IDs,
but you don't necessarily want users of the component to write one manually
each time it's used.

# Arguments

| Argument     | Type                 | Description                                                                                          |
| ------------ | -------------------- | ---------------------------------------------------------------------------------------------------- |
| `providedId` | `string | undefined` | If provided, this string will be used as the return value.                                           |
| `prefix`     | `string | undefined` | Defaults to `"natural-selection"`. This string will be suffixed with a number to form generated IDs. |

# Return value

| Property | Type     | Description                                                                                                                      |
| -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
|          | `string` | Either the provided ID, or a generated, unique one. The generated ID will have the same value for the lifetime of the component. |
