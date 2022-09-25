const axios = require("axios");
const { get, isNil, omitBy } = require("lodash");
const path = require(`path`);
const defaultTheme = require("tailwindcss/defaultTheme");
const CleanCSS = require("clean-css");
const chroma = require("chroma-js");
const tailwindcss = require("tailwindcss");
const postcss = require("postcss");

function getColor(color) {
  return {
    DEFAULT: color,
    50: chroma(color).brighten(1.5).hex(),
    100: chroma(color).brighten(1.2).hex(),
    200: chroma(color).brighten(0.9).hex(),
    300: chroma(color).brighten(0.6).hex(),
    400: chroma(color).brighten(0.3).hex(),
    500: chroma(color).darken(0.3).hex(),
    600: chroma(color).darken(0.6).hex(),
    700: chroma(color).darken(0.9).hex(),
    800: chroma(color).darken(1.2).hex(),
    900: chroma(color).darken(1.5).hex(),
  };
}

function getBodyClasses(options) {
  const textLight = get(options, "bodyTextLight", "#64748b");
  const textDark = get(options, "bodyTextDark", "#94a3b8");
  const bgLight = get(options, "bodyBgLight", "#FFFFFF");
  const bgDark = get(options, "bodyBgDark", "#0f172a");
  let bodyClass = `font-body antialiased text-[${textLight}] bg-[${bgLight}] dark:text-[${textDark}] dark:bg-[${bgDark}]`;
  return bodyClass;
}

async function getSiteCSS(blocks, options, safelist = []) {
  const primary = get(options, "primary", "#000");
  const secondary = get(options, "secondary", "#ccc");

  const headingFont = get(options, "headingFont", "Inter");
  const bodyFont = get(options, "bodyFont", "Inter");
  const borderRadius = get(options, "roundedCorners", "0");

  let defaultConfig = {
    mode: "jit",
    purge: [],
    theme: {},
    plugins: [
      require("@tailwindcss/forms"),
      require("@tailwindcss/typography"),
      require("@tailwindcss/aspect-ratio"),
      require("@tailwindcss/line-clamp"),
    ],
  };

  let config = {
    darkMode: "class",
    purge: {
      enabled: true,
      content: [{ raw: blocks }],
    },
    safelist,
    theme: {
      fontFamily: {
        heading: [headingFont, ...defaultTheme.fontFamily.sans],
        body: [bodyFont, ...defaultTheme.fontFamily.sans],
      },
      extend: {
        borderRadius: {
          global: (!borderRadius ? "0" : borderRadius) + "px",
        },

        colors: {
          primary: getColor(primary),
          secondary: getColor(secondary),
        },
      },
    },
  };
  const result = await postcss([
    tailwindcss({ ...defaultConfig, ...config }),
    require("autoprefixer"),
  ]).process(
    `@tailwind base;
      @tailwind components;
      @tailwind utilities;`,
    { from: undefined }
  );
  return new CleanCSS({}).minify(
    result.css +
      `h1,h2,h3,h4,h5,h6,h1 *,h2 *,h3 *,h4 *,h5 *,h6 *{font-family: "${headingFont}",${defaultTheme.fontFamily.sans.join(
        ", "
      )};}`
  ).styles;
}

// constants for your GraphQL Post and Author types
const NODE_TYPE = `Page`;

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  getNodesByType,
}) => {
  const { createNode } = actions;
  const websiteUuid = process.env.GATSBY_WEBSITE_UUID;

  let websiteData = {};
  try {
    const response = await axios.get(
      "https://cloud.chaibuilder.com/api/chai-website-data?uuid=" + websiteUuid
    );
    websiteData = response.data;
  } catch (error) {
    console.log("Error", error);
    return;
  }

  const pages = [];
  for (const page of websiteData.pages) {
    const response = await axios.get(
      "https://cloud.chaibuilder.com/api/chai-page-data?uuid=" + page.uuid
    );
    pages.push({ ...page, blocks: response.data });
  }

  const website = {
    ...{ code_head: "", code_footer: "", favicon: "", social_media_img: "" },
    ...omitBy(websiteData.website, isNil),
  };

  console.log("Website", website);

  //create node for website
  createNode({
    ...website,
    id: createNodeId(`${"Website"}-${websiteUuid}`),
    parent: null,
    children: [],
    internal: {
      type: "Website",
      contentDigest: createContentDigest(website),
    },
  });

  let allBlocks = [];
  //create nodes for global Core-Blocks.jsx
  for (const block of websiteData.globalBlocks) {
    allBlocks = [...allBlocks, block];
    block.blocks = JSON.stringify(block.blocks);
    const nodeMeta = {
      id: createNodeId(`GlobalBlock-${block.block_id}`),
      parent: null,
      children: [],
      internal: {
        type: "GlobalBlock",
        contentDigest: createContentDigest(block),
      },
    };
    const node = Object.assign({}, block, nodeMeta);
    createNode(node);
  }
  //dummy global block for pages without global blocks
  const nodeMeta = {
    id: createNodeId(`GlobalBlock-dummy`),
    parent: null,
    children: [],
    internal: {
      type: "GlobalBlock",
      contentDigest: createContentDigest({}),
    },
  };
  const node = Object.assign(
    {},
    { blocks: JSON.stringify([]), block_id: "dummy" },
    nodeMeta
  );
  createNode(node);

  // loop through data and create Gatsby nodes
  const homepage = websiteData.website.homepage;
  pages.forEach(page => {
    allBlocks = [...allBlocks, page.blocks];
    page.blocks = JSON.stringify(page.blocks.blocks);
    if (page.uuid === homepage) {
      page.slug = "";
    }
    page = {
      ...{
        meta_title: "",
        meta_description: "",
        code_head: "",
        code_footer: "",
      },
      ...omitBy(page, isNil),
    };
    createNode({
      ...page,
      id: createNodeId(`${NODE_TYPE}-${page.uuid}`),
      parent: null,
      children: [],
      internal: {
        type: NODE_TYPE,
        contentDigest: createContentDigest(page),
      },
    });
  });

  // generate CSS:
  const css = await getSiteCSS(
    JSON.stringify(allBlocks),
    websiteData.website.project_options,
    getBodyClasses(websiteData.website.project_options).split(" ")
  );
  createNode({
    css,
    id: createNodeId(`SiteCSS`),
    parent: null,
    children: [],
    internal: {
      type: "SiteCSS",
      contentDigest: createContentDigest(css),
    },
  });

  return;
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      website {
        homepage
      }
      allPage {
        nodes {
          slug
          uuid
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const templatePath = path.resolve(`src/templates/page.js`);
  result.data.allPage.nodes.forEach(node => {
    const slug = `/${node.slug}`;
    createPage({
      path: slug,
      component: templatePath,
      context: {
        slug: node.slug,
      },
    });
  });
};
