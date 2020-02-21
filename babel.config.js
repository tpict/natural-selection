module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      "@babel/preset-react",
      "@babel/typescript",
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: ["last 2 versions"],
          },
        },
      ],
      "@emotion/babel-preset-css-prop",
    ],
    plugins: [
      "@babel/proposal-object-rest-spread",
      "@babel/proposal-optional-chaining",
      "@babel/proposal-nullish-coalescing-operator",
      "@emotion",
    ],
  };
};
