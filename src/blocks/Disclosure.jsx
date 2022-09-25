import React, { useContext } from "react";
import { Disclosure } from "@headlessui/react";
import {
  HeadlessBlockContext,
  HeadlessBlockProvider,
} from "../contexts/HeadlessBlockContext";
import { useBlockAttributes } from "../hooks/useBlockAttributes";

export const DisclosureBlocks = {
  Disclosure: function D(block) {
    const { children } = block;
    const attrs = useBlockAttributes(block);
    return (
      <>
        <Disclosure as="div" {...attrs}>
          {({ open }) => (
            <HeadlessBlockProvider>{children}</HeadlessBlockProvider>
          )}
        </Disclosure>
      </>
    );
  },
  "Disclosure.Button": function D(block) {
    const { text, children } = block;
    const { setActive } = useContext(HeadlessBlockContext);
    const attrs = useBlockAttributes(block);
    return (
      <>
        <Disclosure.Button
          onClick={() => setActive(active => !active)}
          {...attrs}
        >
          {!children ? text : children}
        </Disclosure.Button>
      </>
    );
  },
  "Disclosure.Panel": function D(block) {
    const { content = "", children } = block;
    const attrs = useBlockAttributes(block);
    return (
      <>
        <Disclosure.Panel {...attrs}>
          {!children ? content : children}
        </Disclosure.Panel>
      </>
    );
  },
};
