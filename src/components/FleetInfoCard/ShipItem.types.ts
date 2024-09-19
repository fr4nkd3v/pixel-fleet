import { TCurrentShipDeploying } from '~/pages/GamePage/GamePage.types';
import { type TShipNameKeys } from '~/types/game';

export interface IShipItemProps {
  shipId: TShipNameKeys;
  shipType: TShipNameKeys;
  health: number;
  isDeployed: boolean;
  onDeploying: (shipId: TShipNameKeys, {locationX, locationY}: {locationX: number, locationY: number}) => void;
  currentShipDeploying: TCurrentShipDeploying;
}