import React from "react";

export const simpleMemo: <T>(fn: T) => T = React.memo;
