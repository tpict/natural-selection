import React from "react";
import {
  Option as BaseOption,
  OptionProps as BaseOptionProps,
} from "@natural-selection/core";

export type OptionProps<T> = BaseOptionProps<T> & {
  isActive?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
};

export function Option<T>({
  isDisabled,
  isActive,
  isFocused,
  innerRef,
  ...rest
}: OptionProps<T> & {
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
}): React.ReactElement {
  return (
    <BaseOption
      {...rest}
      innerRef={innerRef}
      css={theme => ({
        color: theme.colors.background,
        backgroundColor: theme.colors.foreground,
        padding: theme.space.option.padding,
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
      padding: theme.space.control.padding,
      border: theme.space.control.border,
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
