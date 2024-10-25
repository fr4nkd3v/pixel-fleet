import { useCallback, useEffect } from "react";
import styles from "./GamePage.module.css";
import {
  FleetMenu,
  BattleMap,
  CursorShadowShip,
  FloatingStartPanel,
  AttackControl,
} from "~/components";
import {
  TCursorLocation,
  TOrientationType,
  TFleet,
  TShipId,
  TMap,
  TCoordinate,
} from "~/types/game";
import { MAXIMUM_MAP_SIZE, SHIP_TYPES } from "~/constants/game";
import {
  attackMap,
  autoFleetDeploy,
  getNextCoordinates,
  getRandomCoordinate,
  getShipPartByIndex,
  playerIsWinner,
  prepareFleet,
} from "~/utils";
import {
  useGameStore,
  useOpponentStore,
  usePlayerStore,
  useShipDeployStore,
} from "~/stores";

export const GamePage = () => {
  // Set fleet & map size for each player
  const availableFleetIds: TShipId[] = [
    // 'missile_launcher',
    // 'battleship',
    "destroyer",
    "submarine",
  ];
  const mapSize = MAXIMUM_MAP_SIZE;

  // Generate fleet & map data for state
  const commonFleetArr: TFleet = prepareFleet(availableFleetIds);

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

  const {
    hasStarted,
    isPlayerTurn,
    isShooting,
    startGame,
    endGame,
    setPlayerTurn,
    setOpponentTurn,
    startsShooting,
    finishShooting,
  } = useGameStore();

  const {
    fleet: opponentFleet,
    map: opponentMap,
    targetCoordinates: opponentTargetCoordinates,
    setFleet: setOpponentFleet,
    setMap: setOpponentMap,
    setTargetCoordinates: setOpponentTargetCoordinates,
  } = useOpponentStore();

  const {
    fleet: playerFleet,
    map: playerMap,
    targetCoordinates: playerTargetCoordinates,
    setFleet: setPlayerFleet,
    setMap: setPlayerMap,
    deployShipInFleet,
    setTargetCoordinates: setPlayerTargetCoordinates,
    updateTargetCoordinateX: updatePlayerTargetCoordinateX,
    updateTargetCoordinateY: updatePlayerTargetCoordinateY,
  } = usePlayerStore();

  const {
    shipId: shipOnDeployId,
    orientation: shipOnDeployOrientation,
    cursorLocation,
    hasShipOnDeploy,
    setShipOnDeploy,
    setOrientation,
    setCursorLocation,
    clearShipOnDeploy,
  } = useShipDeployStore();

  useEffect(() => {
    const { fleet, map } = autoFleetDeploy(mapSize, [...commonFleetArr], []);
    setOpponentMap(map);
    setOpponentFleet(fleet);
    setPlayerFleet([...commonFleetArr]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentShipOnDeployLength = shipOnDeployId
    ? SHIP_TYPES[shipOnDeployId].length
    : null;

  const isPlayerFleetDeployed = playerFleet.every((ship) => ship.isDeployed);

  const handleDeployingShip = (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => {
    setShipOnDeploy(shipId, {
      left: locationX,
      top: locationY,
    });
  };

  const handleDeployedShip = (
    shipId: TShipId,
    locationX: string,
    locationY: number,
    orientation: TOrientationType
  ) => {
    if (!hasShipOnDeploy) return;

    const nextCoordinates = getNextCoordinates(
      locationX,
      Number(locationY),
      SHIP_TYPES[shipId].length,
      shipOnDeployOrientation
    );
    const coveredCoordinates: TMap = nextCoordinates.map((coor, index) => {
      const shipPart = getShipPartByIndex(index, nextCoordinates.length);
      return {
        x: coor.x,
        y: Number(coor.y),
        covered: {
          shipId,
          orientation,
          shipPart,
        },
        attacked: false,
      };
    });

    deployShipInFleet(shipId, coveredCoordinates);
    clearShipOnDeploy();
  };

  const handleChangeOrientation = (orientation: TOrientationType) => {
    setOrientation(orientation);
  };

  const handleChangeCursorLocation = ({ left, top }: TCursorLocation) => {
    setCursorLocation({ left, top });
  };

  const handleStartGame = () => {
    if (isPlayerFleetDeployed) {
      startGame();
      setPlayerTargetCoordinates({ x: "a", y: 1 });
    }
  };

  const handleChangeTargetCoordinates = (
    coordinateAxis: "x" | "y",
    value: string
  ) => {
    if (!playerTargetCoordinates) return;
    // TODO: add validates for correct coordinates
    if (coordinateAxis === "x") updatePlayerTargetCoordinateX(value);
    else updatePlayerTargetCoordinateY(Number(value));
  };

  const handlePlayerShoot = () => {
    startsShooting();
  };

  const handlePlayerFinishesShot = () => {
    if (!playerTargetCoordinates) return;

    const { fleet: newOpponentFleet, map: newOpponentMap } = attackMap(
      opponentMap,
      playerTargetCoordinates,
      opponentFleet
    );
    setOpponentMap(newOpponentMap);
    setOpponentFleet(newOpponentFleet);
    finishShooting();
    setOpponentTurn();

    const isWinner = playerIsWinner(playerFleet, opponentFleet);
    if (isWinner !== null) {
      showWinner(isWinner);
      return;
    }
  };

  const handleOpponentShoot = useCallback(() => {
    let targetCoordinates: null | TCoordinate = null;
    let secs = 1;
    const timer = setInterval(() => {
      if (secs === 2) {
        targetCoordinates = getRandomCoordinate();
        setOpponentTargetCoordinates(targetCoordinates);
      } else if (secs === 3) {
        startsShooting();
        clearInterval(timer);
      }
      secs++;
    }, 1000);
  }, [setOpponentTargetCoordinates, startsShooting]);

  const handleOpponentFinishesShooting = () => {
    if (!opponentTargetCoordinates) return;

    const { fleet: newPlayerFleet, map: newPlayerMap } = attackMap(
      playerMap,
      opponentTargetCoordinates,
      playerFleet
    );
    setPlayerMap(newPlayerMap);
    setPlayerFleet(newPlayerFleet);
    finishShooting();
    setPlayerTurn();

    const isWinner = playerIsWinner(playerFleet, opponentFleet);
    if (isWinner !== null) {
      showWinner(isWinner);
      return;
    }

    console.log("👦 turno del jugador ===============");
  };

  const showWinner = (isWinner: boolean) => {
    const finalMessage = isWinner
      ? "👦 Player is the Winner! :D"
      : "🖥 The PC is the Winner";
    endGame();
    alert(finalMessage);
  };

  useEffect(() => {
    if (hasStarted && !isPlayerTurn) {
      console.log("🖥 turno de la PC ===============");
      handleOpponentShoot();
    }
  }, [isPlayerTurn, hasStarted, handleOpponentShoot]);

  return (
    <section className={styles["GamePage"]}>
      <FleetMenu
        shipList={playerFleet}
        onDeployingShip={handleDeployingShip}
        shipOnDeployId={shipOnDeployId}
      />
      <FleetMenu
        shipList={opponentFleet}
        onDeployingShip={handleDeployingShip}
        shipOnDeployId={shipOnDeployId}
      />
      <BattleMap
        width={mapSize}
        height={mapSize}
        mapCoordinates={playerMap}
        currentShipOnDeploy={{
          shipId: shipOnDeployId,
          orientation: shipOnDeployOrientation,
        }}
        targetCoordinates={opponentTargetCoordinates}
        isReady={hasStarted}
        showSight={!isPlayerTurn}
        isShot={isShooting}
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
        currentShipOnDeploy={{
          shipId: shipOnDeployId,
          orientation: shipOnDeployOrientation,
        }}
        targetCoordinates={playerTargetCoordinates}
        disabled={!hasStarted}
        isReady={hasStarted}
        showSight={isPlayerTurn}
        isShot={isShooting}
        isInTurn={isPlayerTurn}
        onDeployedShip={handleDeployedShip}
        onChangeOrientation={handleChangeOrientation}
        onChangeCursorLocation={handleChangeCursorLocation}
        onFinishesShot={handlePlayerFinishesShot}
      />
      {shipOnDeployId && cursorLocation && (
        <CursorShadowShip
          isVisible={true}
          length={currentShipOnDeployLength}
          orientation={shipOnDeployOrientation}
          locationX={cursorLocation.left}
          locationY={cursorLocation.top}
        />
      )}
      {!hasStarted && (
        <FloatingStartPanel
          isStartButtonDisabled={!isPlayerFleetDeployed}
          onClick={handleStartGame}
        />
      )}
      {isPlayerTurn && hasStarted && playerTargetCoordinates && (
        <div className="floating-attack-control">
          <AttackControl
            targetCoordinates={playerTargetCoordinates}
            onChangeTargetCoordinates={handleChangeTargetCoordinates}
            onShoot={handlePlayerShoot}
          />
        </div>
      )}
    </section>
  );
};
