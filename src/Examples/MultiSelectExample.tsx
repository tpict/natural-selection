import React from "react";

import { MultiSelect } from "MultiSelect";

const options = [
  { value: "comp", label: "composable" },
  { value: "hooks", label: "hooks-based" },
  { value: "ts", label: "TypeScript-powered" },
];

export const MultiSelectExample: React.FC = () => (
  <MultiSelect options={options} />
);
