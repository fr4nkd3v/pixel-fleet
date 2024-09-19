import { TCurrentShipOnDeploy, type TShipId } from '~/types/game';

export interface IShipItemProps {
  shipId: TShipId;
  shipType: TShipId;
  health: number;
  isDeployed: boolean;
  onDeploying: (shipId: TShipId, {locationX, locationY}: {locationX: number, locationY: number}) => void;
  currentShipOnDeploy: TCurrentShipOnDeploy | null;
}