import React from "react";

import {
  Option as BaseOption,
  OptionProps as BaseOptionProps,
} from "../packages/core/src/components";

export type OptionProps<T> = BaseOptionProps<T> & {
  isActive?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
};

export function Option<T>({
  isDisabled,
  isActive,
  isFocused,
  ...rest
}: OptionProps<T>): React.ReactElement {
  return (
    <BaseOption
      {...rest}
      css={theme => ({
        color: theme.colors.background,
        backgroundColor: theme.colors.foreground,
        padding: "0.5rem",
        cursor: "pointer",

        ...(isDisabled && {
          opacity: 0.5,
          cursor: "initial",
        }),
        ...(isActive && {
          backgroundColor: theme.colors.foregroundActive,
        }),
        ...(isFocused && {
          backgroundColor: theme.colors.foregroundFocused,
        }),
      })}
    />
  );
}

export const Container: React.FC<JSX.IntrinsicElements["div"]> = props => (
  <div
    css={{ position: "relative", display: "inline-block", minWidth: "10rem" }}
    {...props}
  />
);

export const Control: React.FC<JSX.IntrinsicElements["div"]> = props => (
  <div
    css={theme => ({
      cursor: "pointer",
      padding: "0.5rem",
      border: "2px solid",
      borderColor: theme.colors.foreground,
      borderRadius: "0.4rem",
      borderStyle: "dashed",

      ":focus-within": {
        borderStyle: "solid",
      },
    })}
    {...props}
  />
);

export const Menu = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{}>
>(function Menu({ children, ...rest }, ref) {
  return (
    <div
      {...rest}
      ref={ref}
      css={theme => ({
        zIndex: 1,
        position: "absolute",
        margin: "0.4rem 0",
        width: "15rem",
        overflowY: "auto",
        borderRadius: "0.4rem",
        backgroundColor: theme.colors.foreground,
      })}
    >
      {React.Children.count(children) ? (
        children
      ) : (
        <span css={theme => ({ color: theme.colors.background })}>
          No options
        </span>
      )}
    </div>
  );
});

export const Placeholder: React.FC<JSX.IntrinsicElements["div"]> = props => (
  <div
    {...props}
    css={{
      position: "absolute",
    }}
  />
);
