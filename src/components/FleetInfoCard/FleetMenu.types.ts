import { TCurrentShipOnDeploy, TShipId, TFleet } from '~/types/game';

export interface IFleetMenuProps {
  shipList: TFleet;
  onDeployingShip: (shipId: TShipId, {locationX, locationY}:{locationX: number, locationY: number}) => void;
  currentShipOnDeploy: TCurrentShipOnDeploy | null;
}