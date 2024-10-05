import { FleetMenu } from '~/components/FleetInfoCard';
import styles from './GamePage.module.css';
import { TCurrentShipOnDeploy, TCursorLocation, TOrientationType, TFleet, TShipId, TShipPart, TMap, TCoordinate } from '~/types/game';
import { BattleMap } from '~/components/BattleMap';
import { DEFAULT_ORIENTATION, MAXIMUM_MAP_SIZE, SHIP_TYPES } from '~/constants/game';
import { useEffect, useState } from 'react';
import { CursorShadowShip } from '~/components/CursorShadowShip';
import { attackMap, autoFleetDeploy, getNextCoordinates, getRandomCoordinate, playerIsWinner } from '~/utils';
import { FloatingStartPanel } from '~/components/FloatingStartPanel/FloatingStartPanel';
import { AttackControl } from '~/components/AttackControl';
// import { useState } from 'react';

export const GamePage = () => {
  // Set fleet & map size for each player
  const availableFleetIds: TShipId[] = [
    // 'missile_launcher',
    // 'battleship',
    'destroyer',
    'submarine',
  ];
  const mapSize = MAXIMUM_MAP_SIZE;

  // Generate fleet & map data for state
  const commonFleetArr: TFleet = availableFleetIds.map(shipId => {
    return {
      id: shipId,
      name: SHIP_TYPES[shipId].name,
      health: SHIP_TYPES[shipId].length,
      isDeployed: false,
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
  const [ playerTargetCoordinates, setPlayerTargetCoordinates] = useState<TCoordinate | null>(null);
  const [ opponentTargetCoordinates, setOpponentTargetCoordinates] = useState<TCoordinate>({x: 'a', y: 1});
  const [ isShot, setIsShot] = useState(false);
  // TODO: add state for winner of game

  // console.log(opponentMap.map(coor => coor.x + coor.y + " - attacked: " + coor.attacked).join('\n'));
  useEffect(() => {
    const { fleet, map } = autoFleetDeploy(mapSize, [...commonFleetArr], []);
    setOpponentMap(map);
    setOpponentFleet(fleet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentShipOnDeployLength = currentShipOnDeploy ? SHIP_TYPES[currentShipOnDeploy.shipId].length : null;

  const isPlayerFleetDeployed = playerFleet.every(ship => ship.isDeployed);

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
          isDeployed: true
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
          shipId,
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
    if (isPlayerFleetDeployed) {
      setIsReady(true);
      setPlayerTargetCoordinates({x: 'a', y: 1})
    }
  }

  const handleChangeTargetCoordinates = (coordinateAxis: 'x' | 'y', value: string) => {
    if (!playerTargetCoordinates) return;
    // TODO: add validates for correct coordinates
    const newPropCoordinate = coordinateAxis === 'x'
      ? {x: value}
      : {y: Number(value)};
    setPlayerTargetCoordinates({
      ...playerTargetCoordinates,
      ...newPropCoordinate,
    });

    //TODO: add view tarjet in tile aimed
  }

  const handlePlayerShoot = () => {
    setIsShot(true);
  }

  const handlePlayerFinishesShot = () => {
    if (!playerTargetCoordinates) return;

    const {
      fleet: newOpponentFleet,
      map: newOpponentMap
    } = attackMap(opponentMap, playerTargetCoordinates, opponentFleet);
    setOpponentMap(newOpponentMap);
    setOpponentFleet(newOpponentFleet);
    setIsShot(false);
    setIsPlayerTurn(false)

    const isWinner = playerIsWinner(playerFleet, opponentFleet);
    if (isWinner !== null) {
      showWinner(isWinner)
      return;
    }
  }

  const handleOpponentShoot = () => {
    let targetCoordinates: null | TCoordinate = null;
    // setTimeout(() => {
    //   targetCoordinates = getRandomCoordinate();
    //   setOpponentTargetCoordinates(targetCoordinates);
    //   setIsShot(true);
    // }, 3000);

    let secs = 1;
    const timer = setInterval(() => {
      if (secs === 2) {
        targetCoordinates = getRandomCoordinate();
        setOpponentTargetCoordinates(targetCoordinates);
      } else if (secs === 3) {
        setIsShot(true);
        clearInterval(timer);
      }
      secs++;
    }, 1000)
  }

  const handleOpponentFinishesShooting = () => {
    const {
      fleet: newPlayerFleet,
      map: newPlayerMap,
    } = attackMap(playerMap, opponentTargetCoordinates, playerFleet);
    setPlayerMap(newPlayerMap);
    setPlayerFleet(newPlayerFleet);
    setIsShot(false);
    setIsPlayerTurn(true);

    const isWinner = playerIsWinner(playerFleet, opponentFleet);
    if (isWinner !== null) {
      showWinner(isWinner)
      return;
    }

    console.log('👦 turno del jugador ===============');
  }

  const showWinner = (isWinner: boolean) => {
    const finalMessage = isWinner ? '👦 Player is the Winner! :D' : '🖥 The PC is the Winner';
    setIsReady(false);
    alert(finalMessage);
  }

  useEffect(() => {
    if (isReady && !isPlayerTurn) {
      console.log('🖥 turno de la PC ===============');
      handleOpponentShoot();
      // setTimeout(() => {
      // }, 3000)
    }
  }, [isPlayerTurn, isReady])

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
        targetCoordinates={opponentTargetCoordinates}
        isReady={isReady}
        showSight={!isPlayerTurn}
        isShot={isShot}
        isInTurn={!isPlayerTurn}
        onDeployedShip={handleDeployedShip}
        onChangeOrientation={handleChangeOrientation}
        onChangeCursorLocation={handleChangeCursorLocation}
        onFinishesShot={handleOpponentFinishesShooting}
      />
      <BattleMap
        width={mapSize}
        height={mapSize}
        mapCoordinates={opponentMap}
        currentShipOnDeploy={currentShipOnDeploy}
        targetCoordinates={playerTargetCoordinates}
        disabled={!isReady}
        isReady={isReady}
        showSight={isPlayerTurn}
        isShot={isShot}
        isInTurn={isPlayerTurn}
        onDeployedShip={handleDeployedShip}
        onChangeOrientation={handleChangeOrientation}
        onChangeCursorLocation={handleChangeCursorLocation}
        onFinishesShot={handlePlayerFinishesShot}
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
      {isPlayerTurn && isReady && playerTargetCoordinates && (
        <div className='floating-attack-control'>
          <AttackControl
            targetCoordinates={playerTargetCoordinates}
            onChangeTargetCoordinates={handleChangeTargetCoordinates}
            onShoot={handlePlayerShoot}
          />
        </div>
      )}
    </section>
  )
}