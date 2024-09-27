import { FleetMenu } from '~/components/FleetInfoCard';
import styles from './GamePage.module.css';
import { TCurrentShipOnDeploy, TCursorLocation, TOrientationType, TFleet, TShipId, TShipPart, TMap, TCoordinate } from '~/types/game';
import { BattleMap } from '~/components/BattleMap';
import { DEFAULT_ORIENTATION, MAXIMUM_MAP_SIZE, SHIP_TYPES } from '~/constants/game';
import { useEffect, useState } from 'react';
import { CursorShadowShip } from '~/components/CursorShadowShip';
import { autoFleetDeploy, getNextCoordinates } from '~/utils';
import { FloatingStartPanel } from '~/components/FloatingStartPanel/FloatingStartPanel';
import { AttackControl } from '~/components/AttackControl';
// import { useState } from 'react';

export const GamePage = () => {
  // Set fleet & map size for each player
  const availableFleetIds: TShipId[] = [
    'missile_launcher',
    'destroyer',
    'battleship',
    'submarine',
  ];
  const mapSize = MAXIMUM_MAP_SIZE;

  // Generate fleet & map data for state
  const commonFleetArr: TFleet = availableFleetIds.map(shipId => {
    return {
      id: shipId,
      name: SHIP_TYPES[shipId].name,
      health: SHIP_TYPES[shipId].length,
      location: null,
    }
  })

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

  const [ playerFleet, setPlayerFleet ] = useState([...commonFleetArr]);
  const [ opponentFleet, setOpponentFleet ] = useState([...commonFleetArr]);
  const [ playerMap, setPlayerMap ] = useState<TMap>([]);
  const [ opponentMap, setOpponentMap ] = useState<TMap>([]);
  const [ currentShipOnDeploy, setCurrentShipOnDeploy] = useState<TCurrentShipOnDeploy | null>(null);
  const [ cursorLocation, setCursorLocation ] = useState<TCursorLocation | null>(null);
  const [ isReady, setIsReady ] = useState(false);
  const [ isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [ targetCoordinates, setTargetCoordinates] = useState<TCoordinate>({x: 'a', y: 1})
  // TODO: add state for winner of game

  // console.log(opponentMap.map(coor => coor.x + coor.y + " - attacked: " + coor.attacked).join('\n'));
  useEffect(() => {
    const { fleet, map } = autoFleetDeploy(mapSize, [...commonFleetArr], []);
    setOpponentMap(map);
    setOpponentFleet(fleet);
  }, [])

  const currentShipOnDeployLength = currentShipOnDeploy ? SHIP_TYPES[currentShipOnDeploy.shipId].length : null;

  const isPlayerFleetDeployed = playerFleet.every(ship => ship.location !== null);

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
    shipId: TShipId, locationX: string, locationY: number, orientation: TOrientationType
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
    const coordinatesInMap: TMap = coveredCoordinates.map((coor, index) => {
      let shipPart: TShipPart | undefined;
      if (index === 0) shipPart = 'start'
      else if (index === coveredCoordinates.length - 1) shipPart = 'end';
      else shipPart = 'middle';

      return {
        x: coor.x,
        y: Number(coor.y),
        covered: {
          orientation,
          shipPart
        },
        attacked: false,
      }
    });
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

  const handleStartGame = () => {
    if (isPlayerFleetDeployed) setIsReady(true);
  }

  const handleChangeTargetCoordinates = (coordinateAxis: 'x' | 'y', value: string) => {
    // TODO: add validates for correct coordinates
    const newPropCoordinate = coordinateAxis === 'x'
      ? {x: value}
      : {y: Number(value)};
    setTargetCoordinates({
      ...targetCoordinates,
      ...newPropCoordinate,
    });

    //TODO: add view tarjet in tile aimed
  }

  const handleShoot = () => {
    //TODO: start animation
    const { x, y } = targetCoordinates;
    const newOpponentMap: TMap = [];
    let foundCoordinateShooted = false;
    for (const coor of opponentMap) {
      if (coor.x !== x || coor.y !== y) {
        newOpponentMap.push({...coor});
      } else {
        foundCoordinateShooted = true;
        newOpponentMap.push({
          ...coor,
          attacked: true,
        });
      }
    }
    if (!foundCoordinateShooted) {
      newOpponentMap.push({
        x, y, attacked: true, covered: false
      })
    }
    setOpponentMap(newOpponentMap)
  }

  return (
    <section className={styles['GamePage']}>
      <FleetMenu
        shipList={playerFleet}
        onDeployingShip={handleDeployingShip}
        currentShipOnDeploy={currentShipOnDeploy}
      />
      <FleetMenu
        shipList={opponentFleet}
        onDeployingShip={handleDeployingShip}
        currentShipOnDeploy={currentShipOnDeploy}
      />
      <BattleMap
        width={mapSize}
        height={mapSize}
        mapCoordinates={playerMap}
        currentShipOnDeploy={currentShipOnDeploy}
        targetCoordinates={{x: 'a', y: 1}}
        isReady={isReady}
        onDeployedShip={handleDeployedShip}
        onChangeOrientation={handleChangeOrientation}
        onChangeCursorLocation={handleChangeCursorLocation}
      />
      <BattleMap
        width={mapSize}
        height={mapSize}
        mapCoordinates={opponentMap}
        currentShipOnDeploy={currentShipOnDeploy}
        targetCoordinates={targetCoordinates}
        isReady={isReady}
        onDeployedShip={handleDeployedShip}
        onChangeOrientation={handleChangeOrientation}
        onChangeCursorLocation={handleChangeCursorLocation}
        disabled={!isReady}
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
      {!isReady && (
        <FloatingStartPanel
          isStartButtonDisabled={!isPlayerFleetDeployed}
          onClick={handleStartGame}
        />
      )}
      {isPlayerTurn && isReady && (
        <div className='floating-attack-control'>
          <AttackControl
            targetCoordinates={targetCoordinates}
            onChangeTargetCoordinates={handleChangeTargetCoordinates}
            onShoot={handleShoot}
          />
        </div>
      )}
    </section>
  )
}