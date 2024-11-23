import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./GamePage.module.css";
import {
  FleetMenu,
  BattleMap,
  CursorShadowShip,
  FloatingStartPanel,
  AttackControl,
  ResultsModal,
} from "~/components";
import {
  TCursorLocation,
  TOrientationType,
  TShipId,
  TMap,
  TCoordinate,
} from "~/types/game";
import { AVAILABLE_FLEET_IDS, MAP_SIZE, SHIP_TYPES } from "~/constants/game";
import {
  attackMap,
  autoFleetDeploy,
  getNextCoordinates,
  getRandomCoordinate,
  getShipPartByIndex,
  calculatePlayerIsWinner,
  prepareFleet,
  isFleetDefeated,
  checkCoordinateValue,
} from "~/utils";
import {
  useGameStore,
  useOpponentStore,
  usePlayerStore,
  useShipDeployStore,
} from "~/stores";

export const GamePage = () => {
  // Set fleet & map size for each player

  // Generate fleet & map data for state
  const commonFleetArr = useMemo(() => prepareFleet(AVAILABLE_FLEET_IDS), []);

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
    gamePhase,
    // hasGameStarted,
    isPlayerTurn,
    isShooting,
    isPlayerWins,
    startGame,
    endGame,
    // toggleTurn,
    startsShooting,
    endShooting,
    setPlayerWins,
    restartState: restartGameState,
    endShootingAndToggleTurn,
  } = useGameStore();

  const {
    fleet: opponentFleet,
    map: opponentMap,
    targetCoordinates: opponentTargetCoordinates,
    setFleet: setOpponentFleet,
    setMap: setOpponentMap,
    setTargetCoordinates: setOpponentTargetCoordinates,
    message: opponentMessage,
    setMessage: setOpponentMessage,
    restartState: restartOpponentState,
  } = useOpponentStore();

  const {
    fleet: playerFleet,
    map: playerMap,
    targetCoordinates: playerTargetCoordinates,
    setFleet: setPlayerFleet,
    setMap: setPlayerMap,
    deployShipInFleet,
    updateTargetCoordinateX: updatePlayerTargetCoordinateX,
    updateTargetCoordinateY: updatePlayerTargetCoordinateY,
    message: playerMessage,
    setMessage: setPlayerMessage,
    restartState: restartPlayerState,
  } = usePlayerStore();

  const {
    shipId: shipOnDeployId,
    orientation: shipOnDeployOrientation,
    hasShipOnDeploy,
    setShipOnDeploy,
    setOrientation,
    clearShipOnDeploy,
    restartState: restartShipDeployState,
  } = useShipDeployStore();

  const [cursorLocation, setCursorLocation] = useState<TCursorLocation | null>(
    null
  );

  const restartGame = useCallback(() => {
    restartGameState();
    restartOpponentState();
    restartPlayerState();
    restartShipDeployState();
  }, [
    restartGameState,
    restartOpponentState,
    restartPlayerState,
    restartShipDeployState,
  ]);

  // Only first render
  useEffect(() => {
    setPlayerFleet([...commonFleetArr]);
  }, [commonFleetArr, setPlayerFleet]);

  // When prestart game for player action
  useEffect(() => {
    if (gamePhase !== "prestart") return;

    const { fleet, map } = autoFleetDeploy(MAP_SIZE, [...commonFleetArr], []);
    setOpponentMap(map);
    setOpponentFleet(fleet);
    setPlayerFleet([...commonFleetArr]);
  }, [
    commonFleetArr,
    gamePhase,
    setOpponentFleet,
    setOpponentMap,
    setPlayerFleet,
  ]);

  const currentShipOnDeployLength = shipOnDeployId
    ? SHIP_TYPES[shipOnDeployId].length
    : null;

  const isPlayerFleetDeployed = playerFleet.every((ship) => ship.isDeployed);

  // Calculate winner
  useEffect(() => {
    if (!playerFleet.length || !opponentFleet.length) return;

    const isWinner = calculatePlayerIsWinner(playerFleet, opponentFleet);
    if (isWinner !== null && gamePhase === "start") {
      endGame();
      setPlayerWins(isWinner);
    }
  }, [endGame, gamePhase, opponentFleet, playerFleet, setPlayerWins]);

  const handleDeployingShip = (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => {
    setShipOnDeploy(shipId);
    setCursorLocation({
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
    if (!isPlayerFleetDeployed) return;
    startGame();
  };

  const handleChangeTargetCoordinates = (
    coordinateAxis: "x" | "y",
    value: string
  ) => {
    if (coordinateAxis === "x" && checkCoordinateValue("x", value)) {
      updatePlayerTargetCoordinateX(value);
    } else if (coordinateAxis === "y" && checkCoordinateValue("y", value)) {
      updatePlayerTargetCoordinateY(Number(value));
    }
  };

  const handlePlayerFinishesShot = useCallback(() => {
    if (!playerTargetCoordinates.x || !playerTargetCoordinates.y) return;

    const { fleet: newOpponentFleet, map: newOpponentMap } = attackMap(
      playerTargetCoordinates as TCoordinate,
      opponentMap,
      opponentFleet
    );
    setOpponentMap(newOpponentMap);
    setOpponentFleet(newOpponentFleet);

    if (isFleetDefeated(newOpponentFleet)) {
      endShooting();
    } else {
      endShootingAndToggleTurn();
    }
  }, [
    endShooting,
    endShootingAndToggleTurn,
    opponentFleet,
    opponentMap,
    playerTargetCoordinates,
    setOpponentFleet,
    setOpponentMap,
  ]);

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

  const handleOpponentFinishesShooting = useCallback(() => {
    if (!opponentTargetCoordinates.x || !opponentTargetCoordinates.y) return;

    const { fleet: newPlayerFleet, map: newPlayerMap } = attackMap(
      opponentTargetCoordinates as TCoordinate,
      playerMap,
      playerFleet
    );
    setPlayerMap(newPlayerMap);
    setPlayerFleet(newPlayerFleet);

    if (isFleetDefeated(newPlayerFleet)) {
      endShooting();
    } else {
      endShootingAndToggleTurn();
    }
  }, [
    endShooting,
    endShootingAndToggleTurn,
    opponentTargetCoordinates,
    playerFleet,
    playerMap,
    setPlayerFleet,
    setPlayerMap,
  ]);

  // Manage player & opponent messages
  useEffect(() => {
    setPlayerMessage(
      gamePhase === "prestart"
        ? "Despliega tus unidades y comienza la batalla"
        : isPlayerTurn
        ? "Es turno de atacar!"
        : "Es el turno del oponente"
    );
    setOpponentMessage(
      gamePhase === "prestart"
        ? "En espera"
        : isPlayerTurn
        ? "Esperando turno"
        : "Buscando objetivo..."
    );
  }, [gamePhase, isPlayerTurn, setOpponentMessage, setPlayerMessage]);

  // Manage opponent shooting
  useEffect(() => {
    if (gamePhase === "start" && !isPlayerTurn) {
      handleOpponentShoot();
    }
  }, [isPlayerTurn, gamePhase, handleOpponentShoot]);

  const isAttackControlDisabled = !(isPlayerTurn && gamePhase === "start");

  return (
    <>
      <section className={styles["GamePage"]}>
        <FleetMenu
          shipList={playerFleet}
          primaryText="mi flota"
          secondaryText={playerMessage}
          onDeployingShip={handleDeployingShip}
          shipOnDeployId={shipOnDeployId}
        />
        <FleetMenu
          shipList={opponentFleet}
          primaryText="flota enemiga"
          secondaryText={opponentMessage}
          onDeployingShip={handleDeployingShip}
          shipOnDeployId={shipOnDeployId}
        />
        <BattleMap
          mapCoordinates={playerMap}
          currentShipOnDeploy={{
            shipId: shipOnDeployId,
            orientation: shipOnDeployOrientation,
          }}
          targetCoordinates={opponentTargetCoordinates}
          isReady={gamePhase === "start"}
          isShooting={isShooting}
          isInTurn={!isPlayerTurn}
          onDeployedShip={handleDeployedShip}
          onChangeOrientation={handleChangeOrientation}
          onChangeCursorLocation={handleChangeCursorLocation}
          onFinishesShot={handleOpponentFinishesShooting}
        />
        <BattleMap
          mapCoordinates={opponentMap}
          currentShipOnDeploy={{
            shipId: shipOnDeployId,
            orientation: shipOnDeployOrientation,
          }}
          targetCoordinates={playerTargetCoordinates}
          disabled={gamePhase !== "start"}
          isReady={gamePhase === "start"}
          isShooting={isShooting}
          isInTurn={isPlayerTurn}
          onDeployedShip={handleDeployedShip}
          onChangeOrientation={handleChangeOrientation}
          onChangeCursorLocation={handleChangeCursorLocation}
          onFinishesShot={handlePlayerFinishesShot}
        />
        <AttackControl
          targetCoordinates={playerTargetCoordinates}
          onChangeTargetCoordinates={handleChangeTargetCoordinates}
          onShootButtonClick={startsShooting}
          disabled={isAttackControlDisabled}
        />
        {gamePhase === "prestart" && (
          <FloatingStartPanel
            isStartButtonDisabled={!isPlayerFleetDeployed}
            onClick={handleStartGame}
          />
        )}
      </section>
      {isPlayerWins !== null ? (
        <ResultsModal
          type={isPlayerWins ? "win" : "fail"}
          onRetryClick={restartGame}
          onToHomeClick={() => console.log("To home")}
        />
      ) : (
        <></>
      )}
      {shipOnDeployId && cursorLocation && (
        <CursorShadowShip
          length={currentShipOnDeployLength}
          orientation={shipOnDeployOrientation}
          locationX={cursorLocation.left}
          locationY={cursorLocation.top}
        />
      )}
    </>
  );
};
