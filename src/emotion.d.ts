import { Theme as CustomTheme } from "./themes";

declare module "@emotion/react" {
  export interface Theme extends CustomTheme {} // eslint-disable-line @typescript-eslint/no-empty-interface
}
