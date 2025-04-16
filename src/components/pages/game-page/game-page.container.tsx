import { GamePage } from "./game-page";
import { CursorLocationProvider } from "~/contexts/cursor-location-context";

export const GamePageContainer = () => {
  return (
    <CursorLocationProvider>
      <GamePage />
    </CursorLocationProvider>
  );
};
