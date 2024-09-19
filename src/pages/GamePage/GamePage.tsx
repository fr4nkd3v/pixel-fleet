import { FleetMenu } from '~/components/FleetInfoCard';
import styles from './GamePage.module.css';
import { type TShipNameKeys } from '~/types/game';
import { BattleMap } from '~/components/BattleMap';
import { DEFAULT_ORIENTATION, MAXIMUM_MAP_SIZE, SHIP_TYPES } from '~/constants/game';
import { useState } from 'react';
import type { TCurrentShipDeploying, TCursorLocation, TOptionalCursorLocation, TOrientationType, TUserFleetState, TMapCoordinates } from './GamePage.types';
import { CursorShadowShip } from '~/components/CursorShadowShip';
import { getNextCoordinates } from '~/utils/utils';
// import { useState } from 'react';

export const GamePage = () => {
  // Fleet & map size for each player
  const availableFleetIds: TShipNameKeys[] = [
    'missile_launcher',
    'destroyer',
    'battleship',
    'submarine',
  ];
  const mapSize = MAXIMUM_MAP_SIZE;

  // Generate fleet & map data for state
  const commonFleetArr = availableFleetIds.map(shipId => {
    return {
      id: shipId,
      name: SHIP_TYPES[shipId].name,
      health: SHIP_TYPES[shipId].length,
      location: { x: null, y: null },
    }
  })
  const playerFleetArr: TUserFleetState = [...commonFleetArr]
  const enemyFleetArr: TUserFleetState = [...commonFleetArr]

  // ? MapArr structure
  // Is an array of coordinate objects that have been covered or attacked
  // If is empty means that all tiles of map are neither covered nor attacked
  /* Example:
  [
    {
      x: 'a',
      y: 1,
      covered: true,
      attacked: false,
    },
    ...
  ]
  */

  const handleDeployingShip = (
    shipId: TShipNameKeys, {locationX, locationY}: {locationX: number, locationY: number}
  ) => {
    setCurrentShipDeploying({ shipId, orientation: DEFAULT_ORIENTATION});
    setCursorLocation({
      x: locationX,
      y: locationY,
    });
  }

  const handleDeployedShip = (
    shipId: TShipNameKeys, locationX: string, locationY: string
  ) => {
    if (!currentShipDeploying) return;

    setPlayerFleet(playerFleet.map(ship => {
      if (ship.id === shipId) {
        return {
          ...ship,
          location: {x: locationX, y: locationY}
        }
      } else {
        return ship;
      }
    }));

    const length: number = SHIP_TYPES[shipId].length;
    const coveredCoordinates = getNextCoordinates(locationX, Number(locationY), length, currentShipDeploying.orientation)
    const coordinatesInMap = coveredCoordinates.map(coor => ({
      x: coor.x,
      y: Number(coor.y),
      covered: true,
      attacked: false,
    }));
    setPlayerMap([
      ...playerMap,
      ...coordinatesInMap,
    ])
    setCurrentShipDeploying(null);
  }

  const handleChangeOrientation = (orientation: TOrientationType) => {
    if (!currentShipDeploying) return;

    setCurrentShipDeploying({
      ...currentShipDeploying,
      orientation
    })
  }

  const handleChangeCursorLocation = ({ x, y }: TCursorLocation) => {
    setCursorLocation({ x, y });
  }

  const [ playerFleet, setPlayerFleet ] = useState(playerFleetArr);
  const [ enemyFleet, setEnemyFleet ] = useState(enemyFleetArr);
  const [ playerMap, setPlayerMap ] = useState<TMapCoordinates>([]);
  const [ enemyMap, setEnemyMap ] = useState<TMapCoordinates>([]);
  const [ currentShipDeploying, setCurrentShipDeploying] = useState<TCurrentShipDeploying>(null);
  const [ cursorLocation, setCursorLocation ] = useState<TOptionalCursorLocation>(null);
  // TODO: add state for current player turn
  // TODO: add state for winner of game

  const currentShipDeployingLength = currentShipDeploying ? SHIP_TYPES[currentShipDeploying.shipId].length : null;

  return (
    <section className={styles['GamePage']}>
      <FleetMenu
        shipList={playerFleet}
        onDeployingShip={handleDeployingShip}
        currentShipDeploying={currentShipDeploying}
      />
      <FleetMenu
        shipList={enemyFleet}
        onDeployingShip={handleDeployingShip}
        currentShipDeploying={currentShipDeploying}
      />
      <BattleMap
        width={mapSize}
        height={mapSize}
        mapCoordinates={playerMap}
        currentShipDeploying={currentShipDeploying}
        onDeployedShip={handleDeployedShip}
        onChangeOrientation={handleChangeOrientation}
        onChangeCursorLocation={handleChangeCursorLocation}
      />
      <BattleMap
        width={mapSize}
        height={mapSize}
        mapCoordinates={enemyMap}
        currentShipDeploying={currentShipDeploying}
        onDeployedShip={handleDeployedShip}
        onChangeOrientation={handleChangeOrientation}
        onChangeCursorLocation={handleChangeCursorLocation}
      />
      {currentShipDeploying && cursorLocation && (
        <CursorShadowShip
          isVisible={true}
          length={currentShipDeployingLength}
          orientation={currentShipDeploying.orientation}
          locationX={cursorLocation.x}
          locationY={cursorLocation.y}
        />
      )}
    </section>
  )
}