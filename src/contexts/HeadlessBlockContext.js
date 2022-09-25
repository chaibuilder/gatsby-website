import React from "react";
import { createContext, useState } from "react";

export const HeadlessBlockContext = createContext({});

export const HeadlessBlockProvider = ({ children, value = false }) => {
  const [active, setActive] = useState(value);
  return (
    <HeadlessBlockContext.Provider value={{ setActive, active }}>
      {children}
    </HeadlessBlockContext.Provider>
  );
};
