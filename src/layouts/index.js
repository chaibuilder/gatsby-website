import React, { useEffect } from "react";
import { HeadTags } from "../components/Head";

export default function Index({ children }) {
  const [init, setInit] = React.useState(false);

  useEffect(() => {
    if (!init) {
      setTimeout(() => {
        // window?.AOS?.init({ offset: 50, duration: 800 })
        setInit(true);
      }, 500);
    }
  }, [init]);

  return (
    <>
      <HeadTags />
      {children}
      {/*<Script src="https://unpkg.com/aos@next/dist/aos.js" />*/}
    </>
  );
}
