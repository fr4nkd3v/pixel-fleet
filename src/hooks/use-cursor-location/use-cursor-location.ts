import { useContext } from "react";
import { CursorLocationContext } from "~/contexts";

export const useCursorLocation = () => {
  const context = useContext(CursorLocationContext);
  if (!context) throw new Error("useCursorLocation must be used inside a CursorLocationProvider");
  return context;
};
