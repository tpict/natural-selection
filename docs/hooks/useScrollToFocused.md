# `useScrollToFocused`

`useScrollToFocused` receives a container element and updates its scroll
position whenever a non-visible element receives focus, for example by
navigating with the arrow keys or by jumping to an option that matches text
input.

The hook assumes that the focused item will make appropriate use of the [`aria-selected` attribute](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-selected).

# Arguments

| Argument | Type                 | Description                                                                                         |
| -------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| `menuEl` | `HTMLElement | null` | A scrollable element containing at least one child which may receive the `aria-selected` attribute. |
