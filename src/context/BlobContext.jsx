import { createContext, useContext, useState } from "react";

const BlobContext = createContext(null);

export function BlobProvider({ children }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <BlobContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </BlobContext.Provider>
  );
}

export function useBlob() {
  return useContext(BlobContext);
}
