import React from "react"
import { get, isEmpty, omit } from "lodash"
import { REACT_BLOCKS } from "../blocks/Core-Blocks"
import FlatToNested from "flat-to-nested"

const flatToNestedInstance = new FlatToNested({ children: "nodes" })

const hasChildren = node => {
  return node.nodes && node.nodes.length > 0
}

export function getBlocksTree(blocks) {
  let elements = flatToNestedInstance.convert(
    blocks.map(block => omit(block, ["settings"]))
  )
  elements =
    !elements.type && elements.nodes
      ? elements.nodes
      : !isEmpty(elements)
      ? [elements]
      : []
  return elements
}

function ChildrenRenderer(props) {
  const { blocks } = props
  return (
    <>
      {React.Children.toArray(
        blocks.map((node, index) => {
          const children = hasChildren(node) ? (
            <ChildrenRenderer blocks={node.nodes || []} />
          ) : null
          return React.createElement(
            getBlockComponent(node.type),
            { ...node, index },
            children
          )
        })
      )}
    </>
  )
}

export const PageRenderer = ({ pageBlocks }) => {
  const tree = getBlocksTree(pageBlocks)
  return React.Children.toArray(
    tree.map((node, index) => {
      if (hasChildren(node)) {
        return React.createElement(
          getBlockComponent(node.type),
          { ...node },
          <ChildrenRenderer {...node} blocks={node.nodes || []} />
        )
      }
      return React.createElement(getBlockComponent(node.type), {
        ...node,
        index,
      })
    })
  )
}

function getBlockComponent(type) {
  return get(REACT_BLOCKS, type, () => <span>{type}</span>)
}
