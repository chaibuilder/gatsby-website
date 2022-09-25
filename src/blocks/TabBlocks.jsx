import React, { useContext, useEffect } from "react";
import { Tab } from "@headlessui/react";
import {
  HeadlessBlockContext,
  HeadlessBlockProvider,
} from "../contexts/HeadlessBlockContext";
import { useBlockAttributes } from "../hooks/useBlockAttributes";

const TabListContext = React.createContext({ tabIndex: 0 });

const TabItem = ({ block }) => {
  const { children, content } = block;
  const attrs = useBlockAttributes(block);
  const { tabIndex } = useContext(TabListContext);
  const { setActive } = useContext(HeadlessBlockContext);

  useEffect(() => {
    setActive(tabIndex === block.index);
  }, [tabIndex, block, setActive]);

  return (
    <Tab as={"li"} {...attrs}>
      {!children ? content : children}
    </Tab>
  );
};

export const TabBlocks = {
  "Tab.Group": function D(block) {
    const { children } = block;
    const attrs = useBlockAttributes(block);
    return (
      <Tab.Group as="div" {...attrs}>
        {children}
      </Tab.Group>
    );
  },
  "Tab.List": function D(block) {
    const { children } = block;
    const attrs = useBlockAttributes(block);
    return (
      <Tab.List as="ul" {...attrs}>
        {({ selectedIndex }) => (
          <TabListContext.Provider value={{ tabIndex: selectedIndex }}>
            {children}
          </TabListContext.Provider>
        )}
      </Tab.List>
    );
  },
  Tab: function D(block) {
    const { tabIndex } = useContext(TabListContext);
    return (
      <HeadlessBlockProvider value={tabIndex === block.index}>
        <TabItem block={block} tabIndex={tabIndex} />
      </HeadlessBlockProvider>
    );
  },

  "Tab.Panels": function D(block) {
    const { children } = block;
    const attrs = useBlockAttributes(block);
    return <Tab.Panels {...attrs}>{children}</Tab.Panels>;
  },
  "Tab.Panel": function D(block) {
    const { content = "", children } = block;
    const attrs = useBlockAttributes(block);
    return <Tab.Panel {...attrs}>{!children ? content : children}</Tab.Panel>;
  },
};
