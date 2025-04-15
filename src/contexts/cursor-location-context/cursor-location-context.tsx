import { createContext, useState } from "react";
import { TCursorLocation } from "~/types";
import { ICursorLocationContext, ICursorLocationProviderProps } from "./cursor-location-context.types";

export const CursorLocationContext = createContext<ICursorLocationContext | null>(null);

export const CursorLocationProvider = ({ children }: ICursorLocationProviderProps) => {
  const [cursorLocation, setCursorLocation] = useState<TCursorLocation | null>(null);

  return (
    <CursorLocationContext.Provider value={{ cursorLocation, setCursorLocation }}>
      {children}
    </CursorLocationContext.Provider>
  );
};
