import React, { useEffect } from "react";
import { graphql } from "gatsby";
import { each } from "lodash";
import { PageRenderer } from "../components/PageRenderer";
import { Helmet } from "react-helmet";
import { mergeGlobalBlockIntoPageBlocks } from "../helper/Helper";

export const query = graphql`
  query ($slug: String) {
    allGlobalBlock {
      nodes {
        block_id
        blocks
      }
    }
    website {
      name
    }
    page(slug: { eq: $slug }) {
      blocks
      page_name
      slug
      uuid
      code_head
      code_footer
      meta_title
      meta_description
    }
  }
`;

export default function Home(a) {
  const { data } = a;
  const globalBlocks = [];
  each(data.allGlobalBlock.nodes, block => {
    const b = { block_id: block.block_id };
    b.blocks = JSON.parse(block.blocks);
    globalBlocks.push(b);
  });
  const blocks = JSON.parse(data.page.blocks);
  const allBlocks = mergeGlobalBlockIntoPageBlocks(globalBlocks, blocks);
  const [codeHead, setCodeHead] = React.useState(false);
  const { meta_description, meta_title, page_name, code_head } = data.page;

  useEffect(() => {
    if (codeHead) return;
    window.document.head.innerHTML += code_head;
    setCodeHead(true);
  }, [code_head, codeHead]);

  return (
    <>
      <Helmet>
        <title>
          {meta_title || page_name} - {data.website.name}
        </title>
        {meta_description && (
          <meta name="description" content={meta_description} />
        )}
        <meta
          property="og:title"
          content={(meta_title || page_name) + "-" + data.website.name}
        />
      </Helmet>
      <PageRenderer pageBlocks={allBlocks} />
    </>
  );
}
