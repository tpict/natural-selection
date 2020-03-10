import { createSelector } from "reselect";

export const filteredOptionsSelector: <OptionType extends {
  label: string;
}>(state: {
  options: OptionType[];
  inputValue: string;
}) => OptionType[] = createSelector(
  state => state.options,
  state => state.inputValue,
  (options, inputValue) =>
    options.filter(({ label }) =>
      label.toLowerCase().includes(inputValue.toLowerCase()),
    ),
);

export const focusedOptionSelector: <OptionType extends {
  label: string;
}>(state: {
  options: OptionType[];
  inputValue: string;
  focusedIndex: number;
}) => OptionType = createSelector(
  filteredOptionsSelector,
  state => state.focusedIndex,
  (options, focusedIndex) => options[focusedIndex],
);
