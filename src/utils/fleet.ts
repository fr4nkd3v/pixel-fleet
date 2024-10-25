import { SHIP_TYPES } from "~/constants/game";
import { TFleet, TShipId, TShipPart } from "~/types/game";

export const prepareFleet = (ships: TShipId[]): TFleet => {
  const fleet = ships.map((shipId) => {
    return {
      id: shipId,
      name: SHIP_TYPES[shipId].name,
      health: SHIP_TYPES[shipId].length,
      isDeployed: false,
    };
  });
  return fleet;
};

export const getShipPartByIndex = (
  index: number,
  shipLength: number
): TShipPart =>
  index === 0 ? "start" : index === shipLength - 1 ? "end" : "middle";
