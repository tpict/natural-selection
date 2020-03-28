# `AccessibilityPropsProvider`

The `AccessibilityPropsProvider` component assists with adding appropriate ARIA
attributes to the various elements that make up your interfaces. Some of these
attribute values are interdependent, and passing around the data to correctly
populate all of them can be cumbersome. By using context, we can pass all the
required data to a single provider component and then consume it from within
the constituent components, rather than increasing the complexity of their prop
interfaces.

Note that Natural Selection's provided components will log a warning if they're
used outside of an `AccessibilityPropsProvider`. Some functions e.g.
`useScrollToFocused` assume that the ARIA attributes are present and those
won't work if they're not.
