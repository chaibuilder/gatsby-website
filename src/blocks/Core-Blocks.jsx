import React from "react";
import { get, isEmpty, startsWith } from "lodash";
import { IconPickerItem } from "react-fa-icon-picker";
import { Link } from "gatsby";
import { DisclosureBlocks } from "./Disclosure";
import { TabBlocks } from "./TabBlocks";
import { useBlockAttributes } from "../hooks/useBlockAttributes";

function textIconComponent(children, content, icon, iconPos, attrs, tagName) {
  let child = !children ? (
    <>
      {content}
      {icon && (
        <span className={iconPos}>
          <IconPickerItem
            icon={icon}
            containerStyles={{ fontSize: "inherit", color: "inherit" }}
          />
        </span>
      )}
    </>
  ) : (
    children
  );
  return React.createElement(tagName, attrs, child);
}

export const getClasses = (classes, baseClasses = "") => {
  return baseClasses.concat(" ", classes);
};

export const REACT_BLOCKS = {
  ...DisclosureBlocks,
  ...TabBlocks,
  Box: function B(props) {
    const { children, animation = "" } = props;
    const attrs = useBlockAttributes(props);
    const { backgroundImage = "", tag = "div" } = props;
    const attr = {};
    if (!isEmpty(backgroundImage)) {
      attr.style = {
        backgroundImage: startsWith(backgroundImage, "http")
          ? `url("${backgroundImage}")`
          : `${backgroundImage.replace(";", "")}`,
      };
    }
    if (!isEmpty(animation)) {
      attr["data-aos"] = animation;
    }
    return React.createElement(
      tag,
      { ...attr, ...attrs },
      children ? children : null
    );
  },
  Button: function B(block) {
    const { children, icon, iconPos, content } = block;
    const attrs = useBlockAttributes(block);
    return textIconComponent(children, content, icon, iconPos, attrs, "button");
  },
  Link: function B(block) {
    const { children, link, icon, iconPos, content } = block;
    const attrs = useBlockAttributes(block);
    return textIconComponent(
      children,
      content,
      icon,
      iconPos,
      {
        ...attrs,
        to: link,
      },
      Link
    );
  },
  Text: block => {
    const { children, content } = block;
    const attrs = useBlockAttributes(block);
    return React.createElement("p", attrs, children ? children : content);
  },
  Span: function B(block) {
    const { children, content } = block;
    const attrs = useBlockAttributes(block);
    return React.createElement("span", attrs, children ? children : content);
  },
  EmptyBox: function B(block) {
    const attrs = useBlockAttributes(block);
    return React.createElement("div", attrs);
  },
  SVG: function B(block) {
    let { svg, svgIcon } = block;
    const attrs = useBlockAttributes(block);
    if (!isEmpty(svgIcon)) {
      return (
        <span {...attrs}>
          <IconPickerItem
            icon={svgIcon}
            containerStyles={{ fontSize: "inherit", color: "inherit" }}
          />
        </span>
      );
    }
    if (svg) {
      svg = svg.replace(
        "<svg",
        '<svg  class="' + get(attrs, "className", "") + '" '
      );
      svg = svg.replace(/\s\s+/g, " ");
    }
    return (
      <span
        dangerouslySetInnerHTML={{ __html: svg || "" }}
        className={"w-fit"}
      ></span>
    );
  },
  Heading: function B(props) {
    const { level = 1, content, children } = props;
    const attrs = useBlockAttributes(props);
    return React.createElement(
      `h${level}`,
      attrs,
      children ? children : content
    );
  },
  Line: function B(block) {
    const attrs = useBlockAttributes(block);
    return <hr {...attrs} />;
  },
  LineBreak: ({ classes }) => {
    return <br className={classes} />;
  },
  Image: function B(block) {
    const { url, alt } = block;
    const attrs = useBlockAttributes(block);
    return <img src={url} alt={alt} {...attrs} />;
  },
  List: function B(block) {
    const { children } = block;
    const attrs = useBlockAttributes(block);
    return React.createElement("ul", attrs, children);
  },
  ListItem: function B(block) {
    const { children, icon, content } = block;
    const attrs = useBlockAttributes(block);
    return React.createElement(
      "li",
      attrs,
      !children ? (
        <>
          {icon && (
            <IconPickerItem
              icon={icon}
              containerStyles={{ fontSize: "inherit", color: "inherit" }}
            />
          )}
          {content}
        </>
      ) : (
        children
      )
    );
  },
  Video: function B(block) {
    const attrs = useBlockAttributes(block);
    const videoId = "";
    return React.createElement("iframe", {
      ...attrs,
      src: `https://www.youtube.com/embed/${videoId}`,
    });
  },

  Form: function B(block) {
    const attrs = useBlockAttributes(block);
    return <form {...attrs}>{block.children}</form>;
  },
  Input: function B(block) {
    const { inputType = "text", placeholder } = block;
    const attrs = useBlockAttributes(block);
    return <input placeholder={placeholder} type={inputType} {...attrs} />;
  },
  TextArea: function B(block) {
    const { placeholder } = block;
    const attrs = useBlockAttributes(block);
    return <textarea placeholder={placeholder} {...attrs} />;
  },
  Select: function B(block) {
    const attrs = useBlockAttributes(block);
    return (
      <select {...attrs}>
        <option>Default Option</option>
      </select>
    );
  },
  FormButton: function B(block) {
    const { children, content } = block;
    const attrs = useBlockAttributes(block);
    return <button {...attrs}>{children ? children : content}</button>;
  },
};
