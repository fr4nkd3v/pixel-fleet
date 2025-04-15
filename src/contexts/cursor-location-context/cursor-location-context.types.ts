import { Dispatch, ReactNode, SetStateAction } from "react";
import { TCursorLocation } from "~/types";

export interface ICursorLocationContext {
  cursorLocation: TCursorLocation | null;
  setCursorLocation: Dispatch<SetStateAction<TCursorLocation | null>>;
}

export interface ICursorLocationProviderProps {
  children: ReactNode;
}
