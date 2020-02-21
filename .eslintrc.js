module.exports =  {
  parser:  '@typescript-eslint/parser',
  extends:  [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    "react-hooks"
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  'module',
  },
  settings: {
    react: {
      version: "detect",
    }
  },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": [
      2,
      {
        "varsIgnorePattern": "^_.",
        "argsIgnorePattern": "^_."
      }
    ],
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowTypedFunctionExpressions": true,
      "allowExpressions": true,
    }],
    "react/prop-types": 0,
    "no-console": ["error", { allow: ["warn", "error"] }],
    "camelcase": "off",
    "@typescript-eslint/camelcase": ["error", { properties: "never", ignoreImports: true }],
  },
};
