module.exports = (ctx) => ({
  plugins: [
    require("postcss-import")(ctx.plugin),
    require("postcss-simple-vars")(ctx.plugin),
    require("postcss-nested")(ctx.plugin),
    require("postcss-math")(ctx.plugin),
    require("postcss-mixins")(ctx.plugin),
    require("css-mqpacker")(ctx.plugin),
    require('autoprefixer')({ browsers: ['last 2 versions'] }),
    require("cssnano")({
      "safe": true,
      "discardComments": {
        "removeAll": true
      }
    })
  ]
});