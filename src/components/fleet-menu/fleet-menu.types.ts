import { TShipId, TCursorLocation, TShip } from "~/types/game";

export interface IFleetMenuProps {
  variant: "player" | "opponent";
  setCursorLocation?: (cursorLocation: TCursorLocation) => void;
}

export interface IFleetMenuItemProps {
  shipData: TShip;
  isHidden?: boolean;
  shipOnDeployId: TShipId | null;
  onDeploying: (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => void;
}
