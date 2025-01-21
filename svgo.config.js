module.exports = {
  js2svg: { indent: 2, pretty: true },
  plugins: [
    {
      name: "inlineStyles",
      params: {
        onlyMatchedOnce: false,
        removeMatchedSelectors: true,
      },
    },
  ],
};
