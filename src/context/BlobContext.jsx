import { createContext, useContext, useState } from "react";

const BlobContext = createContext(null);

export function BlobProvider({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);

  // Used to signal the cyklus fly-in/out transition between
  // App.jsx and Cyklus.jsx. Cyklus.jsx sets this to true before
  // navigating back to "/", and App.jsx picks it up to trigger
  // the blobs flying back in from their corners.
  const [cyklusTransitioning, setCyklusTransitioning] = useState(false);

  return (
    <BlobContext.Provider
      value={{
        expanded,
        setExpanded,
        videoExpanded,
        setVideoExpanded,
        cyklusTransitioning,
        setCyklusTransitioning,
      }}
    >
      {children}
    </BlobContext.Provider>
  );
}

export function useBlob() {
  return useContext(BlobContext);
}
