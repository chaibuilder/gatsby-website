import { each, find, flatten, get, set } from "lodash"

/**
 * Important Function. Merges the global blocks into page blocks
 * @param globalBlocks
 * @param pageBlocks
 * @returns {*[]}
 */
export function mergeGlobalBlockIntoPageBlocks(globalBlocks, pageBlocks) {
  let newBlocks = []
  each(pageBlocks, pageBlock => {
    if (pageBlock.type === "ProjectBlock") {
      let projectBlocks = get(
        find(globalBlocks, { block_id: pageBlock.blockId }),
        "blocks",
        []
      )
      if (projectBlocks.length) {
        set(projectBlocks, "0.parent", pageBlock.parent)
        newBlocks = flatten([
          ...newBlocks,
          ...mergeGlobalBlockIntoPageBlocks(globalBlocks, projectBlocks),
        ])
      } else {
        newBlocks = [...newBlocks, ...projectBlocks]
      }
    } else {
      newBlocks.push(pageBlock)
    }
  })
  return newBlocks
}
