import React, { useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { Helmet } from "react-helmet";
import { get } from "lodash";

function getBodyClasses(options) {
  const textLight = get(options, "bodyTextLight", "#64748b");
  const textDark = get(options, "bodyTextDark", "#94a3b8");
  const bgLight = get(options, "bodyBgLight", "#FFFFFF");
  const bgDark = get(options, "bodyBgDark", "#0f172a");
  let bodyClass = `font-body antialiased text-[${textLight}] bg-[${bgLight}] dark:text-[${textDark}] dark:bg-[${bgDark}]`;
  return bodyClass;
}

export function HeadTags() {
  const data = useStaticQuery(graphql`
    query {
      siteCss {
        css
      }
      website {
        name
        project_options {
          bodyFont
          headingFont
          roundedCorners
          primary
          secondary
          bodyBgDark
          bodyBgLight
          bodyTextDark
          bodyTextLight
        }
        code_head
        code_footer
        favicon
        social_media_img
      }
    }
  `);
  const headingFont = get(data.website.project_options, "headingFont", "Inter");
  const bodyFont = get(data.website.project_options, "bodyFont", "Inter");
  const { social_media_img, favicon, code_head } = data.website;
  const [codeHead, setCodeHead] = React.useState(false);

  useEffect(() => {
    if (codeHead) return;
    window.document.head.innerHTML += code_head;
    setCodeHead(true);
  }, [code_head, codeHead]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <style>{data.siteCss.css}</style>
        <body class={getBodyClasses(data.website.project_options)} />
        {/*<link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />*/}
        {favicon && <link rel="icon" type="image/x-icon" href={favicon} />}
        {social_media_img && (
          <meta property="og:image" content={social_media_img} />
        )}
        {headingFont ? (
          <link
            key={"body-font"}
            id="body-font"
            rel="stylesheet"
            type="text/css"
            href={`https://fonts.googleapis.com/css2?family=${bodyFont.replace(
              / /g,
              "+"
            )}:wght@300;400;500;600;700;800;900&display=swap" media="all"`}
          />
        ) : null}
        {bodyFont && headingFont !== bodyFont ? (
          <link
            key={"body-font"}
            id="body-font"
            rel="stylesheet"
            type="text/css"
            href={`https://fonts.googleapis.com/css2?family=${bodyFont.replace(
              / /g,
              "+"
            )}:wght@300;400;500;600;700;800;900&display=swap" media="all"`}
          />
        ) : null}
      </Helmet>
    </>
  );
}
