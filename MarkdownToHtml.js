/*

  This file is where the majority of the build happens.
  It processes a folder of markdown files (with frontmatter)
  and then renders them into the appropriate nunjucks templates.

  To get it to play nicely with webpack, I'm wrapping the
  NunjucksWebpackPlugin and injecting the markdown templates

*/
const fs = require('fs');
const glob = require('glob');
const matter = require('gray-matter');
const marked = require('marked');
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin');

// Strip data from filesnames and return only the slug
const getSlugFromFilename = filename =>
  filename
    .replace(/^(.*[\\\/])/, '')
    .replace(/^(\d{4}-\d{2}-\d{2}-)/, '')
    .replace(/\.md$/, '');

// aggregate markdown files from the challenge folder and parse the content as markdown
const getChallenges = () => {
  const files = glob.sync('./challenges/**/*.md');
  const data = files.reverse().map(f => {
    const parsedFile = matter(fs.readFileSync(f, 'utf8'));
    return {
      // inject the slug for use later
      filename: f,
      slug: getSlugFromFilename(f),
      ...parsedFile,
      // replace the content with the markdown parsed content
      content: marked(parsedFile.content)
    };
  });
  return data;
};

// get markdown files as JSON
const getTemplatesToRender = () => {
  const challenges = getChallenges();
  return [
    {
      from: "./src/templates/homepage.njk",
      to: './index.html',
      context: {
        challenges
      }
    },
    ...challenges.map(challenge => {
      return {
        from: "./src/templates/challenge.njk",
          to: `./${challenge.slug}/index.html`,
          context: challenge
      }
    })
  ];
}

// Create a dummy webpack plugin to wrap everything up
function MarkdownToHTML(options) {};
MarkdownToHTML.prototype.apply = function(compiler) {
  compiler.plugin("compilation", function(compilation) {
    // wrap the nunjucks plugin, and run it with the generated template data
    const nj = new NunjucksWebpackPlugin({ templates: getTemplatesToRender() });
    nj.apply(compiler);
  });
};

module.exports = MarkdownToHTML;
