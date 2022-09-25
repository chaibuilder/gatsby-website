import React, { createContext } from "react"

export const PagePreviewContext = createContext({
  onLinkClick: link => console.log("Linked clicked", link),
})

export const PagePreviewProvider = ({ children, onLinkClick }) => {
  return (
    <PagePreviewContext.Provider value={{ onLinkClick }}>
      {children}
    </PagePreviewContext.Provider>
  )
}
