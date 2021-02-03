require('dotenv').config();

const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
// const pluginImage = require('@navillus/eleventy-plugin-image')
const pluginSrcsetImg = require("eleventy-plugin-srcset");
// Algolia
const algoliasearch = require('algoliasearch');
const client = algoliasearch(process.env.ALGOLIA_SEARCH, process.env.ALGOLIA_ADMIN);
const index = client.initIndex('dev_CPS');
const contactsJSON = require('./contacts.json');

index.saveObjects(contactsJSON, {
  autoGenerateObjectIDIfNotExist: true
}).then(({ objectIDs }) => {
  console.log(objectIDs);
});

index.setSettings({
  'customRanking': ['desc(followers)']
}).then(() => {
  // done
});


// function imageShortcode(src, klass, alt, sizes, widths) {
//   let options = {
//     widths: widths,
//     formats: ['jpeg', 'webp'],
//     outputDir: "./static/img",
//     urlPath: "/static/img/",
//     sharpJpegOptions: {
//       quality: 85,
//       progressive: true
//     }
//   };
//   let source = path.join(__dirname, "_includes/", src);
//   // generate images, while this is async we don’t wait
//   Image(source, options);

//   let imageAttributes = {
//     class: klass,
//     alt,
//     sizes,
//     loading: "lazy",
//     decoding: "async",
//     whitespaceMode: "inline"
//   };
//   // get metadata even the images are not fully generated
//   metadata = Image.statsSync(source, options);
//   return Image.generateHTML(metadata, imageAttributes);
// }



module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Responsive Images
  // eleventyConfig.addPlugin(respimg);
  // eleventyConfig.addNunjucksShortcode("respImg", imageShortcode);
  // eleventyConfig.addPlugin(respfigure);
  // eleventyConfig.addPlugin(respimg);
  // eleventyConfig.addPlugin(pluginImage, {
  //   input: 'src/assets',
  //   // ...plugin options
  // })

  eleventyConfig.addPlugin(pluginSrcsetImg, {
    autoselector: '.resp',
    createCaptions: true,
    dirs: {
      temp: "./.tmp/",
      input: "./src/static/img",
      output: "./_site/static/img",
      srcsetWidths: [320, 480, 640, 768, 1024, 1280, 1536],
      resizeOriginal: false,
    }
  });

  // eleventyConfig.addFilter(
  //   "relative",
  //   (page, root = "/") =>
  //     `${require("path").relative(page.filePathStem, root)}/`
  // );

  // eleventyConfig.addFilter('relativeUrl', (url, page) => {
  //   if (!url.startsWith('/')) {
  //     throw new Error('URL is already relative')
  //   }
  //   const relativeUrl = path.relative(page.filePathStem, url)
  //   return path.relative('..', relativeUrl)
  // })
  // eleventyConfig.addShortcode("responsiveImg", function (imageURL, pictureAtr, imgAtr) {
  //   return `
  //         {% set image = imageURL | sharp %}
  //         <picture {{ pictureAtr }}>
  //             <source srcset="{% getUrl image | resize({ width: 640}) %} 640w">
  //             <source srcset="{% getUrl image | resize({ width: 768}) %} 768w">    
  //             <source srcset="{% getUrl image | resize({ width: 1024}) %} 1024w">   
  //             <source srcset="{% getUrl image | resize({ width: 1280}) %} 1280w">   
  //             <source srcset="{% getUrl image | resize({ width: 1536}) %} 1536w">   

  //             <img {{ imgAtr }} 
  //             srcset="{% getUrl image | resize({ width: 640}) %} 640w, 
  //                     {% getUrl image | resize({ width: 768}) %} 768w,
  //                     {% getUrl image | resize({ width: 1024}) %} 1024w,
  //                     {% getUrl image | resize({ width: 1280}) %} 1280w,
  //                     {% getUrl image | resize({ width: 1536}) %} 1536w">
  //         </picture>`;
  // });


  // eleventyConfig.addShortcode("r-img", function(firstName, lastName) { 
  //   return `
  //   <picture>
  //     <source srcset="{% getUrl image | resize({ width: 1440, height: 460 }) %} 1x, {% getUrl image | resize({ width: 2560, height: 800 }) %} 2x" media="(min-width: 640px)">
  //   <img class="articleHero-image" srcset="{% getUrl image | resize({ width: 640, height: 320 }) %} 1x, {% getUrl image | resize({ width: 1280, height: 640 }) %} 2x" alt="{{ image.title }}">
  //   </picture>
  //   `
  // });


  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  // Add Tailwind Output CSS as Watch Target
  eleventyConfig.addWatchTarget("./_tmp/static/css/style.css");

  //   eleventyConfig.addWatchTarget("./_includes/*.css");
  // eleventyConfig.setWatchThrottleWaitTime(5000);


  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    // "./_tmp/static/css/style.css": "./static/css/style.css",
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/alpine.js": "./static/js/alpine.js",
    // "./src/static/js/components.js": "./static/js/components.js"
    // "./node_modules/prismjs/themes/prism-tomorrow.css":
    //   "./static/css/prism-tomorrow.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy({ "src/static/img": "static/img" });

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
