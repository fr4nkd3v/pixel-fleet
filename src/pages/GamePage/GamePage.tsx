import { FleetMenu } from '~/components/FleetInfoCard';
import styles from './GamePage.module.css';
import { TCurrentShipOnDeploy, TCursorLocation, TMapCoordinate, TOrientationType, TFleet, TShipId } from '~/types/game';
import { BattleMap } from '~/components/BattleMap';
import { DEFAULT_ORIENTATION, MAXIMUM_MAP_SIZE, SHIP_TYPES } from '~/constants/game';
import { useState } from 'react';
import { CursorShadowShip } from '~/components/CursorShadowShip';
import { getNextCoordinates } from '~/utils/utils';
// import { useState } from 'react';

export const GamePage = () => {
  // Fleet & map size for each player
  const availableFleetIds: TShipId[] = [
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
  const playerFleetArr: TFleet = [...commonFleetArr]
  const enemyFleetArr: TFleet = [...commonFleetArr]

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
    shipId: TShipId, {locationX, locationY}: {locationX: number, locationY: number}
  ) => {
    setCurrentShipOnDeploy({ shipId, orientation: DEFAULT_ORIENTATION});
    setCursorLocation({
      x: locationX,
      y: locationY,
    });
  }

  const handleDeployedShip = (
    shipId: TShipId, locationX: string, locationY: string
  ) => {
    if (!currentShipOnDeploy) return;

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
    const coveredCoordinates = getNextCoordinates(locationX, Number(locationY), length, currentShipOnDeploy.orientation)
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
    setCurrentShipOnDeploy(null);
  }

  const handleChangeOrientation = (orientation: TOrientationType) => {
    if (!currentShipOnDeploy) return;

    setCurrentShipOnDeploy({
      ...currentShipOnDeploy,
      orientation
    })
  }

  const handleChangeCursorLocation = ({ x, y }: TCursorLocation) => {
    setCursorLocation({ x, y });
  }

  const [ playerFleet, setPlayerFleet ] = useState(playerFleetArr);
  const [ enemyFleet, setEnemyFleet ] = useState(enemyFleetArr);
  const [ playerMap, setPlayerMap ] = useState<TMapCoordinate[]>([]);
  const [ enemyMap, setEnemyMap ] = useState<TMapCoordinate[]>([]);
  const [ currentShipOnDeploy, setCurrentShipOnDeploy] = useState<TCurrentShipOnDeploy | null>(null);
  const [ cursorLocation, setCursorLocation ] = useState<TCursorLocation | null>(null);
  // TODO: add state for current player turn
  // TODO: add state for winner of game

  const currentShipOnDeployLength = currentShipOnDeploy ? SHIP_TYPES[currentShipOnDeploy.shipId].length : null;

  return (
    <section className={styles['GamePage']}>
      <FleetMenu
        shipList={playerFleet}
        onDeployingShip={handleDeployingShip}
        currentShipOnDeploy={currentShipOnDeploy}
      />
      <FleetMenu
        shipList={enemyFleet}
        onDeployingShip={handleDeployingShip}
        currentShipOnDeploy={currentShipOnDeploy}
      />
      <BattleMap
        width={mapSize}
        height={mapSize}
        mapCoordinates={playerMap}
        currentShipOnDeploy={currentShipOnDeploy}
        onDeployedShip={handleDeployedShip}
        onChangeOrientation={handleChangeOrientation}
        onChangeCursorLocation={handleChangeCursorLocation}
      />
      <BattleMap
        width={mapSize}
        height={mapSize}
        mapCoordinates={enemyMap}
        currentShipOnDeploy={currentShipOnDeploy}
        onDeployedShip={handleDeployedShip}
        onChangeOrientation={handleChangeOrientation}
        onChangeCursorLocation={handleChangeCursorLocation}
      />
      {currentShipOnDeploy && cursorLocation && (
        <CursorShadowShip
          isVisible={true}
          length={currentShipOnDeployLength}
          orientation={currentShipOnDeploy.orientation}
          locationX={cursorLocation.x}
          locationY={cursorLocation.y}
        />
      )}
    </section>
  )
}