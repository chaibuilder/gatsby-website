import { useContext, useMemo } from "react";
import { HeadlessBlockContext } from "../contexts/HeadlessBlockContext";
import { get } from "lodash";

/**
 * Returns the classes string
 * @param block
 */
export const useBlockClassname = block => {
  const { active } = useContext(HeadlessBlockContext);
  return (
    block.classes +
    " " +
    (active
      ? get(block, "dynamicClassesIf", "")
      : get(block, "dynamicClassesElse", ""))
  );
};

/**
 *
 * @param block
 */
export const useBlockAttributes = block => {
  const className = useBlockClassname(block);
  return useMemo(() => {
    const attrs = get(block, "attrs", {});
    const attributes = { className, ...attrs };
    return attributes;
  }, [className, block]);
};
