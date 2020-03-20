module.exports = function(api) {
  api.cache(true);

  const { CODE_COVERAGE } = process.env;
  const plugins = [
["istanbul", {
          "exclude": [
            "**/*.spec.tsx"
          ],
}],
    "@babel/proposal-object-rest-spread",
    "@babel/proposal-optional-chaining",
    "@babel/proposal-nullish-coalescing-operator",
    "@emotion",
  ];


  return {
    presets: [
      "@babel/preset-react",
      "@babel/preset-env",
      "@babel/typescript",
      "@emotion/babel-preset-css-prop",
    ],
    plugins,
    babelrc: false,
  };
};
