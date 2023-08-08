const purgecss = require("@fullhuman/postcss-purgecss");
const purgeSvelte = require("purgecss-from-svelte");
const env = process.env.NODE_ENV;

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = {
  plugins: [
    require("postcss-import")(),
    require("postcss-preset-env")({
      browsers: "last 2 versions",
    }),
    require("tailwindcss")("./tailwind.config.js"),
    require("postcss-extend")(),
    require("autoprefixer")(),
  ],
};
