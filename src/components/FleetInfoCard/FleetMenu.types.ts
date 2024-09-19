import { TCurrentShipDeploying, TUserFleetState } from '~/pages/GamePage/GamePage.types';
import { TShipNameKeys } from '~/types/game';

export interface IFleetMenuProps {
  shipList: TUserFleetState;
  onDeployingShip: (shipId: TShipNameKeys, {locationX, locationY}:{locationX: number, locationY: number}) => void;
  currentShipDeploying: TCurrentShipDeploying;
}